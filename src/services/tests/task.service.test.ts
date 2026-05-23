import { describe, it, expect, beforeEach } from "vitest";
import { clear } from "../../models/task.model";
import * as taskService from "../task.service";

beforeEach(() => {
  clear();
});

describe("taskService", () => {
  describe("createTask", () => {
    it("creates a task with defaults", () => {
      const task = taskService.createTask({ title: "Test" });

      expect(task.id).toBeDefined();
      expect(task.title).toBe("Test");
      expect(task.description).toBe("");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
    });

    it("creates a task with explicit priority", () => {
      const task = taskService.createTask({ title: "Urgent", priority: "high" });
      expect(task.priority).toBe("high");
    });
  });

  describe("getTaskById", () => {
    it("returns the task when it exists", () => {
      const created = taskService.createTask({ title: "Find me" });
      const found = taskService.getTaskById(created.id);
      expect(found).toEqual(created);
    });

    it("returns undefined for unknown id", () => {
      expect(taskService.getTaskById("nonexistent")).toBeUndefined();
    });
  });

  describe("updateTask", () => {
    it("updates fields on an existing task", () => {
      const created = taskService.createTask({ title: "Original" });
      const updated = taskService.updateTask(created.id, { title: "Changed" });

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe("Changed");
      expect(updated!.updatedAt).toBeDefined();
    });

    it("returns null for unknown id", () => {
      expect(taskService.updateTask("nope", { title: "X" })).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("removes an existing task", () => {
      const created = taskService.createTask({ title: "Delete me" });
      expect(taskService.deleteTask(created.id)).toBe(true);
      expect(taskService.getTaskById(created.id)).toBeUndefined();
    });

    it("returns false for unknown id", () => {
      expect(taskService.deleteTask("nope")).toBe(false);
    });
  });

  describe("getTasksByPriority", () => {
    it("returns tasks sorted high → medium → low", () => {
      taskService.createTask({ title: "Low", priority: "low" });
      taskService.createTask({ title: "High", priority: "high" });
      taskService.createTask({ title: "Med", priority: "medium" });

      const sorted = taskService.getTasksByPriority();
      expect(sorted[0].title).toBe("High");
      expect(sorted[1].title).toBe("Med");
      expect(sorted[2].title).toBe("Low");
    });
  });
});
