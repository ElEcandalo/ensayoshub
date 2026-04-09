import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../../lib/db.js';
import { expenses } from '../../db/schema.js';
import { eq, and, gte, lte } from 'drizzle-orm';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { errors } from '../../middleware/error.js';

const createExpenseSchema = z.object({
  amount: z.number().positive(),
  categoryId: z.string().uuid().optional(),
  description: z.string().optional(),
  dueDate: z.string(),
  paymentDate: z.string().optional(),
  paymentStatus: z.enum(['pending', 'paid', 'overdue']).default('pending'),
  recurrenceType: z.enum(['none', 'weekly', 'monthly', 'yearly']).default('none'),
  receiptUrl: z.string().url().optional(),
});

export async function expenseRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAdmin);

  app.get('/', async (request, reply) => {
    const { dueDateStart, dueDateEnd, paymentStatus } = request.query as any;
    
    const conditions = [];
    if (dueDateStart) conditions.push(gte(expenses.dueDate, dueDateStart));
    if (dueDateEnd) conditions.push(lte(expenses.dueDate, dueDateEnd));
    if (paymentStatus) conditions.push(eq(expenses.paymentStatus, paymentStatus));
    
    const result = await db.query.expenses.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: { category: true },
      orderBy: (expenses, { asc }) => [asc(expenses.dueDate)],
    });
    
    return result;
  });

  app.post('/', async (request, reply) => {
    const data = createExpenseSchema.parse(request.body);
    const userId = request.user?.id;
    
    const [expense] = await db.insert(expenses).values({
      amount: data.amount.toString(),
      categoryId: data.categoryId,
      description: data.description,
      dueDate: data.dueDate,
      paymentDate: data.paymentDate,
      paymentStatus: data.paymentStatus,
      recurrenceType: data.recurrenceType,
      receiptUrl: data.receiptUrl,
      createdBy: userId,
    }).returning();
    
    return reply.status(201).send(expense);
  });

  app.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const data = createExpenseSchema.partial().parse(request.body);
    
    const updates: any = { ...data };
    if (data.amount) updates.amount = data.amount.toString();
    updates.updatedAt = new Date();
    
    const [expense] = await db.update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();
    
    if (!expense) throw errors.notFound('Expense');
    return expense;
  });

  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const [expense] = await db.delete(expenses)
      .where(eq(expenses.id, id))
      .returning();
    
    if (!expense) throw errors.notFound('Expense');
    return { success: true };
  });
}
