import { FastifyInstance } from 'fastify';
import { db } from '../lib/db.js';
import { categories } from '../db/schema.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

export async function categoryRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth);

  app.get('/', async (request, reply) => {
    const result = await db.query.categories.findMany({
      orderBy: (categories, { asc }) => [asc(categories.name)],
    });
    return result;
  });
}
