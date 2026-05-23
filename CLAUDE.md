# CLAUDE.md — Task API

## What is this project?
A minimal TypeScript REST API for task management (Express + Vitest). Used as a workshop demo project.

## Commands
- `npm run dev` — start dev server with hot reload
- `npm test` — run all tests (vitest)
- `npm run test:watch` — run tests in watch mode

## Architecture
- **src/types.ts** — shared type definitions
- **src/models/** — data layer (in-memory store, CRUD)
- **src/services/** — business logic (calls models)
- **src/controllers/** — HTTP layer (validation, request/response)
- **src/routes/** — route definitions (maps paths → controllers)
- **src/app.ts** — Express app wiring
- **src/server.ts** — HTTP server entry point
- **tests/unit/** — unit tests for services
- **tests/integration/** — API tests via supertest

## Conventions
- Controllers validate; services contain logic; models handle data.
- Guard-clause style (return early on error).
- Named exports for models/services/controllers; default exports for routers/app.
- Specific routes before parameterized routes.
- Tests reset state with `clear()` from model in `beforeEach`.
- Error format: `{ error: "message" }`

## Adding features
1. Types → Model → Service → Controller → Route → Tests → `npm test`
