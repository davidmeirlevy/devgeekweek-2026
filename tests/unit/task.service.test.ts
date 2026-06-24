import { describe, it, expect, beforeEach } from "vitest";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  clearAll,
} from "../../src/services/task.service";

beforeEach(() => {
  clearAll();
});

describe("createTask", () => {
  it("creates a task with title and description", () => {
    const task = createTask({ title: "Test", description: "Desc" });
    expect(task.id).toBeDefined();
    expect(task.title).toBe("Test");
    expect(task.description).toBe("Desc");
    expect(task.status).toBe("todo");
    expect(task.createdAt).toBeDefined();
    expect(task.updatedAt).toBeDefined();
  });

  it("defaults description to empty string", () => {
    const task = createTask({ title: "No desc" });
    expect(task.description).toBe("");
  });

  it("sets createdAt and updatedAt to the same value on creation", () => {
    const task = createTask({ title: "Timestamps" });
    expect(task.createdAt).toBe(task.updatedAt);
  });
});

describe("getAllTasks", () => {
  it("returns empty array initially", () => {
    expect(getAllTasks()).toEqual([]);
  });

  it("returns all created tasks", () => {
    createTask({ title: "Task 1" });
    createTask({ title: "Task 2" });
    expect(getAllTasks()).toHaveLength(2);
  });
});

describe("getTaskById", () => {
  it("returns task by id", () => {
    const task = createTask({ title: "Find me" });
    expect(getTaskById(task.id)).toEqual(task);
  });

  it("returns undefined for unknown id", () => {
    expect(getTaskById("nonexistent")).toBeUndefined();
  });
});

describe("updateTask", () => {
  it("updates task title", () => {
    const task = createTask({ title: "Original" });
    const updated = updateTask(task.id, { title: "Updated" });
    expect(updated?.title).toBe("Updated");
  });

  it("updates task status", () => {
    const task = createTask({ title: "Do it" });
    const updated = updateTask(task.id, { status: "done" });
    expect(updated?.status).toBe("done");
  });

  it("preserves unchanged fields", () => {
    const task = createTask({ title: "Keep me", description: "Same" });
    const updated = updateTask(task.id, { status: "in-progress" });
    expect(updated?.title).toBe("Keep me");
    expect(updated?.description).toBe("Same");
  });

  it("returns null for unknown id", () => {
    expect(updateTask("nonexistent", { title: "X" })).toBeNull();
  });
});

describe("deleteTask", () => {
  it("deletes existing task and returns true", () => {
    const task = createTask({ title: "Delete me" });
    expect(deleteTask(task.id)).toBe(true);
    expect(getTaskById(task.id)).toBeUndefined();
  });

  it("returns false for unknown id", () => {
    expect(deleteTask("nonexistent")).toBe(false);
  });
});
