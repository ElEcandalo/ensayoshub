import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { authRoutes } from './routes/auth.js';
import { bookingRoutes } from './routes/bookings.js';
import { clientRoutes } from './routes/clients.js';
import { incomeRoutes } from './routes/finances/incomes.js';
import { expenseRoutes } from './routes/finances/expenses.js';
import { categoryRoutes } from './routes/categories.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { tariffRoutes } from './routes/tariffs.js';
import { errorHandler } from './middleware/error.js';

const PORT = parseInt(process.env.PORT || '3001');

const app = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  },
});

await app.register(cors, { origin: true });
await app.register(jwt, { secret: process.env.JWT_SECRET || 'supersecretkey' });

app.setErrorHandler(errorHandler);

app.get('/health', async () => ({ status: 'ok' }));

app.register(authRoutes, { prefix: '/api/v1/auth' });
app.register(bookingRoutes, { prefix: '/api/v1/bookings' });
app.register(clientRoutes, { prefix: '/api/v1/clients' });
app.register(incomeRoutes, { prefix: '/api/v1/incomes' });
app.register(expenseRoutes, { prefix: '/api/v1/expenses' });
app.register(categoryRoutes, { prefix: '/api/v1/categories' });
app.register(dashboardRoutes, { prefix: '/api/v1/dashboard' });
app.register(tariffRoutes, { prefix: '/api/v1' });

const start = async () => {
  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
