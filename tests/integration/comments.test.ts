import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { clear as clearTasks } from "../../src/models/task.model";
import { clear as clearComments } from "../../src/models/comment.model";

beforeEach(() => {
  clearTasks();
  clearComments();
});

async function createTask(title = "Test task") {
  const res = await request(app).post("/api/tasks").send({ title });
  return res.body;
}

describe("POST /api/tasks/:id/comments", () => {
  it("adds a comment with author and body", async () => {
    const task = await createTask();

    const res = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "alice@example.com", body: "Ship it" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      taskId: task.id,
      author: "alice@example.com",
      body: "Ship it",
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it("rejects a comment without author", async () => {
    const task = await createTask();

    const res = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ body: "No author" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("author is required");
  });

  it("rejects a comment without body", async () => {
    const task = await createTask();

    const res = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "alice@example.com" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("body is required");
  });

  it("rejects a comment with empty body", async () => {
    const task = await createTask();

    const res = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "alice@example.com", body: "   " });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("body is required");
  });

  it("returns 404 for non-existent task", async () => {
    const res = await request(app)
      .post("/api/tasks/nonexistent/comments")
      .send({ author: "alice", body: "Hello" });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });
});

describe("GET /api/tasks/:id/comments", () => {
  it("lists all comments on a task in creation order", async () => {
    const task = await createTask();

    const first = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "alice", body: "First" });
    const second = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "bob", body: "Second" });

    const res = await request(app).get(`/api/tasks/${task.id}/comments`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([first.body, second.body]);
  });

  it("returns empty array when task has no comments", async () => {
    const task = await createTask();

    const res = await request(app).get(`/api/tasks/${task.id}/comments`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns 404 for non-existent task", async () => {
    const res = await request(app).get("/api/tasks/nonexistent/comments");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Task not found");
  });
});

describe("DELETE /api/tasks/:id/comments/:commentId", () => {
  it("deletes an existing comment", async () => {
    const task = await createTask();
    const created = await request(app)
      .post(`/api/tasks/${task.id}/comments`)
      .send({ author: "alice", body: "Delete me" });

    const res = await request(app).delete(
      `/api/tasks/${task.id}/comments/${created.body.id}`
    );
    expect(res.status).toBe(204);

    const list = await request(app).get(`/api/tasks/${task.id}/comments`);
    expect(list.body).toEqual([]);
  });

  it("returns 404 for non-existent comment", async () => {
    const task = await createTask();

    const res = await request(app).delete(
      `/api/tasks/${task.id}/comments/nonexistent`
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Comment not found");
  });

  it("returns 404 when comment belongs to a different task", async () => {
    const taskA = await createTask("A");
    const taskB = await createTask("B");
    const comment = await request(app)
      .post(`/api/tasks/${taskA.id}/comments`)
      .send({ author: "alice", body: "Wrong task" });

    const res = await request(app).delete(
      `/api/tasks/${taskB.id}/comments/${comment.body.id}`
    );

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("Comment not found");
  });
});
