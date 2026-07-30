import { describe, it, expect, vi } from 'vitest';
import { ListUserTeams } from '../application/list-user-teams';
import type { TeamMemberRepository } from '../application/ports/team-member-repository';
import type { TeamRepository } from '../application/ports/team-repository';
import type { OrganizationRepository } from '../application/ports/organization-repository';

function createMocks() {
  const teamMemberRepository: TeamMemberRepository = {
    findById: vi.fn(),
    findByTeamId: vi.fn(),
    findByUserId: vi.fn(),
    findByTeamAndUser: vi.fn(),
    create: vi.fn(),
    deleteByTeamId: vi.fn(),
    deleteByTeamAndUser: vi.fn(),
    countAdminsByTeamId: vi.fn(),
  };

  const teamRepository: TeamRepository = {
    findById: vi.fn(),
    findByOrganizationId: vi.fn(),
    findByKey: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  };

  const organizationRepository: OrganizationRepository = {
    findById: vi.fn(),
    findByName: vi.fn(),
    findByOwnerId: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  };

  return { teamMemberRepository, teamRepository, organizationRepository };
}

const orgId = '00000000-0000-4000-a000-000000000001';
const teamId = '00000000-0000-4000-a000-000000000010';
const orgName = 'Acme Corp';

describe('ListUserTeams', () => {
  it('should return teams for a user with memberships', async () => {
    const mocks = createMocks();

    vi.mocked(mocks.teamMemberRepository.findByUserId).mockResolvedValue([
      {
        id: 'member-1',
        teamId,
        userId: 'user-1',
        role: 'member',
        createdAt: new Date(),
        deletedAt: null,
      },
    ]);

    vi.mocked(mocks.teamRepository.findById).mockResolvedValue({
      id: teamId,
      organizationId: orgId,
      name: 'Engineering',
      key: 'ENG',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    vi.mocked(mocks.organizationRepository.findById).mockResolvedValue({
      id: orgId,
      name: orgName,
      ownerId: 'owner-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const useCase = new ListUserTeams(
      mocks.teamMemberRepository,
      mocks.teamRepository,
      mocks.organizationRepository,
    );

    const result = await useCase.execute('user-1');

    expect(result.teams).toHaveLength(1);
    expect(result.teams[0]).toEqual({
      id: teamId,
      name: 'Engineering',
      key: 'ENG',
      orgId,
      orgName,
    });
  });

  it('should return empty array for user with no memberships', async () => {
    const mocks = createMocks();
    vi.mocked(mocks.teamMemberRepository.findByUserId).mockResolvedValue([]);

    const useCase = new ListUserTeams(
      mocks.teamMemberRepository,
      mocks.teamRepository,
      mocks.organizationRepository,
    );

    const result = await useCase.execute('user-2');

    expect(result.teams).toHaveLength(0);
  });

  it('should skip memberships where team was not found', async () => {
    const mocks = createMocks();

    vi.mocked(mocks.teamMemberRepository.findByUserId).mockResolvedValue([
      {
        id: 'member-1',
        teamId: 'missing-team',
        userId: 'user-1',
        role: 'member',
        createdAt: new Date(),
        deletedAt: null,
      },
    ]);

    vi.mocked(mocks.teamRepository.findById).mockResolvedValue(null);

    const useCase = new ListUserTeams(
      mocks.teamMemberRepository,
      mocks.teamRepository,
      mocks.organizationRepository,
    );

    const result = await useCase.execute('user-1');

    expect(result.teams).toHaveLength(0);
  });
});
