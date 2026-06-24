---
name: complete-ticket
description: Finish a Jira ticket after implementation — run tests, transition issue to In Review, commit with ticket prefix, open a GitHub PR, and return the PR URL. Use when the user says complete ticket, finish ticket, ship ticket, or provides a ticket id and implementation summary to wrap up work.
---

# Complete Ticket

Wrap up implemented work: verify tests, move Jira to **In Review**, commit, open PR, report URL.

## Required inputs

Collect before starting (ask if missing):

| Input | Example |
|-------|---------|
| **Ticket ID** | `DEV-42` |
| **Short summary** | `add priority field to tasks` |

## Workflow

Copy and track progress:

```
- [ ] Step 1: Run tests
- [ ] Step 2: Transition Jira to In Review
- [ ] Step 3: Commit with ticket prefix
- [ ] Step 4: Create PR
- [ ] Step 5: Report PR URL
```

### Step 1 — Run tests

```bash
npm test
```

**Stop here if tests fail.** Report failures and fix before continuing. Do not proceed to steps 2–5.

### Step 2 — Transition Jira to In Review

Use the **Atlassian MCP** (`plugin-atlassian-atlassian`).

1. Read tool schemas before calling (`getAccessibleAtlassianResources`, `getTransitionsForJiraIssue`, `transitionJiraIssue`).
2. Resolve `cloudId` via `getAccessibleAtlassianResources` if not already known.
3. Call `getTransitionsForJiraIssue` with `issueIdOrKey` = ticket ID.
4. Find the transition whose destination status name matches **In Review** (case-insensitive; also accept `In review`).
5. Call `transitionJiraIssue` with that transition `id`.

If no matching transition exists, stop and report available transitions — do not skip or guess.

Optionally call `getJiraIssue` to capture the ticket URL for the PR body (`self` link or `https://{site}/browse/{TICKET-ID}`).

### Step 3 — Commit

Run in parallel first:

```bash
git status
git diff
git log -5 --oneline
```

Then:

1. Stage relevant changes (exclude secrets: `.env`, credentials).
2. Commit with ticket ID as message prefix:

```
{TICKET-ID}: {short summary}
```

Example: `DEV-42: add priority field to tasks`

Use a HEREDOC for the commit message. Do not commit unrelated files.

### Step 4 — Create PR

1. Confirm branch tracks remote; push with `-u` if needed:

```bash
git push -u origin HEAD
```

2. Create the PR via `gh`:

**Title:** `{TICKET-ID}: {short summary}`

**Body** (HEREDOC) — must reference the ticket ID and link to Jira:

```markdown
## Summary
- {short summary of what was implemented}

## Jira
[{TICKET-ID}]({jira-ticket-url})

## Test plan
- [ ] `npm test` passes locally
```

### Step 5 — Report PR URL

Return the PR URL from `gh pr create` output. That is the final deliverable.

## Constraints

- **Tests gate everything** — never run steps 2–5 when step 1 fails.
- **PR body must** include the ticket ID and a clickable Jira link.
- **Never** update git config, skip hooks, or force-push unless the user explicitly requests it.
- **Never** push or create a PR unless the user asked to complete the ticket (this skill implies permission).

## MCP reference

| Tool | Purpose |
|------|---------|
| `getAccessibleAtlassianResources` | Resolve `cloudId` |
| `getTransitionsForJiraIssue` | List available status transitions |
| `transitionJiraIssue` | Apply transition to In Review |
| `getJiraIssue` | Fetch ticket URL for PR body |

Server: `plugin-atlassian-atlassian`
