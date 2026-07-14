import { Team, NewTeam } from '../../domain/team';

export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByOrganizationId(organizationId: string): Promise<Team[]>;
  findByKey(organizationId: string, key: string): Promise<Team | null>;
  create(team: NewTeam): Promise<Team>;
  delete(id: string): Promise<void>;
}
