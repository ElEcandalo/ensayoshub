import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { db } from '../lib/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { errors } from '../middleware/error.js';
import bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['admin', 'collaborator']).default('admin'),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    const { email, password } = loginSchema.parse(request.body);
    
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (!user || !user.passwordHash) {
      throw errors.unauthorized();
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw errors.unauthorized();
    }
    
    const token = app.jwt.sign({ 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    });
    
    return { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    };
  });

  app.post('/register', async (request, reply) => {
    const data = registerSchema.parse(request.body);
    
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });
    
    if (existing) {
      throw errors.conflict('Email already registered');
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10);
    
    const [user] = await db.insert(users).values({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role,
    }).returning();
    
    const token = app.jwt.sign({ 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    });
    
    return { 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    };
  });

  app.get('/me', { preHandler: [async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      throw errors.unauthorized();
    }
  }] }, async (request) => {
    const payload = request.user as JwtPayload;
    const userId = payload.sub;
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    
    if (!user) {
      throw errors.notFound('User');
    }
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  });
}
