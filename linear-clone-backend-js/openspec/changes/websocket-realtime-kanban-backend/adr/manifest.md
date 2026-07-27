# ADR Manifest — WebSocket Real-Time Kanban Backend

- Status: completed
- Review date: 2026-07-26

## Review Summary

ADR review completed for this change. Three significant architectural decisions were recorded.

## In-Force ADRs Reviewed

- None — `<repo>/adr/` has no in-force ADRs.

## New Durable ADRs Created

| File | Title | Status |
|------|-------|--------|
| `adr/0001-in-process-event-bridge.md` | In-Process Event Bridge (Work → Gateway) | Accepted |
| `adr/0002-channel-access-validation.md` | Channel Access Validation via Port Queries | Accepted |
| `adr/0003-auto-subscription-on-authentication.md` | Auto-Subscription on Authentication | Accepted |

## Decisions Not Recorded

- WebSocket library choice (`ws`) — not a new decision, already established in project
- In-memory subscription storage — pragmatic choice, not a significant architectural decision
- JWT auth flow — reuses existing infrastructure, no new decision
