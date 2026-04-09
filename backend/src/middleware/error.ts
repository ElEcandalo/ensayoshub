import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export const errors = {
  notFound: (entity: string) => new AppError(404, `${entity} not found`),
  conflict: (message: string) => new AppError(409, message),
  validation: (message: string) => new AppError(400, message),
  unauthorized: () => new AppError(401, 'Unauthorized'),
  forbidden: () => new AppError(403, 'Access denied'),
};

export async function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({ 
      error: error.message, 
      code: error.code 
    });
  }

  if (error.validation) {
    return reply.status(400).send({ 
      error: 'Validation failed', 
      details: error.validation 
    });
  }

  request.log.error(error);
  return reply.status(500).send({ error: 'Internal server error' });
}
