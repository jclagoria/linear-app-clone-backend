import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetNotificationPreferences } from '../application/get-notification-preferences';
import { UpdateNotificationPreferences } from '../application/update-notification-preferences';

const USER_ID = 'a1b2c3d4-e5f6-4789-abcd-ef0123456701';

const DEFAULT_TYPES = {
  issue_assigned: true,
  issue_mentioned: true,
  comment_added: true,
  statusChanged: true,
  cycle_started: true,
  cycle_completed: true,
};

function makePreferences(overrides = {}) {
  return {
    userId: USER_ID,
    inApp: true,
    email: false,
    types: DEFAULT_TYPES,
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('GetNotificationPreferences', () => {
  const mockPreferencesRepo = {
    getByUserId: vi.fn(),
    upsert: vi.fn(),
  };

  const getNotificationPreferences = new GetNotificationPreferences(
    mockPreferencesRepo,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return existing preferences', async () => {
    mockPreferencesRepo.getByUserId.mockResolvedValue(makePreferences());

    const result = await getNotificationPreferences.execute(USER_ID);

    expect(result.inApp).toBe(true);
    expect(result.email).toBe(false);
    expect(result.types).toEqual(DEFAULT_TYPES);
  });

  it('should create default preferences if not exists', async () => {
    mockPreferencesRepo.getByUserId.mockResolvedValue(null);
    mockPreferencesRepo.upsert.mockResolvedValue(makePreferences());

    const result = await getNotificationPreferences.execute(USER_ID);

    expect(mockPreferencesRepo.upsert).toHaveBeenCalledWith(USER_ID, {
      inApp: true,
      email: false,
      types: DEFAULT_TYPES,
    });
    expect(result.inApp).toBe(true);
  });
});

describe('UpdateNotificationPreferences', () => {
  const mockPreferencesRepo = {
    getByUserId: vi.fn(),
    upsert: vi.fn(),
  };

  const updateNotificationPreferences = new UpdateNotificationPreferences(
    mockPreferencesRepo,
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should partially merge types field', async () => {
    mockPreferencesRepo.getByUserId.mockResolvedValue(makePreferences());
    mockPreferencesRepo.upsert.mockResolvedValue(
      makePreferences({
        types: { ...DEFAULT_TYPES, statusChanged: false },
      }),
    );

    const result = await updateNotificationPreferences.execute(
      { types: { statusChanged: false } },
      USER_ID,
    );

    expect(result.types.statusChanged).toBe(false);
    expect(result.types.issue_assigned).toBe(true); // unchanged
  });

  it('should update inApp and email fields', async () => {
    mockPreferencesRepo.getByUserId.mockResolvedValue(makePreferences());
    mockPreferencesRepo.upsert.mockResolvedValue(
      makePreferences({ inApp: false, email: true }),
    );

    const result = await updateNotificationPreferences.execute(
      { inApp: false, email: true },
      USER_ID,
    );

    expect(result.inApp).toBe(false);
    expect(result.email).toBe(true);
  });

  it('should create preferences on first update (upsert)', async () => {
    mockPreferencesRepo.getByUserId.mockResolvedValue(null);
    mockPreferencesRepo.upsert.mockResolvedValue(
      makePreferences({ inApp: false }),
    );

    const result = await updateNotificationPreferences.execute(
      { inApp: false },
      USER_ID,
    );

    expect(result.inApp).toBe(false);
    expect(mockPreferencesRepo.upsert).toHaveBeenCalledWith(USER_ID, {
      inApp: false,
      email: undefined,
      types: DEFAULT_TYPES,
    });
  });
});
