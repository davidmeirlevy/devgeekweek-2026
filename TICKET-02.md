# [DEMO-2] Add tags field and filtering to tasks

## Description

Add a `tags` field to tasks and allow filtering via query parameters on `GET /api/tasks`.

### Tags field
- `tags` is an array of strings, default empty (`[]`)
- Accepted on `POST /api/tasks` and `PATCH /api/tasks/:id`
- Reject non-array values with 400

### Filtering via query params
- `GET /api/tasks?status=done` — filter by status
- `GET /api/tasks?priority=high` — filter by priority
- `GET /api/tasks?tag=frontend` — filter by tag (task must include the tag)
- Filters can be combined
- Unknown query params are ignored

### Architecture
Follow the existing layered architecture: types → model → service → controller.

## Acceptance criteria

- [ ] `Task` type includes `tags: string[]`
- [ ] Creating a task without `tags` defaults to `[]`
- [ ] `PATCH` can update tags
- [ ] Invalid tags value (non-array) returns 400
- [ ] `GET /api/tasks?status=done` returns only done tasks
- [ ] `GET /api/tasks?priority=high` returns only high-priority tasks
- [ ] `GET /api/tasks?tag=frontend` returns only tasks with that tag
- [ ] All existing tests still pass
