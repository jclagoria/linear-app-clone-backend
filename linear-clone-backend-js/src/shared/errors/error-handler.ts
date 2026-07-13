import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseError, InternalError } from './index';

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }

  request.log.error(error);
  const internalError = new InternalError();
  return reply.status(500).send(internalError.toJSON());
}
