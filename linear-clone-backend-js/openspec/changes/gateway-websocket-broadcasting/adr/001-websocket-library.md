---
status: "accepted"
date: 2026-07-16
decision-makers: "Juan Carlos Lagoria"
---

# Use `ws` Library for WebSocket Server

## Context and Problem Statement

The Gateway Module needs a WebSocket server for real-time communication. There are two main options: a lightweight raw WebSocket library (`ws`) or a full-featured framework (Socket.IO). We need to choose which to use.

## Decision Drivers

- Minimal dependency footprint
- No need for fallback transports (modern browsers all support WebSocket)
- Must integrate with existing Fastify server
- Client-side is not part of this backend (frontend team chooses their own client)

## Considered Options

- `ws` — Lightweight WebSocket library for Node.js
- Socket.IO — Full-featured WebSocket framework with rooms, namespaces, auto-reconnection
- Fastify WebSocket plugin (`@fastify/websocket`) — Integration plugin wrapping `ws`

## Decision Outcome

Chosen option: "`ws` library", because it provides the raw WebSocket protocol support needed without unwanted abstraction, and the missing features (rooms, auto-reconnect) must be implemented in application code anyway to match the specific channel subscription design.

### Consequences

- Good, because minimal dependency with no extra overhead
- Good, because full control over the protocol and message format
- Bad, because rooms/namespaces must be implemented manually
- Bad, because no built-in client reconnection (frontend handles it)
- Neutral, because Fastify WebSocket plugin could be added later if HTTP+WS on same port is needed

### Confirmation

The `ws` package MUST be listed in `package.json` dependencies. The WebSocket server MUST be instantiated directly via `new WebSocketServer()`, not through Socket.IO.

## Pros and Cons of the Options

### `ws`

- Good, because lightweight (~60KB), no extra dependencies
- Good, because native WebSocket API, standard-compliant
- Good, because well-maintained and battle-tested
- Bad, because no built-in room/channel abstraction
- Neutral, because Fastify integration requires manual setup

### Socket.IO

- Good, because built-in rooms and namespaces
- Good, because auto-reconnection and fallback transports
- Bad, because heavier dependency (~200KB+)
- Bad, because client-side library is coupled (frontend must use Socket.IO client)
- Bad, because custom channel subscription logic would fight Socket.IO rooms

### `@fastify/websocket`

- Good, because integrates WebSocket into Fastify route handling
- Good, because same port for HTTP and WS
- Bad, because couples WebSocket lifecycle to Fastify
- Bad, because still requires `ws` underneath with added abstraction
