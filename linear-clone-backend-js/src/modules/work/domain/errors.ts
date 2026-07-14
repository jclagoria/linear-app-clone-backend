export class InvalidTransitionError extends Error {
  constructor(message: string = 'Invalid status transition') {
    super(message);
    this.name = 'InvalidTransitionError';
  }
}

export class TeamMismatchError extends Error {
  constructor(message: string = 'Resource must belong to the same team') {
    super(message);
    this.name = 'TeamMismatchError';
  }
}

export class IssueNotFoundError extends Error {
  constructor(message: string = 'Issue not found') {
    super(message);
    this.name = 'IssueNotFoundError';
  }
}

export class NotTeamMemberError extends Error {
  constructor(message: string = 'User is not a member of this team') {
    super(message);
    this.name = 'NotTeamMemberError';
  }
}

export class EmptyTitleError extends Error {
  constructor(message: string = 'Title cannot be empty') {
    super(message);
    this.name = 'EmptyTitleError';
  }
}

export class InvalidPriorityError extends Error {
  constructor(message: string = 'Priority must be between 0 and 4') {
    super(message);
    this.name = 'InvalidPriorityError';
  }
}
