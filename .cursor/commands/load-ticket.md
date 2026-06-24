---
description: Load a Jira ticket, summarize it, and optionally implement
argument-hint: <TICKET_ID>
---

# Load ticket

Load a Jira issue by key, summarize the description, and ask whether to implement.

## Usage

```
/load-ticket <TICKET_ID>
```

Example: `/load-ticket DEMO-1`

`TICKET_ID` is the first argument after the command (e.g. `DEMO-1`, `PROJ-123`). If omitted, ask the user for it and stop.

## Workflow

### 1. Resolve ticket ID

Use the argument from the user's message as `TICKET_ID`. Normalize to uppercase.

### 2. Fetch ticket (Atlassian MCP)

Read the MCP tool schemas before calling.

1. Call `getAccessibleAtlassianResources` on server `plugin-atlassian-atlassian` to get `cloudId`.
2. Call `getJiraIssue` with:
   - `cloudId` from step 1
   - `issueIdOrKey`: `TICKET_ID`
   - `responseContentFormat`: `"markdown"`

If the issue is not found, report the error and stop.

### 3. Summarize the description

Reply with a short summary:

- **Key** and **summary** (title)
- **Status**, **type**, **priority** (if present)
- **Description** — concise bullet summary of requirements, not a verbatim paste
- **Acceptance criteria** — extract from description or custom fields if present

### 4. Ask to implement

Use `AskQuestion` with:

- **Prompt:** "Implement this ticket?"
- **Options:** "Yes, implement" | "No, not now"

Do not start coding before the user answers.

### 5. Implement (only if yes)

Determine whether the ticket is a **new feature** or **bug fix**, then read and follow the matching rule:

- New feature → `.cursor/rules/new-feature.mdc`
- Bug fix → `.cursor/rules/bug-fix.mdc`

Also follow `CLAUDE.md` and `.cursor/rules/project.mdc` for architecture (routes → controllers → services → models).

- Write co-located tests first, then implementation
- Run `npm test`; all tests must pass before continuing

If the ticket is unclear or out of scope, say so and ask before proceeding.

### 6. Complete ticket

After implementation passes tests, read and follow `.cursor/skills/complete-ticket/SKILL.md` with:

- **Ticket ID** — the `TICKET_ID` from step 1
- **Short summary** — from the Jira issue title or your implementation summary
