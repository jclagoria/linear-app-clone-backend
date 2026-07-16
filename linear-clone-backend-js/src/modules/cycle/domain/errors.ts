export class CycleNotFoundError extends Error {
  constructor(message: string = 'Cycle not found') {
    super(message);
    this.name = 'CycleNotFoundError';
  }
}

export class InvalidCycleStatusTransitionError extends Error {
  constructor(message: string = 'Invalid cycle status transition') {
    super(message);
    this.name = 'InvalidCycleStatusTransitionError';
  }
}

export class CycleDateValidationError extends Error {
  constructor(message: string = 'End date must be after start date') {
    super(message);
    this.name = 'CycleDateValidationError';
  }
}

export class EmptyCycleNameError extends Error {
  constructor(message: string = 'Cycle name cannot be empty') {
    super(message);
    this.name = 'EmptyCycleNameError';
  }
}

export class NotCycleTeamMemberError extends Error {
  constructor(message: string = 'User is not a member of this cycle\'s team') {
    super(message);
    this.name = 'NotCycleTeamMemberError';
  }
}

export class CyclePastStartDateError extends Error {
  constructor(message: string = 'Start date must be today or future') {
    super(message);
    this.name = 'CyclePastStartDateError';
  }
}

export class DraftCycleCannotBeCompletedError extends Error {
  constructor(message: string = 'Draft cycles must be activated before completion') {
    super(message);
    this.name = 'DraftCycleCannotBeCompletedError';
  }
}

export class CompletedCycleCannotBeActivatedError extends Error {
  constructor(message: string = 'Completed cycles cannot be activated') {
    super(message);
    this.name = 'CompletedCycleCannotBeActivatedError';
  }
}

export class ActiveCycleCannotBeDeletedError extends Error {
  constructor(message: string = 'Active cycles cannot be deleted') {
    super(message);
    this.name = 'ActiveCycleCannotBeDeletedError';
  }
}

export class CycleNotActiveForIssueAssignmentError extends Error {
  constructor(message: string = 'Issues can only be assigned to active cycles') {
    super(message);
    this.name = 'CycleNotActiveForIssueAssignmentError';
  }
}
