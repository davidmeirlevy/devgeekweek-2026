---
name: load-ticket
description: Load a Jira ticket by ID and prepare it for implementation. Use when starting work on a new ticket.
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

## Constraints
- Do not start implementation until the user confirms
- Always check acceptance criteria before summarizing
