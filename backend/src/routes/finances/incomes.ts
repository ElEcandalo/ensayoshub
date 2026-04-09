import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { incomes } from '../../db/schema.js';
import { eq, and, gte, lte } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { errors } from '../../middleware/error.js';

const createIncomeSchema = z.object({
  amount: z.number().positive(),
  description: z.string().optional(),
  date: z.string(),
  bookingId: z.string().uuid().optional(),
});

export async function incomeRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAdmin);

  app.get('/', async (request, reply) => {
    const { startDate, endDate } = request.query as any;
    
    const conditions = [];
    if (startDate) conditions.push(gte(incomes.date, startDate));
    if (endDate) conditions.push(lte(incomes.date, endDate));
    
    const result = await db.query.incomes.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: (incomes, { desc }) => [desc(incomes.date)],
    });
    
    return result;
  });

  app.post('/', async (request, reply) => {
    const data = createIncomeSchema.parse(request.body);
    const userId = request.user?.id;
    
    const [income] = await db.insert(incomes).values({
      amount: data.amount.toString(),
      description: data.description,
      date: data.date,
      bookingId: data.bookingId,
      createdBy: userId,
    }).returning();
    
    return reply.status(201).send(income);
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = createIncomeSchema.partial().parse(request.body);
    
    const [income] = await db.update(incomes)
      .set(data.amount ? { amount: data.amount.toString(), ...data } : data)
      .where(eq(incomes.id, id))
      .returning();
    
    if (!income) throw errors.notFound('Income');
    return income;
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [income] = await db.delete(incomes)
      .where(eq(incomes.id, id))
      .returning();
    
    if (!income) throw errors.notFound('Income');
    return { success: true };
  });
}
