import { FastifyRequest, FastifyReply } from 'fastify';
import { BaseError, InternalError, ValidationError } from './index';

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send(error.toJSON());
  }

  if (error instanceof SyntaxError && 'body' in error) {
    return reply.status(400).send(new ValidationError('Malformed JSON in request body').toJSON());
  }

  request.log.error(error);
  const internalError = new InternalError();
  return reply.status(500).send(internalError.toJSON());
}
