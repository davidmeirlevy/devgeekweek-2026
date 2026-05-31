---
name: load-ticket
description: Load a Jira ticket by ID and implement it end-to-end. Use when starting work on a new ticket.
---

# Skill: Load Ticket

## Inputs needed
- Ticket ID (e.g. DEMO-6)

## Steps
1. Use Atlassian MCP to fetch ticket $TICKET_ID
2. Display: title, description, acceptance criteria, current status
3. Use Atlassian MCP: set ticket $TICKET_ID status → "In Progress"
4. Summarize in one sentence what needs to be implemented
5. Identify which layers will be affected (types / model / service / controller / routes / tests)
6. Ask: "Ready to implement? I'll follow the architecture in project.mdc."
7. **If user confirms:**
   - Use the `complete-ticket` skill to implement and ship the feature
   - The `complete-ticket` skill will handle branch creation, implementation, testing, Jira updates, and PR creation

## Constraints
- Do not start implementation until the user confirms
- Always check acceptance criteria before summarizing
- Delegates to `complete-ticket` for the actual implementation workflow
