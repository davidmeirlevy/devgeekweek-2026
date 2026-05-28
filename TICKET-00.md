# [DEMO-0] Add a comments system to tasks

## Context

The Task API currently manages tasks with title, description, status, priority, and tags. Product wants to add collaboration: each task should support multiple comments, so team members can leave notes, status updates, and decisions directly on the task.

## Description

Add a **comments** sub-resource to tasks.

### Data model

A `Comment` has:
- `id` — UUID, auto-generated
- `taskId` — ID of the parent task
- `author` — string (e.g. "alice@example.com")
- `body` — non-empty string
- `createdAt` — ISO timestamp

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/tasks/:id/comments` | Add a comment to a task |
| `GET` | `/api/tasks/:id/comments` | List all comments on a task |
| `DELETE` | `/api/tasks/:id/comments/:commentId` | Delete a specific comment |

### Validation rules
- `author` and `body` are required on POST
- `body` cannot be empty
- Returns 404 if the task doesn't exist
- Returns 404 if the comment doesn't exist (on DELETE)

### Architecture
Follow the existing layered architecture:
- `src/types.ts` — add `Comment` type
- `src/models/comment.model.ts` — in-memory store, CRUD
- `src/models/tests/comment.model.test.ts` — unit tests for model
- `src/services/comment.service.ts` — business logic
- `src/services/tests/comment.service.test.ts` — unit tests for service
- `src/controllers/comment.controller.ts` — HTTP layer
- `src/routes/comment.routes.ts` — wire routes
- `tests/integration/comments.test.ts` — integration tests

## Acceptance criteria

- [ ] `Comment` type in `src/types.ts`
- [ ] `POST /api/tasks/:id/comments` creates a comment, returns 201
- [ ] `GET /api/tasks/:id/comments` returns array of comments for that task
- [ ] `DELETE /api/tasks/:id/comments/:commentId` removes comment, returns 204
- [ ] Missing `author` or empty `body` returns 400
- [ ] Non-existent task returns 404
- [ ] Non-existent comment returns 404 on DELETE
- [ ] Unit tests for model and service
- [ ] Integration tests covering: create, list, delete, validation errors, 404s
- [ ] All existing tests still pass
