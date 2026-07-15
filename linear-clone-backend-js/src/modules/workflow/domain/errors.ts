export class StateNotFoundError extends Error {
  constructor(message = 'Workflow state not found') {
    super(message);
    this.name = 'StateNotFoundError';
  }
}

export class TransitionNotFoundError extends Error {
  constructor(message = 'Workflow transition not found') {
    super(message);
    this.name = 'TransitionNotFoundError';
  }
}

export class DuplicateStateNameError extends Error {
  constructor(message = 'A workflow state with this name already exists in the team') {
    super(message);
    this.name = 'DuplicateStateNameError';
  }
}

export class DuplicateTransitionError extends Error {
  constructor(message = 'This transition already exists') {
    super(message);
    this.name = 'DuplicateTransitionError';
  }
}

export class StateInUseError extends Error {
  constructor(message = 'Cannot delete state: it is referenced by existing transitions') {
    super(message);
    this.name = 'StateInUseError';
  }
}

export class MissingUnstartedStateError extends Error {
  constructor(message = 'Team must have at least one unstarted state') {
    super(message);
    this.name = 'MissingUnstartedStateError';
  }
}

export class MissingCompletedStateError extends Error {
  constructor(message = 'Team must have at least one completed state') {
    super(message);
    this.name = 'MissingCompletedStateError';
  }
}

export class MultipleCanceledStatesError extends Error {
  constructor(message = 'Team can have at most one canceled state') {
    super(message);
    this.name = 'MultipleCanceledStatesError';
  }
}

export class NotTeamAdminError extends Error {
  constructor(message = 'Only team administrators can perform this action') {
    super(message);
    this.name = 'NotTeamAdminError';
  }
}
