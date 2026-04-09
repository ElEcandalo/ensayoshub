import { FastifyInstance } from 'fastify';

const TARIFFS = {
  rehearsal: { weekday: 17000, weekend_holiday: 18000 },
  class: { weekday: 19000, weekend_holiday: 20000 },
};

export async function tariffRoutes(app: FastifyInstance) {
  app.get('/tariffs', async () => {
    return {
      tariffs: TARIFFS,
      lastUpdated: '2026-01-01',
    };
  });
}