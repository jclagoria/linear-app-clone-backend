# OpenSpec Schema Collection

A reusable schema collection for [OpenSpec](https://github.com/intent-driven-dev/openspec). Each schema is self-contained with artifact definitions, config, and templates.

## Quick Start

1. Pick a schema from the catalog below
2. Copy `schemas/<name>/config.yaml` to `openspec/config.yaml`
3. Fill in the `context:` section with your project details
4. Start working with OpenSpec

## Schema Catalog

| Schema | Artifacts | Flow | Use Case |
|--------|-----------|------|----------|
| `fullstack-schema` | 15 | proposal → specs-backend → specs-frontend → user-flows → design-system → wireframes → mockups → tech-stack → design-backend → design-frontend → adr → tasks-backend → tasks-frontend → review | Full-stack apps with frontend + backend |
| `backend-schema` | 6 | proposal → specs-backend → design-backend → adr → tasks-backend → review | Backend-only services, APIs, data layers |
| `frontend-schema` | 10 | proposal → specs-frontend → user-flows → design-system → wireframes → mockups → design-frontend → adr → tasks-frontend → review | Frontend-only apps, UI components |
| `intent-driven` | 5 | proposal → specs → design → adr → tasks | Proposal-to-tasks with Gherkin specs, design, and ADR review |
| `minimalist` | 2 | specs → tasks | Lightweight: user-story specs → implementation checklist |
| `behaviour-driven` | 4 | proposal → specs → design → tasks | Strict BDD: Gherkin specs → feature files → Cucumber.js acceptance tests |
| `event-driven` | 6 | event-storming → event-modeling → specs → design → asyncapi → tasks | Event discovery → AsyncAPI-first with validation gate |
| `spec-driven-with-adr` | 5 | proposal → specs → design → adr → tasks | Standard OpenSpec flow + persistent ADRs at repo level |

## Example: Switching Schemas

### From fullstack to backend-only

```bash
# Copy backend schema config
cp openspec/schemas/backend-schema/config.yaml openspec/config.yaml

# Edit context section
vim openspec/config.yaml
```

### From fullstack to minimalist

```bash
# Copy minimalist config
cp openspec/schemas/minimalist/config.yaml openspec/config.yaml

# Edit context section
vim openspec/config.yaml
```

## Schema Structure

Each schema directory contains:

```
schemas/<name>/
├── schema.yaml      # Artifact definitions and flow
├── config.yaml      # Rules and context template
├── README.md        # (optional) Schema-specific docs
└── templates/       # Artifact templates
```

## Community Schemas

The following schemas are adapted from [intent-driven-dev/openspec-schemas](https://github.com/intent-driven-dev/openspec-schemas):

- `minimalist`
- `behaviour-driven`
- `event-driven`
- `spec-driven-with-adr`

## Adding a New Schema

1. Create `openspec/schemas/<name>/schema.yaml` with artifact definitions
2. Create `openspec/schemas/<name>/config.yaml` with rules
3. Create `openspec/schemas/<name>/templates/` with artifact templates
4. Add the schema to the catalog table above
