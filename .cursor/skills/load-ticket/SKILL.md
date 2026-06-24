---
name: load-ticket
description: Load a Jira ticket via Atlassian MCP, summarize the description, ask whether to implement, implement on confirmation, then run complete-ticket to ship. Use when the user runs /load-ticket, says load ticket, or provides a Jira ticket ID to start work.
disable-model-invocation: true
---

# Load Ticket

Fetch a Jira issue, summarize it, ask to implement, then implement if confirmed.

## Required input

| Input | Example |
|-------|---------|
| **Ticket ID** | `DEV-42` |

Ask and stop if missing.

## Workflow

```
- [ ] Step 1: Fetch ticket (Atlassian MCP)
- [ ] Step 2: Summarize the description
- [ ] Step 3: Ask to implement
- [ ] Step 4: Implement (only if yes)
- [ ] Step 5: Complete ticket
```

### Step 1 — Fetch ticket

Read MCP tool schemas before calling. Server: `plugin-atlassian-atlassian`.

1. `getAccessibleAtlassianResources` → resolve `cloudId`
2. `getJiraIssue` with `issueIdOrKey` = ticket ID (uppercase), `responseContentFormat`: `"markdown"`

Stop and report if the issue is not found.

### Step 2 — Summarize the description

Present:

- Key, title, status, type, priority
- Description as concise requirement bullets (not verbatim)
- Acceptance criteria from description or custom fields

### Step 3 — Ask to implement

Use `AskQuestion`:

- Prompt: **"Implement this ticket?"**
- Options: **Yes, implement** | **No, not now**

Do not write code before the user answers.

### Step 4 — Implement (only if yes)

1. Classify ticket as new feature or bug fix
2. Read and follow the matching rule: `new-feature.mdc` or `bug-fix.mdc`
3. Follow project layers: types → model → service → controller → route → tests
4. Run `npm test`; all tests must pass before continuing

### Step 5 — Complete ticket

After implementation passes tests, read and follow `.cursor/skills/complete-ticket/SKILL.md` with:

- **Ticket ID** — from step 1
- **Short summary** — from the Jira issue title or implementation summary

## MCP reference

| Tool | Purpose |
|------|---------|
| `getAccessibleAtlassianResources` | Resolve `cloudId` |
| `getJiraIssue` | Fetch ticket details |
