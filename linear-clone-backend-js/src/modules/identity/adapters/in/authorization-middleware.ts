import { FastifyRequest, FastifyReply } from 'fastify';
import { DrizzleOrganizationMemberRepository } from '../out/drizzle-organization-member-repository';
import { NotOrganizationMemberError, NotOrganizationOwnerError } from '../../domain/errors';

const organizationMemberRepository = new DrizzleOrganizationMemberRepository();

export async function requireOrganizationMember(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = (request as any).userId;
  const params = request.params as { organizationId?: string };

  if (!params.organizationId) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Organization ID is required',
      },
    });
  }

  const membership = await organizationMemberRepository.findByOrganizationAndUser(
    params.organizationId,
    userId,
  );

  if (!membership) {
    return reply.status(403).send({
      error: {
        code: 'FORBIDDEN',
        message: 'Not an organization member',
      },
    });
  }

  (request as any).membership = membership;
}

export async function requireOrganizationOwner(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = (request as any).userId;
  const params = request.params as { organizationId?: string };

  if (!params.organizationId) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Organization ID is required',
      },
    });
  }

  const membership = await organizationMemberRepository.findByOrganizationAndUser(
    params.organizationId,
    userId,
  );

  if (!membership || membership.role !== 'owner') {
    return reply.status(403).send({
      error: {
        code: 'FORBIDDEN',
        message: 'Only organization owner can perform this action',
      },
    });
  }

  (request as any).membership = membership;
}
