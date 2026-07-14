export class ProfileNotFoundError extends Error {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'ProfileNotFoundError';
  }
}

export class OrganizationNotFoundError extends Error {
  constructor(message: string = 'Organization not found') {
    super(message);
    this.name = 'OrganizationNotFoundError';
  }
}

export class OrganizationNameConflictError extends Error {
  constructor(message: string = 'Organization name already exists') {
    super(message);
    this.name = 'OrganizationNameConflictError';
  }
}

export class NotOrganizationMemberError extends Error {
  constructor(message: string = 'Not an organization member') {
    super(message);
    this.name = 'NotOrganizationMemberError';
  }
}

export class NotOrganizationOwnerError extends Error {
  constructor(message: string = 'Only organization owner can perform this action') {
    super(message);
    this.name = 'NotOrganizationOwnerError';
  }
}

export class InvalidAvatarUrlError extends Error {
  constructor(message: string = 'Invalid URL format') {
    super(message);
    this.name = 'InvalidAvatarUrlError';
  }
}

// Team errors
export class TeamNotFoundError extends Error {
  constructor(message: string = 'Team not found') {
    super(message);
    this.name = 'TeamNotFoundError';
  }
}

export class TeamKeyConflictError extends Error {
  constructor(message: string = 'Team key already exists in this organization') {
    super(message);
    this.name = 'TeamKeyConflictError';
  }
}

export class NotTeamMemberError extends Error {
  constructor(message: string = 'Not a team member') {
    super(message);
    this.name = 'NotTeamMemberError';
  }
}

export class NotTeamAdminError extends Error {
  constructor(message: string = 'Only team admins can perform this action') {
    super(message);
    this.name = 'NotTeamAdminError';
  }
}

export class TeamMemberNotFoundError extends Error {
  constructor(message: string = 'Team member not found') {
    super(message);
    this.name = 'TeamMemberNotFoundError';
  }
}

export class AlreadyTeamMemberError extends Error {
  constructor(message: string = 'User is already a team member') {
    super(message);
    this.name = 'AlreadyTeamMemberError';
  }
}

export class LastAdminRemovalError extends Error {
  constructor(message: string = 'Cannot remove the last team admin') {
    super(message);
    this.name = 'LastAdminRemovalError';
  }
}
