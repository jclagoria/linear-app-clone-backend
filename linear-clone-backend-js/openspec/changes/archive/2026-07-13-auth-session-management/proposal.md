# Auth Module — Session Management

## Problem Statement

Users currently have no visibility into where their account is logged in or the ability to manage active sessions. If a session is compromised or a user forgets to log out on a shared device, there is no self-service mechanism to revoke access. Additionally, unbounded sessions create a resource leak and potential security risk.

## Motivation

Session management is a standard security requirement for multi-device applications. It provides:
- **User trust**: Users can see and control which devices have access to their account.
- **Security**: Stolen refresh tokens can be revoked remotely, limiting damage.
- **Compliance**: Session visibility and revocation are common in SOC 2 / GDPR audits.
- **Resource hygiene**: Enforcing a session limit prevents unbounded Redis key growth.

## Scope

- **In scope**:
  - List active sessions for authenticated user (with device info, current session marker)
  - Revoke a specific session by ID (including current session = logout)
  - Revoke all sessions except current (sign out everywhere)
  - Session limit enforcement (max 10 active sessions per user)
  - Eviction of oldest session by `last_activity_at` when limit exceeded
  - Session revocation event emission for audit logging

- **Out of scope**:
  - Session editing (rename, extend TTL)
  - Admin-level session management (force logout for a user)
  - Push/email notifications for new logins
  - Session analytics or device fingerprinting
  - Changes to existing login/logout/refresh flows (those handle their own session lifecycle)

## Impact

- **Auth module**: New use cases (ListSessions, RevokeSession, RevokeAllSessions) added to application layer; new outbound ports for session queries; new inbound adapter (controller/routes).
- **Redis session store**: Needs query support (list by user ID, delete by session ID) beyond current key-value operations.
- **Event bus**: Session revocation events consumed by audit/Notification modules (future).
- **Frontend**: Will need UI to display sessions and trigger revocation (separate task).
- **API contract**: Three new endpoints under `/api/v1/auth/sessions`.
