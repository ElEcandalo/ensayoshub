import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { bookings, incomes, expenses } from '../db/schema.js';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAdmin);

  app.get('/metrics', async (request, reply) => {
    const { period, startDate, endDate } = request.query as any;
    
    const now = new Date();
    let start: Date;
    let end: Date;
    
    if (period === 'week') {
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      end = now;
    } else if (period === 'year') {
      start = new Date(now.getFullYear(), 0, 1);
      end = now;
    } else {
      start = startDate ? new Date(startDate) : new Date(now.getFullYear(), now.getMonth(), 1);
      end = endDate ? new Date(endDate) : now;
    }
    
    const totalHoursAvailable = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) * 12;
    
    const bookedHours = await db.select({
      hours: sql<number>`SUM(EXTRACT(EPOCH FROM (${bookings.endTime} - ${bookings.startTime})) / 3600)`,
    })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, 'completed'),
          gte(bookings.startTime, start),
          lte(bookings.startTime, end)
        )
      );
    
    const totalIncomes = await db.select({
      total: sql<number>`SUM(${incomes.amount}::numeric)`,
    })
      .from(incomes)
      .where(
        and(
          gte(incomes.date, start.toISOString().split('T')[0]),
          lte(incomes.date, end.toISOString().split('T')[0])
        )
      );
    
    const totalExpenses = await db.select({
      total: sql<number>`SUM(${expenses.amount}::numeric)`,
      pending: sql<number>`SUM(CASE WHEN ${expenses.paymentStatus} = 'pending' THEN ${expenses.amount}::numeric ELSE 0 END)`,
    })
      .from(expenses)
      .where(
        and(
          gte(expenses.dueDate, start.toISOString().split('T')[0]),
          lte(expenses.dueDate, end.toISOString().split('T')[0])
        )
      );
    
    const completedBookings = await db.select({ count: sql<number>`COUNT(*)` })
      .from(bookings)
      .where(and(eq(bookings.status, 'completed'), gte(bookings.startTime, start)));
    
    const totalBookings = await db.select({ count: sql<number>`COUNT(*)` })
      .from(bookings)
      .where(gte(bookings.startTime, start));
    
    const booked = Number(bookedHours[0]?.hours || 0);
    const occupancyRate = totalHoursAvailable > 0 ? booked / totalHoursAvailable : 0;
    const incomesTotal = Number(totalIncomes[0]?.total || 0);
    const expensesTotal = Number(totalExpenses[0]?.total || 0);
    
    return {
      period: { start: start.toISOString().split('T')[0], end: end.toISOString().split('T')[0] },
      metrics: {
        occupancyRate,
        totalHoursBooked: booked,
        totalHoursAvailable,
        totalIncomes: incomesTotal,
        totalExpenses: expensesTotal,
        netProfit: incomesTotal - expensesTotal,
        pendingExpenses: Number(totalExpenses[0]?.pending || 0),
        averagePerBooking: completedBookings[0]?.count > 0 ? incomesTotal / completedBookings[0].count : 0,
        totalBookings: totalBookings[0]?.count || 0,
        completedBookings: completedBookings[0]?.count || 0,
        cancelledBookings: 0,
      },
      comparison: { vsLastPeriod: { incomes: 0, expenses: 0, occupancy: 0 } },
    };
  });
}
