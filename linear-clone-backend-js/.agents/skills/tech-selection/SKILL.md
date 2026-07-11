---
name: tech-selection
description: Use when Evaluates technology options from tech-agnostic specs.
license: MIT
version: 4
---

# Tech-Selection Skill

## Description
Evaluates technology options from tech-agnostic specs and generates stack, architecture, and deployment documentation with interactive review. Works with any OpenSpec schema (fullstack, backend, frontend, etc.).

## Step 1: Determine Active Schema

Read `openspec/config.yaml` to find the active schema:

```yaml
schema: <schema-name>  # e.g., fullstack-schema, backend-schema, frontend-schema
```

Let `{schema}` = the value of the `schema` field.

If `schema` is empty or commented out, ask the user which schema to use before proceeding.

## Step 2: Read Inputs

Based on the active schema, read the available inputs. Only read files that exist — skip missing inputs and note the gap.

### Input Matrix

| Schema | Available Inputs |
|--------|------------------|
| `fullstack-schema` | `proposal.md`, `specs/backend/**/*.md`, `specs/frontend/**/*.md`, `user-flows.md`, `design-system.md`, `specs/wireframes/**/*.wireframes`, `mockups/**/*.html` |
| `backend-schema` | `proposal.md`, `specs/backend/**/*.md` |
| `frontend-schema` | `proposal.md`, `specs/frontend/**/*.md`, `user-flows.md`, `design-system.md`, `specs/wireframes/**/*.wireframes`, `mockups/**/*.html` |
| `intent-driven` | `proposal.md`, `specs/**/*.md` |
| `minimalist` | `specs/**/*.md` |
| `behaviour-driven` | `proposal.md`, `specs/**/*.md` |
| `event-driven` | `event-storming.md`, `event-modeling.md`, `specs/**/*.md` |
| `spec-driven-with-adr` | `proposal.md`, `specs/**/*.md` |

### Universal Inputs (all schemas)

These inputs are always read if they exist:

- `proposal.md` — Motivation, scope, capabilities
- `docs/tech-research-digest.md` — Prior tech research (if exists)

### Schema-Specific Inputs

**For backend-focused schemas** (`backend-schema`, `fullstack-schema`):
- `specs/backend/**/*.md` — Backend BDD specs

**For frontend-focused schemas** `frontend-schema`, `fullstack-schema`):
- `specs/frontend/**/*.md` — Frontend BDD specs
- `user-flows.md` — Navigation graphs, screen states
- `design-system.md` — UI component catalog
- `specs/wireframes/**/*.wireframes` — Layout wireframes per screen
- `mockups/**/*.html` — Interactive HTML mockups

**For event-driven schemas** (`event-driven`):
- `event-storming.md` — Domain events, commands, actors
- `event-modeling.md` — Event flows, swim lanes

**For minimal schemas** (`minimalist`, `intent-driven`, `behaviour-driven`, `spec-driven-with-adr`):
- `specs/**/*.md` — All available specs

## Step 3: Read Templates

Templates are located at: `openspec/schemas/{schema}/templates/technology/`

Read these files if they exist:

| Template | Purpose |
|----------|---------|
| `stack-templates.md` | Stack documentation structure |
| `architecture-templates.md` | Architecture documentation structure |
| `deployment-templates.md` | Deployment documentation structure |

**If templates do not exist for the active schema:**
1. Check `openspec/schemas/fullstack-schema/templates/technology/` as fallback
2. If fallback templates exist, use them and note: "Using fallback templates from fullstack-schema"
3. If no templates exist, generate documentation without templates and note the gap

## Step 4: Determine Output Files

Based on the active schema, determine which output files to generate:

### For fullstack-schema (5 files):
1. `docs/stack-backend.md` — Backend stack
2. `docs/stack-frontend.md` — Frontend stack
3. `docs/architecture-backend.md` — Backend architecture
4. `docs/architecture-frontend.md` — Frontend architecture
5. `docs/deployment.md` — Deployment

