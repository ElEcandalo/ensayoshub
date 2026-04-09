import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../lib/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'collaborator';
}

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const decoded = request.jwtVerify<JwtPayload>();
    const payload = await decoded;
    const userId = payload.sub;
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    if (!user) {
      return reply.status(401).send({ error: 'User not found' });
    }
    
    (request as any).user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authResult = await requireAuth(request, reply);
  if (authResult) return authResult;
  
  const user = (request as any).user as AuthUser | undefined;
  if (user?.role !== 'admin') {
    return reply.status(403).send({ error: 'Admin access required' });
  }
}