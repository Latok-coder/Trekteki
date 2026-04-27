# ST:CCG Second Edition — Online

Real-time 2-player browser implementation of the Star Trek Customizable Card Game Second Edition.

## Prerequisites

- Node.js 18+
- npm 9+

## Quick Start

```bash
# 1. Clone and install all dependencies
git clone <your-repo>
cd st-ccg-online
npm run install:all

# 2. Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 3. Start both server and client in development mode
npm run dev
```

This starts:
- **Server** on http://localhost:3001
- **Client** on http://localhost:5173

Open two browser tabs to http://localhost:5173 to test the lobby flow locally.

## Project Structure

```
st-ccg-online/
├── server/          Node.js + Express + Socket.io
└── client/          React 18 + Vite + Tailwind CSS
```

See `ARCHITECTURE.md` in the project root for the full design document.

## Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server + client concurrently |
| `npm run dev:server` | Server only |
| `npm run dev:client` | Client only |
| `npm test` | Run server unit tests |

## Build Phases

- [x] **Phase 1** — Lobby & Connection (this release)
- [ ] **Phase 2** — Board Rendering
- [ ] **Phase 3** — Deck Builder
- [ ] **Phase 4** — Play & Draw Phase
- [ ] **Phase 5** — Execute Orders: Movement
- [ ] **Phase 6** — Execute Orders: Mission Attempts
- [ ] **Phase 7** — Events, Interrupts & Order Actions
- [ ] **Phase 8** — Combat & Engagements
- [ ] **Phase 9** — Brig & Advanced Rules
- [ ] **Phase 10** — Card Pool Expansion
