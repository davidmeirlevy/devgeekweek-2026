# Routes

Wire URLs to controller exports. Nothing else.

```typescript
router.get("/tasks", taskController.listTasks);
```

- Import controllers only — never `models/` or `services/`
- No inline handlers, validation, status codes, or business logic
- New endpoint: add controller fn → one route line → mount new routers in `index.ts`
