# Add priority field to tasks

## Description

Add a `priority` field to tasks with three levels: **low**, **medium**, **high**.

- All existing and new tasks should have a `priority` field. Default to `medium` if not provided.
- The `POST /api/tasks` and `PATCH /api/tasks/:id` endpoints should accept an optional `priority` value.
- Reject requests with an invalid priority value (return 400).
- Add a new endpoint: **`GET /api/tasks/by-priority`** that returns all tasks grouped by priority (high first, then medium, then low).
- Add tests covering: creating a task with priority, default priority, sorting/grouping, invalid priority value, and the new endpoint.

## Acceptance criteria

- [ ] `Task` type includes `priority: "low" | "medium" | "high"`
- [ ] Creating a task without `priority` defaults to `"medium"`
- [ ] `PATCH` can update priority
- [ ] Invalid priority returns 400
- [ ] `GET /api/tasks/by-priority` returns tasks sorted high → medium → low
- [ ] All existing tests still pass
- [ ] New tests cover the above scenarios
