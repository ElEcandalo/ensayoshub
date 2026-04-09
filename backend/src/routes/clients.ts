import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { clients, bookings } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { requireAuth, type AuthUser } from '../middleware/auth.js';
import { errors } from '../middleware/error.js';

const createClientSchema = z.object({
  name: z.string().min(1),
  email: z.email().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function clientRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/', async (request, reply) => {
    const result = await db.query.clients.findMany({
      orderBy: (clients, { asc }) => [asc(clients.name)],
    });
    return result;
  });

  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, id),
    });
    
    if (!client) throw errors.notFound('Client');
    return client;
  });

  app.get('/:id/bookings', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const clientBookings = await db.query.bookings.findMany({
      where: eq(bookings.clientId, id),
      orderBy: (bookings, { desc }) => [desc(bookings.startTime)],
    });
    
    return clientBookings;
  });

  app.post('/', async (request, reply) => {
    const data = createClientSchema.parse(request.body);
    const user = request.user as AuthUser | undefined;
    const userId = user?.id;
    
    const [client] = await db.insert(clients).values({
      ...data,
      createdBy: userId,
    }).returning();
    
    return reply.status(201).send(client);
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = createClientSchema.partial().parse(request.body);
    
    const [client] = await db.update(clients)
      .set(data)
      .where(eq(clients.id, id))
      .returning();
    
    if (!client) throw errors.notFound('Client');
    return client;
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const clientBookings = await db.query.bookings.findMany({
      where: eq(bookings.clientId, id),
      columns: { id: true },
    });
    
    if (clientBookings.length > 0) {
      await db.delete(bookings).where(inArray(bookings.id, clientBookings.map(b => b.id)));
    }
    
    const [client] = await db.delete(clients)
      .where(eq(clients.id, id))
      .returning();
    
    if (!client) throw errors.notFound('Client');
    return { success: true };
  });
}