### For backend-schema (2-3 files):
1. `docs/stack-backend.md` — Backend stack
2. `docs/architecture-backend.md` — Backend architecture
3. `docs/deployment.md` — Deployment (if applicable)

### For frontend-schema (2-3 files):
1. `docs/stack-frontend.md` — Frontend stack
2. `docs/architecture-frontend.md` — Frontend architecture
3. `docs/deployment.md` — Deployment (if applicable)

### For other schemas (1-3 files):
Determine appropriate files based on available inputs. Common options:
- `docs/stack.md` — Technology stack
- `docs/architecture.md` — System architecture
- `docs/deployment.md` — Deployment configuration

## Interactive Review Process

### Phase 1: Generate Draft
Read all available inputs and templates. Produce complete draft for output files. Present to user but do NOT write to disk.

### Phase 2: Decision Summary
Show a numbered table grouping decisions by category:

| # | Category | Decision | Options Evaluated |
|---|----------|----------|-------------------|
| 1 | Backend Runtime | {choice} | {alternatives considered} |
| 2 | Backend Framework | {choice} | {alternatives considered} |
| 3 | Frontend Framework | {choice} | {alternatives considered} |
| 4 | Database | {choice} | {alternatives considered} |
| ... | ... | ... | ... |

Only show categories relevant to the active schema. For `backend-schema`, skip frontend categories. For `frontend-schema`, skip backend categories.

Ask: "Which decisions do you want to challenge? Enter numbers (comma-separated), range (e.g., 3-6), or 'none' to approve all."

### Phase 3: Challenge Loop
For each challenged decision:
1. Show original choice + rationale
2. Present 3-4 alternatives with trade-offs (table format)
3. Include 5th option: "Other (I'll define my own)"
4. Apply choice → regenerate affected sections

**Progress tracker**: `[Reviewed 3 / 8] ████░░░░░`

### Phase 4: Batch Mode
If 5+ decisions challenged, offer:
- (a) Group by category — answer once per category
- (b) Walk through each individually
- (c) Apply one answer to all

### Phase 5: Dependency Propagation
After changes, show:
```
Decision 3 (Database) changed → affects: Decisions 5 (Cache), 7 (Deployment)
Auto-updated: docs/stack-backend.md, docs/deployment.md
```
Re-validate all documents for consistency.

### Phase 6: Final Approval
Show summary of final decisions. Ask user to approve. Only then write files to `docs/`.

### Phase 7: File Verification
After writing, verify every declared output file exists on disk:

1. List each expected output file from Step 4.
2. For each file, confirm it was written (use file read or ls check).
3. If any file is missing, **write it immediately** before reporting completion.
4. Report to user: "Generated N files in `docs/`: [list files]".
5. If a file could not be created, report the error and stop — do not claim success.

**Do NOT mark files as ✅ in the summary without verifying they exist on disk.**

## Checkpoint System
- Save state after each answered challenge
- Format: `Current checkpoint: {challenge_index}/{total_challenges}`
- Allow: "redo last" to revert previous challenge answer
- Allow: "restart category" to reset all decisions in one category

## Validation
Before writing, run:
1. Every NFR in specs has an architectural response (addressed or deferred)
2. No contradiction across generated documents
3. Stack choices are coherent (e.g., JPA backend without a SQL DB is invalid)
4. Architecture matches project type from proposal
5. Deployment is consistent with stack (e.g., containerized stack has Docker section populated)

## Rules
- No speculative tech: prefer technologies the team already uses (check codebase)
- ADR-format rationale for every decision (Context / Decision / Rationale / Trade-offs)
- Decisions must trace back to a requirement in specs or proposal
- All generated docs in English
- Guard against contradictions: if stack says PostgreSQL but deployment says MongoDB, flag it before showing user
- If an input file is missing, skip it and note the gap — do not fail the workflow
- If templates are missing for the active schema, use fullstack-schema templates as fallback
