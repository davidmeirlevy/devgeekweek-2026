---
name: complete-ticket
description: Complete a development ticket end-to-end: run tests, update Jira status and comment, commit, open a GitHub PR. Use when a ticket implementation is done and ready for review.
---

# Skill: Complete Ticket

## Inputs needed
- Ticket ID (e.g. DEMO-6)
- Short summary of what was implemented

## Steps
1. Run `npm test` — must pass before continuing
2. Use Atlassian MCP: set ticket $TICKET_ID status → "In Review"
3. Use Atlassian MCP: add comment to $TICKET_ID: "Implemented: $SUMMARY. All tests pass."
4. `git add -A && git commit -m "feat: $SUMMARY [$TICKET_ID]"`
5. `gh pr create --title "$SUMMARY" --body "Closes $TICKET_ID. All tests pass."`
6. Report the PR URL

## Constraints
- Do not proceed past step 1 if tests fail
- PR body must reference the ticket ID
