# [DEMO-1] Add a health check endpoint

## Description

Add a `GET /api/health` endpoint that returns the current status and uptime of the API.

### Response format

```json
{
  "status": "ok",
  "uptime": 42.3
}
```

- `status` is always `"ok"` if the server is running
- `uptime` is the number of seconds the process has been running (`process.uptime()`)

### Requirements
- No authentication required
- Returns HTTP 200
- No model or service needed — controller only
- Add a route in `src/routes/index.ts`
- Add one integration test in `tests/integration/health.test.ts`

## Acceptance criteria

- [ ] `GET /api/health` returns 200
- [ ] Response body has `status: "ok"` and a numeric `uptime`
- [ ] Integration test passes
- [ ] All existing tests still pass
