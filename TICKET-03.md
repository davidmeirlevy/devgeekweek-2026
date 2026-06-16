# [DEMO-3] Refactor: extract validation into a shared module

## Description

Validation logic is currently scattered inline across `src/controllers/task.controller.ts`. Extract it into a dedicated `src/validation.ts` module.

### What to extract
Create helper functions:
- `isValidPriority(value: unknown): boolean`
- `isValidStatus(value: unknown): boolean`
- `isNonEmptyString(value: unknown): boolean`
- `isStringArray(value: unknown): boolean`

Update the controller to import and use these helpers. Keep behavior identical — all tests must still pass.

## Acceptance criteria

- [ ] `src/validation.ts` exists with the four helper functions
- [ ] `task.controller.ts` uses the helpers instead of inline checks
- [ ] No validation logic remains inline in the controller
- [ ] All existing tests still pass
- [ ] No change in HTTP behavior
