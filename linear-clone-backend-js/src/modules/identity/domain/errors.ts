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
