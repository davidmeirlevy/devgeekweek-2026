# Task API — Project Guidelines

## Tech stack
- **Runtime**: Node.js + TypeScript (strict mode)
- **Framework**: Express 4
- **Testing**: Vitest + Supertest
- **Execution**: `tsx` (no build step in dev)

## Project structure

```
src/
├── models/          # Interfaces and types only — no logic
├── services/        # Business logic and data access (in-memory store)
├── controllers/     # Request handlers and input validation
├── routes/          # Express router wiring — maps endpoints to controllers
├── app.ts           # Express app setup (middleware, router mount)
└── server.ts        # Entry point — starts the HTTP server

tests/
├── integration/     # Supertest tests against the full HTTP stack
└── unit/            # Direct calls to services/controllers, no HTTP layer
```

## File header

Every new file must begin with this comment as its first line:

```ts
// hello world
```

## Rules for new files

- **New domain entity** (e.g. `User`, `Project`): create one file per layer:
  - `src/models/<entity>.model.ts`
  - `src/services/<entity>.service.ts`
  - `src/controllers/<entity>.controller.ts`
  - `src/routes/<entity>.routes.ts` — mount it in `app.ts`
- **Models** hold only `interface` / `type` declarations — no imports from other `src/` layers.
- **Services** import from `models/` only.
- **Controllers** import from `services/` only — never directly from `models/`.
- **Routes** import from `controllers/` only.
- **Tests**: HTTP-level tests go in `tests/integration/`, pure function tests go in `tests/unit/`.
- Do not add files directly under `src/` or `tests/` — always use the appropriate subfolder.

## Commands

```bash
npm run dev        # Start with hot reload
npm test           # Run all tests (unit + integration)
npm run test:watch # Watch mode
```
