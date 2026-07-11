---
status: "accepted"
date: 2026-07-11
decision-makers: Backend Team
consulted: None
informed: None
---

# Use bcrypt for Password Hashing

## Context and Problem Statement

The authentication system needs secure password hashing that is resistant to brute force and rainbow table attacks.

## Decision Drivers

- Adaptive cost factor to increase with hardware capabilities
- Built-in salt generation
- Industry standard and well-tested
- Resistance to GPU-based attacks

## Considered Options

- bcrypt
- argon2
- scrypt
- PBKDF2

## Decision Outcome

Chosen option: "bcrypt", because it is the industry standard with proven security track record and built-in Node.js support.

### Consequences

- Good, because widely adopted and well-tested
- Good, because adaptive cost factor
- Good, because built-in salt generation
- Good, because Node.js has native support
- Bad, because slower than some alternatives
- Bad, because vulnerable to side-channel attacks in some implementations

### Confirmation

- Verify password hashing uses adaptive cost factor (12)
- Verify unique salt per user
- Verify plain text passwords are never stored
- Verify timing attacks are mitigated

## Pros and Cons of the Options

### bcrypt

- Good, because industry standard
- Good, because adaptive cost factor
- Good, because built-in salt
- Good, because Node.js native support
- Neutral, because slower than some alternatives
- Bad, because limited by block size

### argon2

- Good, because winner of Password Hashing Competition
- Good, because memory-hard (resistant to GPU attacks)
- Good, because configurable memory and CPU usage
- Neutral, because newer than bcrypt
- Bad, because requires native bindings
- Bad, because less widespread adoption

### scrypt

- Good, because memory-hard
- Good, because configurable parameters
- Neutral, because used by some cryptocurrencies
- Bad, because less widespread than bcrypt
- Bad, because implementation complexity

## More Information

- See `design-backend.md` for password hashing strategy
- See `specs/business/auth.md` for password requirements
