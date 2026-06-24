# Tests

Vitest + supertest. `npm test` / `npm run test:watch`.

- `src/<layer>/tests/` — unit tests for models, services, etc.
- `beforeEach`: call model `clearAll()` to reset in-memory state
- Assert behavior via public API, not internals
- One behavior per `it`
