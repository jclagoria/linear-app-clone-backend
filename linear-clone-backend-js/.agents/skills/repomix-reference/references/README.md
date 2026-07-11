# Repomix Reference Files

This directory contains Repomix output files used by the `repomix-reference` skill.

## Files

- `repomix-output-backend.md` — Backend technical research (Java, Node.js, Python, Go, Rust, cross-cutting).
- `repomix-output-frontend.md` — Frontend technical research (Angular, React, Svelte, Vue, cross-cutting).

## Regeneration

To regenerate these files from the project's source trees, use the script at the project root:

```bash
./scripts/repomix-regenerate.sh
```

This will produce updated Repomix outputs in this directory.

## Usage

The skill reads these files during Setup Mode to create a condensed digest (`tech-research-digest.md`). The digest is then used for validation in subsequent runs.