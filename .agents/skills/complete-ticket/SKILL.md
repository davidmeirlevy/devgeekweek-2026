---
name: complete-ticket
description: Complete a development ticket end-to-end: create proper branch, implement feature, run tests, update Jira, commit, open a GitHub PR. Use when starting work on a new ticket or when implementation is done and ready for review.
---

# Skill: Complete Ticket

## Inputs needed
- Ticket ID (e.g. DEMO-6)
- Short summary of what needs to be implemented (for new tickets) OR what was implemented (for completed tickets)

## Steps

### If starting a new ticket (implementation not yet done):
1. **Check current branch:**
   - Run `git branch --show-current`
   - If branch name does NOT start with "$TICKET_ID", create a proper branch:
     - Convert title to kebab-case: "Add comments system" → "add-comments-system"
     - Create branch: `git checkout -b $TICKET_ID-kebab-case-title`
2. **Implement the feature:**
   - Follow the architecture in project.mdc and existing conventions
   - Implement all acceptance criteria from the ticket
   - Write unit tests co-located with source files
   - Write integration tests in tests/integration/
3. **Run tests:** `npm test` — must pass before continuing
4. Use Atlassian MCP: set ticket $TICKET_ID status → "In Review"
5. Use Atlassian MCP: add comment to $TICKET_ID: "Implemented: $SUMMARY. All tests pass."
6. `git add -A && git commit -m "feat: $SUMMARY [$TICKET_ID]"`
7. `gh pr create --title "$SUMMARY" --body "Closes $TICKET_ID. All tests pass."`
8. Report the PR URL

### If implementation is already done:
1. Run `npm test` — must pass before continuing
2. Use Atlassian MCP: set ticket $TICKET_ID status → "In Review"
3. Use Atlassian MCP: add comment to $TICKET_ID: "Implemented: $SUMMARY. All tests pass."
4. `git add -A && git commit -m "feat: $SUMMARY [$TICKET_ID]"`
5. `gh pr create --title "$SUMMARY" --body "Closes $TICKET_ID. All tests pass."`
6. Report the PR URL

## Constraints
- Do not proceed past testing step if tests fail
- Branch name must start with ticket ID for proper organization
- PR body must reference the ticket ID
- Always follow the existing project architecture and test patterns
