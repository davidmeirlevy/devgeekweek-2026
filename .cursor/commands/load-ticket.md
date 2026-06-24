---
description: Load Jira ticket, summarize, optionally implement
argument-hint: <TICKET_ID>
---
Atlassian MCP: `getAccessibleAtlassianResources` → `getJiraIssue` for first arg (ask if missing). Summarize key, title, status, requirements, acceptance criteria.
Ask "Implement this ticket?" (Yes/No). On Yes: `CLAUDE.md` layers, tests, `npm test`.
