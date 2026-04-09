import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { bookings, clients, incomes } from '../db/schema.js';
import { eq, and, gte, lte, ne, or, sql } from 'drizzle-orm';
import { requireAuth, requireAdmin, type AuthUser } from '../middleware/auth.js';
import { errors } from '../middleware/error.js';

const createBookingSchema = z.object({
  clientId: z.string().uuid(),
  dates: z.array(z.string()).min(1),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  serviceType: z.enum(['rehearsal', 'class']),
  isRecurring: z.boolean().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => {
    const [startHour, startMin] = data.startTime.split(':').map(Number);
    const [endHour, endMin] = data.endTime.split(':').map(Number);
    return (endHour * 60 + endMin) > (startHour * 60 + startMin);
  },
  { message: 'End time must be after start time' }
);

const confirmSchema = z.object({
  amount: z.number().positive(),
  date: z.string(),
});

const completeSchema = z.object({
  actualEndTime: z.string().datetime().optional(),
  extraAmount: z.number().positive().optional(),
});

const TARIFFS = {
  rehearsal: { weekday: 17000, weekend_holiday: 18000 },
  class: { weekday: 19000, weekend_holiday: 20000 },
};

function getTariff(serviceType: 'rehearsal' | 'class', isWeekendOrHoliday: boolean): number {
  const tariffs = TARIFFS[serviceType];
  return isWeekendOrHoliday ? tariffs.weekend_holiday : tariffs.weekday;
}

function isWeekendOrHoliday(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 5 || day === 6; // Domingo, Viernes, Sábado
}

export async function bookingRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/', async (request, reply) => {
    const { startDate, endDate, status, clientId } = request.query as any;
    
    const conditions = [];
    if (startDate) {
      const start = new Date(startDate + '-01').toISOString();
      conditions.push(sql`${bookings.startTime} >= ${start}`);
    }
    if (endDate) {
      const end = new Date(endDate + '-01').toISOString();
      conditions.push(sql`${bookings.startTime} <= ${end}`);
    }
    if (status) conditions.push(eq(bookings.status, status));
    if (clientId) conditions.push(eq(bookings.clientId, clientId));
    
    const result = await db.query.bookings.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: { client: true },
      orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
    });
    
    return result;
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: { client: true },
    });
    
    if (!booking) throw errors.notFound('Booking');
    return booking;
  });

  app.post('/', async (request, reply) => {
    const data = createBookingSchema.parse(request.body);
    const user = request.user as AuthUser | undefined;
    const userId = user?.id;
    
    console.log('=== CREATING BOOKING ===');
    console.log('clientId:', data.clientId);
    console.log('dates:', data.dates);
    console.log('userId:', userId);
    
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, data.clientId),
    });
    if (!client) throw errors.notFound('Client');
    
    const createdBookings = [];
    
    for (const dateStr of data.dates) {
      const startDateTime = new Date(`${dateStr}T${data.startTime}:00`);
      const endDateTime = new Date(`${dateStr}T${data.endTime}:00`);
      const isSpecialRate = isWeekendOrHoliday(startDateTime);
      const amount = getTariff(data.serviceType, isSpecialRate);
      
      console.log('Inserting booking with:', {
        clientId: data.clientId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      });
      
      try {
        const [booking] = await db.insert(bookings).values({
          clientId: data.clientId as any,
          startTime: startDateTime.toISOString() as any,
          endTime: endDateTime.toISOString() as any,
          serviceType: data.serviceType as any,
          status: 'pending' as const,
          isHolidayRate: isSpecialRate,
          baseAmount: amount.toString(),
          notes: data.notes || null,
        }).returning();
        
        createdBookings.push(booking);
        console.log('Created booking:', booking.id);
      } catch (err) {
        console.error('Error inserting:', err);
        throw err;
      }
    }
    
    return reply.status(201).send({ bookings: createdBookings });
  });

  app.post('/:id/confirm', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { amount, date } = confirmSchema.parse(request.body);
    const user = request.user as AuthUser | undefined;
    const userId = user?.id;
    
    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.status, 'pending')),
    });
    
    if (!booking) throw errors.notFound('Booking');
    
    const [updatedBooking] = await db.update(bookings)
      .set({ status: 'confirmed' })
      .where(eq(bookings.id, id))
      .returning();
    
    const [income] = await db.insert(incomes).values({
      amount: amount.toString(),
      bookingId: id,
      description: `Seña reserva`,
      date,
      createdBy: userId,
    }).returning();
    
    return { booking: updatedBooking, income };
  });

  app.post('/:id/complete', { preHandler: requireAdmin }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { actualEndTime, extraAmount } = completeSchema.parse(request.body);
    const user = request.user as AuthUser | undefined;
    const userId = user?.id;
    
    const booking = await db.query.bookings.findFirst({
      where: and(eq(bookings.id, id), eq(bookings.status, 'confirmed')),
    });
    
    if (!booking) throw errors.notFound('Booking');
    
    const updates: any = { status: 'completed' };
    if (actualEndTime) updates.actualEndTime = new Date(actualEndTime);
    if (extraAmount) updates.extraAmount = extraAmount.toString();
    
    const [updatedBooking] = await db.update(bookings)
      .set(updates)
      .where(eq(bookings.id, id))
      .returning();
    
    let income;
    if (extraAmount && extraAmount > 0) {
      [income] = await db.insert(incomes).values({
        amount: extraAmount.toString(),
        bookingId: id,
        description: `Excedente horario`,
        date: new Date().toISOString().split('T')[0],
        createdBy: userId,
      }).returning();
    }
    
    return { booking: updatedBooking, income };
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
    });
    
    if (!booking) throw errors.notFound('Booking');
    
    await db.update(bookings)
      .set({ status: 'cancelled' })
      .where(eq(bookings.id, id));
    
    return { success: true };
  });

  app.get('/check-availability', async (request, reply) => {
    const { date, startTime, endTime, excludeBookingId } = request.query as any;
    
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    
    const conditions = [
      ne(bookings.status, 'cancelled'),
      sql`${bookings.startTime} < ${end}`,
      sql`${bookings.endTime} > ${start}`,
    ];
    
    if (excludeBookingId) {
      conditions.push(ne(bookings.id, excludeBookingId));
    }
    
    const conflicts = await db.query.bookings.findMany({
      where: and(...conditions),
    });
    
    return { available: conflicts.length === 0, conflicts };
  });
}
