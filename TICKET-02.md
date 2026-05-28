# [DEMO-2] Add due dates and overdue task detection

## Description

The team needs to track deadlines. Add a `dueDate` field to tasks and a way to query overdue tasks.

### Data model changes

Add an optional `dueDate` field to `Task`:
- Type: ISO 8601 date string (e.g. `"2026-06-01"`)
- Optional — tasks without a due date are never overdue
- Accepted on `POST` and `PATCH`
- Rejected if the value is not a valid date string (return 400)

A task is **overdue** if:
- It has a `dueDate`
- The `dueDate` is in the past
- The task status is **not** `"done"`

### New endpoint

`GET /api/tasks/overdue` — returns all overdue tasks, sorted by `dueDate` ascending (most overdue first).

### Architecture
Follow the existing layered architecture:
- `src/types.ts` — add `dueDate?: string` to `Task`, `CreateTaskInput`, `UpdateTaskInput`
- `src/models/task.model.ts` — store and return `dueDate`, add `findOverdue()` function
- `src/models/tests/task.model.test.ts` — add tests for `dueDate` storage and `findOverdue()`
- `src/services/task.service.ts` — add `getOverdueTasks()` function
- `src/services/tests/task.service.test.ts` — add tests for `getOverdueTasks()`
- `src/validation.ts` — add `isValidDate(value)` helper
- `src/tests/validation.test.ts` — add tests for `isValidDate`
- `src/controllers/task.controller.ts` — validate `dueDate` on create/update, add handler for overdue
- `src/routes/task.routes.ts` — add `GET /overdue` route (before `/:id`)
- `tests/integration/tasks.test.ts` — add integration tests for dueDate and overdue endpoint

## Acceptance criteria

- [ ] `Task` type includes `dueDate?: string`
- [ ] `POST /api/tasks` accepts and stores `dueDate`
- [ ] `PATCH /api/tasks/:id` can update `dueDate`
- [ ] Invalid date string (e.g. `"not-a-date"`) returns 400
- [ ] `GET /api/tasks/overdue` returns tasks with past `dueDate` and status != `"done"`, sorted ascending
- [ ] Tasks without `dueDate` never appear in overdue results
- [ ] `isValidDate` helper in `src/validation.ts` with tests
- [ ] Unit tests for model `findOverdue()` and service `getOverdueTasks()`
- [ ] Integration tests for: creating with dueDate, overdue endpoint (empty, with results, done tasks excluded)
- [ ] All existing tests still pass
