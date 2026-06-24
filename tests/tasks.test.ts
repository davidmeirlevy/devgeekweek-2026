import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";
import { clearAll } from "../src/models/task.model";

beforeEach(() => {
  clearAll();
});

describe("POST /api/tasks", () => {
  it("creates a task with title and description", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Buy groceries", description: "Milk, eggs, bread" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      status: "todo",
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("creates a task with only title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Quick task" });

    expect(res.status).toBe(201);
    expect(res.body.description).toBe("");
  });

  it("rejects a task without title", async () => {
    const res = await request(app).post("/api/tasks").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("title is required");
  });

  it("creates a task with explicit priority", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Urgent", priority: "high" });

    expect(res.status).toBe(201);
    expect(res.body.priority).toBe("high");
  });

  it("defaults priority to medium", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Normal task" });

    expect(res.status).toBe(201);
    expect(res.body.priority).toBe("medium");
  });

  it("rejects invalid priority", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Bad priority", priority: "critical" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid priority");
  });

  it("creates a task with tags", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Tagged task", tags: ["frontend", "urgent"] });

    expect(res.status).toBe(201);
    expect(res.body.tags).toEqual(["frontend", "urgent"]);
  });

  it("defaults tags to empty array", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "No tags" });

    expect(res.status).toBe(201);
    expect(res.body.tags).toEqual([]);
  });

  it("rejects non-array tags", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Bad tags", tags: "frontend" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid tags");
  });
});

describe("GET /api/tasks", () => {
  it("returns empty array when no tasks exist", async () => {
    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns all tasks", async () => {
    await request(app).post("/api/tasks").send({ title: "Task 1" });
    await request(app).post("/api/tasks").send({ title: "Task 2" });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("filters by status", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Done task" });
    await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ status: "done" });
    await request(app).post("/api/tasks").send({ title: "Todo task" });

    const res = await request(app).get("/api/tasks?status=done");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Done task");
  });

  it("filters by priority", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "High task", priority: "high" });
    await request(app)
      .post("/api/tasks")
      .send({ title: "Low task", priority: "low" });

    const res = await request(app).get("/api/tasks?priority=high");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("High task");
  });

  it("filters by tag", async () => {
    await request(app)
      .post("/api/tasks")
      .send({ title: "Frontend task", tags: ["frontend"] });
    await request(app)
      .post("/api/tasks")
      .send({ title: "Backend task", tags: ["backend"] });

    const res = await request(app).get("/api/tasks?tag=frontend");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Frontend task");
  });

  it("combines filters", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Match", priority: "high", tags: ["frontend"] });
    await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ status: "done" });
    await request(app)
      .post("/api/tasks")
      .send({ title: "Wrong status", priority: "high", tags: ["frontend"] });
    await request(app)
      .post("/api/tasks")
      .send({ title: "Wrong tag", priority: "high", tags: ["backend"] });

    const res = await request(app).get(
      "/api/tasks?status=done&priority=high&tag=frontend"
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe("Match");
  });

  it("ignores unknown query params", async () => {
    await request(app).post("/api/tasks").send({ title: "Task 1" });

    const res = await request(app).get("/api/tasks?foo=bar");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});

describe("GET /api/tasks/:id", () => {
  it("returns a task by id", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Find me" });

    const res = await request(app).get(`/api/tasks/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Find me");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/tasks/nonexistent");

    expect(res.status).toBe(404);
  });
});

describe("PATCH /api/tasks/:id", () => {
  it("updates task title", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Old title" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ title: "New title" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("New title");
  });

  it("updates task status", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Do it" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ status: "done" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("done");
  });

  it("rejects invalid status", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Test" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ status: "invalid" });

    expect(res.status).toBe(400);
  });

  it("updates task priority", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Reprioritize" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ priority: "high" });

    expect(res.status).toBe(200);
    expect(res.body.priority).toBe("high");
  });

  it("rejects invalid priority", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Test" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ priority: "critical" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid priority");
  });

  it("updates task tags", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Retag" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ tags: ["backend", "api"] });

    expect(res.status).toBe(200);
    expect(res.body.tags).toEqual(["backend", "api"]);
  });

  it("rejects non-array tags", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Test" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.id}`)
      .send({ tags: "frontend" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid tags");
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .patch("/api/tasks/nonexistent")
      .send({ title: "Nope" });

    expect(res.status).toBe(404);
  });
});

describe("GET /api/tasks/by-priority", () => {
  it("returns tasks sorted high \u2192 medium \u2192 low", async () => {
    await request(app).post("/api/tasks").send({ title: "Low", priority: "low" });
    await request(app).post("/api/tasks").send({ title: "High", priority: "high" });
    await request(app).post("/api/tasks").send({ title: "Medium", priority: "medium" });

    const res = await request(app).get("/api/tasks/by-priority");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
    expect(res.body[0].title).toBe("High");
    expect(res.body[1].title).toBe("Medium");
    expect(res.body[2].title).toBe("Low");
  });

  it("returns empty array when no tasks exist", async () => {
    const res = await request(app).get("/api/tasks/by-priority");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("DELETE /api/tasks/:id", () => {
  it("deletes an existing task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .send({ title: "Delete me" });

    const res = await request(app).delete(`/api/tasks/${created.body.id}`);
    expect(res.status).toBe(204);

    const check = await request(app).get(`/api/tasks/${created.body.id}`);
    expect(check.status).toBe(404);
  });

  it("returns 404 for unknown id", async () => {
    const res = await request(app).delete("/api/tasks/nonexistent");
    expect(res.status).toBe(404);
  });
});
