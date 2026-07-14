import { z } from 'zod';
import { TeamMemberRepository } from './ports/team-member-repository';
import { TeamRepository } from './ports/team-repository';
import { OrganizationMemberRepository } from './ports/organization-member-repository';
import { EventPublisher } from './ports/event-publisher';
import {
  TeamNotFoundError,
  NotTeamAdminError,
  AlreadyTeamMemberError,
  NotOrganizationMemberError,
} from '../domain/errors';

export const AddTeamMemberInput = z.object({
  userId: z.string().uuid(),
  teamId: z.string().uuid(),
  memberUserId: z.string().uuid(),
  role: z.enum(['member', 'admin']).default('member'),
});

export type AddTeamMemberInputType = z.infer<typeof AddTeamMemberInput>;

export class AddTeamMember {
  constructor(
    private teamRepository: TeamRepository,
    private teamMemberRepository: TeamMemberRepository,
    private organizationMemberRepository: OrganizationMemberRepository,
    private eventPublisher: EventPublisher,
  ) {}

  async execute(input: AddTeamMemberInputType) {
    const validatedInput = AddTeamMemberInput.parse(input);

    const team = await this.teamRepository.findById(validatedInput.teamId);
    if (!team) {
      throw new TeamNotFoundError();
    }

    const adminMembership = await this.teamMemberRepository.findByTeamAndUser(
      validatedInput.teamId,
      validatedInput.userId,
    );
    if (!adminMembership || adminMembership.role !== 'admin') {
      throw new NotTeamAdminError();
    }

    const orgMembership = await this.organizationMemberRepository.findByOrganizationAndUser(
      team.organizationId,
      validatedInput.memberUserId,
    );
    if (!orgMembership) {
      throw new NotOrganizationMemberError();
    }

    const existing = await this.teamMemberRepository.findByTeamAndUser(
      validatedInput.teamId,
      validatedInput.memberUserId,
    );
    if (existing) {
      throw new AlreadyTeamMemberError();
    }

    const member = await this.teamMemberRepository.create({
      teamId: validatedInput.teamId,
      userId: validatedInput.memberUserId,
      role: validatedInput.role,
    });

    await this.eventPublisher.publish({
      type: 'TeamMemberAdded',
      userId: validatedInput.userId,
      timestamp: new Date(),
      teamId: validatedInput.teamId,
      memberUserId: validatedInput.memberUserId,
    });

    return {
      id: member.id,
      userId: member.userId,
      role: member.role,
      joinedAt: member.createdAt,
    };
  }
}
