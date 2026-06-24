import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("GET /api/health", () => {
  it("returns status ok and numeric uptime", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.uptime).toBe("number");
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });
});
