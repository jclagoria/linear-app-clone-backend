export class ProjectNotFoundError extends Error {
  constructor(message: string = 'Project not found') {
    super(message);
    this.name = 'ProjectNotFoundError';
  }
}

export class InvalidProjectStatusTransitionError extends Error {
  constructor(message: string = 'Invalid project status transition') {
    super(message);
    this.name = 'InvalidProjectStatusTransitionError';
  }
}

export class ProjectDateValidationError extends Error {
  constructor(message: string = 'Target date must be after start date') {
    super(message);
    this.name = 'ProjectDateValidationError';
  }
}

export class EmptyProjectNameError extends Error {
  constructor(message: string = 'Project name cannot be empty') {
    super(message);
    this.name = 'EmptyProjectNameError';
  }
}

export class NotProjectTeamMemberError extends Error {
  constructor(message: string = 'User is not a member of this project\'s team') {
    super(message);
    this.name = 'NotProjectTeamMemberError';
  }
}

export class IssueAlreadyInProjectError extends Error {
  constructor(message: string = 'Issue is already associated with a different project') {
    super(message);
    this.name = 'IssueAlreadyInProjectError';
  }
}

export class ProjectCancelNotAdminError extends Error {
  constructor(message: string = 'Only team admins can cancel projects') {
    super(message);
    this.name = 'ProjectCancelNotAdminError';
  }
}

export class CannotReopenCompletedProjectError extends Error {
  constructor(message: string = 'Cannot reopen a completed project') {
    super(message);
    this.name = 'CannotReopenCompletedProjectError';
  }
}

export class ProjectHardDeleteNotAllowedError extends Error {
  constructor(message: string = 'Projects cannot be hard deleted. Use Canceled status instead.') {
    super(message);
    this.name = 'ProjectHardDeleteNotAllowedError';
  }
}
