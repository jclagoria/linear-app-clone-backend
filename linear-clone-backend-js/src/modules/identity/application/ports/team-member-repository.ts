import { TeamMember, NewTeamMember } from '../../domain/team-member';

export interface TeamMemberRepository {
  findById(id: string): Promise<TeamMember | null>;
  findByTeamId(teamId: string): Promise<TeamMember[]>;
  findByUserId(userId: string): Promise<TeamMember[]>;
  findByTeamAndUser(teamId: string, userId: string): Promise<TeamMember | null>;
  create(member: NewTeamMember): Promise<TeamMember>;
  deleteByTeamId(teamId: string): Promise<void>;
  deleteByTeamAndUser(teamId: string, userId: string): Promise<void>;
  countAdminsByTeamId(teamId: string): Promise<number>;
}
