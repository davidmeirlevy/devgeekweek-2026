# [DEMO-5] Write tests for all new functionality

## Description

Tests are missing for everything added in DEMO-2, DEMO-3, and DEMO-4. Add integration tests covering the new functionality.

### What to test
- **Tags:** creating a task with tags, default empty tags, invalid tags value (non-array)
- **Filtering:** by status, by priority, by tag, combining filters
- **Bug fix:** `PATCH` with empty title returns 400

### Where to add tests
- Integration tests in `tests/integration/tasks.test.ts`
- Follow the existing test patterns (describe blocks, supertest, setup/teardown)

## Acceptance criteria

- [ ] Tests for tags creation and default value
- [ ] Tests for invalid tags input
- [ ] Tests for filtering by status, priority, and tag
- [ ] Test for the empty-title bug fix
- [ ] All existing tests still pass
- [ ] `npm test` is fully green
