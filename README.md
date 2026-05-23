# Task API — DevGeekWeek 2026 Workshop

A minimal TypeScript REST API for task management, used as the hands-on project for the **AI-Driven Dev Environment** workshop at DevGeekWeek 2026.

The project evolves across the workshop sessions via **git branches** — each branch represents the codebase state after a specific block.

## Quick start

```bash
npm install
npm run dev      # start dev server (watches for changes)
npm test         # run tests
```

The server runs on `http://localhost:3000` by default.

## API

| Method   | Endpoint          | Description          |
|----------|-------------------|----------------------|
| `GET`    | `/api/tasks`      | List all tasks       |
| `GET`    | `/api/tasks/:id`  | Get a task by ID     |
| `POST`   | `/api/tasks`      | Create a task        |
| `PATCH`  | `/api/tasks/:id`  | Update a task        |
| `DELETE` | `/api/tasks/:id`  | Delete a task        |

## Branch strategy

Each branch captures the project state after a workshop block. Participants can `git checkout` any branch to catch up.

| Branch | Session | Description |
|--------|---------|-------------|
| `main` | Starting point | Clean Task API — CRUD, tests, no extras |
| `step/0-opening-demo` | Opening (30 min) | After live demo: `priority` field added by AI agent |
| `step/1-environment-setup` | Block 1 (60 min) | Cursor rules, context config, IDE setup |
| `step/2-everyday-workflows` | Block 2 (75 min) | New feature + refactor + bug fix + tests — AI-driven |
| `step/3-playbook-stack` | Block 3 (60 min) | Full playbook: `.cursorrules`, `CLAUDE.md`, `.qodo` |
| `step/4-measurement-quality` | Block 4 (45 min) | Quality gates, review checklist, metrics |

## Project structure

```
src/
  types.ts    — Task type definitions
  store.ts    — In-memory data store with CRUD functions
  routes.ts   — Express route handlers
  app.ts      — Express app setup
  server.ts   — Entry point
tests/
  tasks.test.ts — API integration tests (vitest + supertest)
```

## Workshop scripts

Facilitator scripts live in the **secretary** repo under `knowledge/courses/devgeekweek-2026-scripts/` (not in this repo).
