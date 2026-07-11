# Technology Templates — Backend Schema

This directory can hold backend-specific technology templates.

## Fallback Behavior

If templates are not found here, the tech-selection skill will use templates from:
```
openspec/schemas/fullstack-schema/templates/technology/
```

## Customizing Templates

To use backend-specific templates, copy from fullstack-schema and customize:

```bash
cp openspec/schemas/fullstack-schema/templates/technology/*.md openspec/schemas/backend-schema/templates/technology/
```

Then edit the files to focus on backend-specific concerns:
- `stack-templates.md` — Backend stack documentation
- `architecture-templates.md` — Backend architecture documentation
- `deployment-templates.md` — Backend deployment documentation
