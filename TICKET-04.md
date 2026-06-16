# [DEMO-4] Bug: PATCH allows setting title to empty string

## Description

**Bug:** `PATCH /api/tasks/:id` allows setting `title` to an empty string `""`.

**Expected:** Return 400 with `{ error: "title cannot be empty" }`.

**Actual:** Saves the task with an empty title.

## Steps to reproduce

```http
PATCH /api/tasks/<valid-id>
Content-Type: application/json

{ "title": "" }
```

Returns 200 and saves the empty title.

## Acceptance criteria

- [ ] `PATCH /api/tasks/:id` with `title: ""` returns 400
- [ ] Response body: `{ "error": "title cannot be empty" }`
- [ ] Valid PATCH requests (non-empty title or no title field) still work
- [ ] All existing tests still pass
