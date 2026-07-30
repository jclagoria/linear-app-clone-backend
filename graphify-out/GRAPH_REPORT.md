# Graph Report - linear-app-clone-backend  (2026-07-28)

## Corpus Check
- 513 files · ~226,459 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 17 nodes · 15 edges · 3 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5ac3f47f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- linear-clone-backend-js/AGENTS.md
- RTK (Rust Token Killer) - Token-Optimized Commands
- Mandatory Project Rules

## God Nodes (most connected - your core abstractions)
1. `Mandatory Project Rules` - 4 edges
2. `RTK (Rust Token Killer) - Token-Optimized Commands` - 3 edges
3. `Key Commands` - 1 edges
4. `Rules` - 1 edges
5. `1. CodeGraph + Graphify (Code Intelligence)` - 1 edges
6. `2. Memory (Persistent Knowledge)` - 1 edges
7. `3. RTK - Optimized Commands (Token Savings)` - 1 edges
8. `Git (59-80% savings)` - 1 edges
9. `Files & Search (60-75% savings)` - 1 edges
10. `Test (90-99% savings) — shows failures only` - 1 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (3 total, 0 thin omitted)

### Community 0 - "linear-clone-backend-js/AGENTS.md"
Cohesion: 0.22
Nodes (8): Analysis (70-90% savings), Build & Lint (80-90% savings) — shows errors only, Files & Search (60-75% savings), Git (59-80% savings), GitHub (26-87% savings), Infrastructure (85% savings), Package managers (70-90% savings), Test (90-99% savings) — shows failures only

### Community 1 - "RTK (Rust Token Killer) - Token-Optimized Commands"
Cohesion: 0.50
Nodes (3): Key Commands, RTK (Rust Token Killer) - Token-Optimized Commands, Rules

### Community 2 - "Mandatory Project Rules"
Cohesion: 0.50
Nodes (4): 1. CodeGraph + Graphify (Code Intelligence), 2. Memory (Persistent Knowledge), 3. RTK - Optimized Commands (Token Savings), Mandatory Project Rules

## Knowledge Gaps
- **13 isolated node(s):** `Key Commands`, `Rules`, `1. CodeGraph + Graphify (Code Intelligence)`, `2. Memory (Persistent Knowledge)`, `3. RTK - Optimized Commands (Token Savings)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Mandatory Project Rules` connect `Mandatory Project Rules` to `linear-clone-backend-js/AGENTS.md`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **What connects `Key Commands`, `Rules`, `1. CodeGraph + Graphify (Code Intelligence)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._