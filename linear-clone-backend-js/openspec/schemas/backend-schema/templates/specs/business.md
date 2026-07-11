# {Domain} — Business Specification

## Behaviour

**Feature:** {Feature title}

{Rule or purpose description using RFC 2119 keywords (SHALL, MUST, SHOULD).}

### Requirement: {RequirementName}

#### Scenario: {ScenarioName}

- **GIVEN** {precondition}
- **WHEN** {action/event}
- **THEN** {expected outcome}
- **AND** {additional assertion}

#### Scenario: {AnotherScenarioName}

- **GIVEN** {precondition}
- **WHEN** {action/event}
- **THEN** {expected outcome}

## Data Model

### {Entity}

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| {field} | {type} | {nullable, unique, FK} | {notes} |

### Relationships

{Entity A} --{cardinality}--> {Entity B}: {description}

## Business Rules

{Rules, validations, permissions, side effects.}

## Security

{Authentication, authorization, input sanitization.}
