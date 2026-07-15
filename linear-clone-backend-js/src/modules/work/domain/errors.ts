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

export class CommentNotFoundError extends Error {
  constructor(message: string = 'Comment not found') {
    super(message);
    this.name = 'CommentNotFoundError';
  }
}

export class CommentNotOwnedByUserError extends Error {
  constructor(message: string = 'Comment is not owned by the user') {
    super(message);
    this.name = 'CommentNotOwnedByUserError';
  }
}

export class EmptyBodyError extends Error {
  constructor(message: string = 'Body cannot be empty') {
    super(message);
    this.name = 'EmptyBodyError';
  }
}

export class LabelNotFoundError extends Error {
  constructor(message: string = 'Label not found') {
    super(message);
    this.name = 'LabelNotFoundError';
  }
}

export class LabelNameConflictError extends Error {
  constructor(message: string = 'A label with this name already exists') {
    super(message);
    this.name = 'LabelNameConflictError';
  }
}

export class LabelAlreadyAttachedError extends Error {
  constructor(message: string = 'Label is already attached to this issue') {
    super(message);
    this.name = 'LabelAlreadyAttachedError';
  }
}

export class AlreadyWatchingError extends Error {
  constructor(message: string = 'User is already watching this issue') {
    super(message);
    this.name = 'AlreadyWatchingError';
  }
}

export class WatcherNotFoundError extends Error {
  constructor(message: string = 'Watcher not found') {
    super(message);
    this.name = 'WatcherNotFoundError';
  }
}
