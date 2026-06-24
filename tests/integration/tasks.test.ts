import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { clearAll } from "../../src/services/task.service";

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

  it("returns 404 for unknown id", async () => {
    const res = await request(app)
      .patch("/api/tasks/nonexistent")
      .send({ title: "Nope" });

    expect(res.status).toBe(404);
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
