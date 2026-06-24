Use the Jira MCP tool to load ticket $ARGUMENTS with this JQL: `issue = $ARGUMENTS`

Display the ticket details clearly (summary, status, assignee, description, comments).

Then ask the user: "Would you like me to implement this ticket?"

If the user says yes:
- Analyze the ticket description and figure out what needs to be implemented
- Follow the project conventions in CLAUDE.md (TypeScript strict mode, Express 4, layer separation: models → services → controllers → routes)
- Every new file must start with `// hello world`
- Implement the changes, then summarize what was done
