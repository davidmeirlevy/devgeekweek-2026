# [DEMO-0] Add a comments system to tasks

## Context

Users want to collaborate on tasks. Right now a task is a static record — title, status, priority, tags. There's no way to leave a note, post a status update, or record a decision on a specific task. Teams end up discussing tasks in Slack, losing context.

## What we want

Allow users to add comments to any task. A comment is a short message tied to a task — who wrote it, what they said, and when.

Users should be able to:
- **Add a comment** to a task they're working on
- **See all comments** on a task, in order
- **Delete a comment** they no longer want

## Business rules

- Every comment must have an **author** (e.g. email or username) and a **message body**
- An empty message is not a valid comment
- Comments belong to a task — if the task doesn't exist, the operation should fail gracefully
- Deleting a comment that doesn't exist should also fail gracefully
- Comments are returned in the order they were created

## API

| Action | HTTP |
|--------|------|
| Add a comment | `POST /api/tasks/:id/comments` |
| List all comments on a task | `GET /api/tasks/:id/comments` |
| Delete a comment | `DELETE /api/tasks/:id/comments/:commentId` |

## Acceptance criteria

- [ ] A user can add a comment to a task (author + body required)
- [ ] A user can list all comments on a task
- [ ] A user can delete a comment by its ID
- [ ] Adding a comment with no body returns a clear error
- [ ] Operating on a non-existent task returns a not-found error
- [ ] Deleting a non-existent comment returns a not-found error
- [ ] The feature is covered by automated tests
