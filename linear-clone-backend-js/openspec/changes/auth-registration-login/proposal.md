# Auth Module — Registration & Login

## Problem Statement

The backend system requires a foundational authentication layer to secure all API endpoints. Without user registration and login, there is no way to identify users, manage sessions, or enforce access control across the platform.

## Motivation

This is the first backend module to implement and a prerequisite for all other modules (Identity, Work, Workflow, Project, Cycle, Notification, Gateway). Every subsequent feature depends on authenticated users and valid sessions. Implementing this module unblocks development of the entire system.

## Scope

- **In scope**:
  - User registration with email, name, and password
  - Email validation (format and uniqueness)
  - Password hashing (one-way, with salt)
  - User record creation in `users` table
  - Access token (15 min) and refresh token (7 days) issuance on registration
  - User login with email/password
  - Invalid credentials returning `UnauthorizedError` (401)
  - Session record creation with IP and user agent on login
  - Session limit enforcement (10 max, oldest by `last_activity_at` evicted)
  - Rate limiting: 5 login attempts/min per IP, 3 registrations/min per IP
  - Login event emission for audit logging
  - Remember Me option extending refresh token to 30 days
  - Token validation (signature verification, expiry check)

- **Out of scope**:
  - Token refresh (atomic part 1.3) — handled in a separate change
  - Logout (atomic part 1.4) — handled in a separate change
  - Session list/revoke (atomic parts 1.6–1.8) — handled in a separate change
  - Email verification flow
  - Password reset flow
  - OAuth/social login
  - Multi-factor authentication

## Impact

- **Modules affected**: Auth Module (primary), Identity Module (consumes `UserRegistered` and `UserLoggedIn` events), Shared Module (rate limiting, error types)
- **Storage**: `users` table (owned by Auth), `sessions` table (owned by Auth)
- **Downstream consumers**: All modules that require authenticated user context
- **Teams**: Backend team — this is the foundational module that unblocks all other backend work
