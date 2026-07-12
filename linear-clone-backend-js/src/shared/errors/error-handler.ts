import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  // Log the error
  request.log.error(error);

  // Handle known error types
  if (error.name === 'ConflictError') {
    return reply.status(409).send({
      error: {
        code: 'CONFLICT',
        message: error.message,
      },
    });
  }

  if (error.name === 'UnauthorizedError') {
    return reply.status(401).send({
      error: {
        code: 'UNAUTHORIZED',
        message: error.message,
      },
    });
  }

  if (error.name === 'ValidationError') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
      },
    });
  }

  // Default to 500
  return reply.status(500).send({
    error: {
      code: 'SERVER_ERROR',
      message: 'Internal server error',
    },
  });
}
