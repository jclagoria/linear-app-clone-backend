# Identity Module — User Profile & Organization

## Problem Statement

The backend currently handles authentication (registration, login, tokens) but lacks user profile management and organizational structure. Users cannot update their profile information (name, avatar) or create/manage organizations, which are essential containers for teams in the Linear app clone.

## Motivation

This change is needed to:
- Enable users to personalize their accounts with profile information
- Provide organizational structure for team management
- Establish the foundation for team-based workflows
- Complete the identity layer that the auth module depends on

## Scope

- **In scope**:
  - User profile management (get/update profile, avatar URL validation)
  - Organization management (create, list, get details, soft-delete)
  - Organization membership (creator becomes admin)
  - Soft-deletion cascade for organizations (teams, members)
  - Authorization rules (users can only update own profile, only org owner can delete)

- **Out of scope**:
  - Team management within organizations (separate module)
  - User avatar upload/storage (just URL validation)
  - Organization invites/membership management
  - Organization settings/preferences
  - Audit logging for profile changes

## Impact

- **Modules affected**: Identity module (new), Auth module (shared user entity)
- **Database**: New tables for organizations and organization_members
- **API endpoints**: New REST endpoints for profile and organization operations
- **Teams/consumers**: Backend team (implementation), Frontend team (API integration)
- **Dependencies**: Blocked by Ticket 01 (Auth Registration & Login)
