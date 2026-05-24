import { describe, it, expect, beforeEach } from "vitest";
import * as model from "../task.model";

beforeEach(() => {
  model.clear();
});

describe("task.model", () => {
  describe("insert", () => {
    it("inserts a task with defaults", () => {
      const task = model.insert({ title: "Hello" });

      expect(task.id).toBeDefined();
      expect(task.title).toBe("Hello");
      expect(task.description).toBe("");
      expect(task.status).toBe("todo");
      expect(task.priority).toBe("medium");
      expect(task.tags).toEqual([]);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it("inserts a task with explicit fields", () => {
      const task = model.insert({ title: "Full", description: "desc", priority: "high", tags: ["x"] });

      expect(task.description).toBe("desc");
      expect(task.priority).toBe("high");
      expect(task.tags).toEqual(["x"]);
    });
  });

  describe("findAll", () => {
    it("returns empty array when no tasks exist", () => {
      expect(model.findAll()).toEqual([]);
    });

    it("returns all inserted tasks", () => {
      model.insert({ title: "A" });
      model.insert({ title: "B" });
      expect(model.findAll()).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("returns the task when it exists", () => {
      const inserted = model.insert({ title: "Find" });
      expect(model.findById(inserted.id)).toEqual(inserted);
    });

    it("returns undefined for unknown id", () => {
      expect(model.findById("nope")).toBeUndefined();
    });
  });

  describe("update", () => {
    it("updates existing fields", () => {
      const inserted = model.insert({ title: "Old" });
      const updated = model.update(inserted.id, { title: "New" });

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe("New");
      expect(updated!.updatedAt).toBeDefined();
    });

    it("only updates provided fields", () => {
      const inserted = model.insert({ title: "Keep", description: "stay" });
      const updated = model.update(inserted.id, { title: "Changed" });

      expect(updated!.description).toBe("stay");
    });

    it("returns null for unknown id", () => {
      expect(model.update("nope", { title: "X" })).toBeNull();
    });
  });

  describe("remove", () => {
    it("removes an existing task and returns true", () => {
      const inserted = model.insert({ title: "Delete me" });
      expect(model.remove(inserted.id)).toBe(true);
      expect(model.findById(inserted.id)).toBeUndefined();
    });

    it("returns false for unknown id", () => {
      expect(model.remove("nope")).toBe(false);
    });
  });

  describe("findByPriority", () => {
    it("sorts high → medium → low", () => {
      model.insert({ title: "Low", priority: "low" });
      model.insert({ title: "High", priority: "high" });
      model.insert({ title: "Med", priority: "medium" });

      const sorted = model.findByPriority();
      expect(sorted[0].title).toBe("High");
      expect(sorted[1].title).toBe("Med");
      expect(sorted[2].title).toBe("Low");
    });

    it("returns empty array when no tasks", () => {
      expect(model.findByPriority()).toEqual([]);
    });
  });

  describe("filter", () => {
    it("filters by status", () => {
      model.insert({ title: "Todo" });
      const done = model.insert({ title: "Done" });
      model.update(done.id, { status: "done" });

      const result = model.filter({ status: "done" });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Done");
    });

    it("filters by priority", () => {
      model.insert({ title: "High", priority: "high" });
      model.insert({ title: "Low", priority: "low" });

      const result = model.filter({ priority: "high" });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("High");
    });

    it("filters by tag", () => {
      model.insert({ title: "FE", tags: ["frontend"] });
      model.insert({ title: "BE", tags: ["backend"] });

      const result = model.filter({ tag: "frontend" });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("FE");
    });

    it("returns all tasks when no filters applied", () => {
      model.insert({ title: "A" });
      model.insert({ title: "B" });
      expect(model.filter({})).toHaveLength(2);
    });
  });

  describe("clear", () => {
    it("removes all tasks", () => {
      model.insert({ title: "A" });
      model.insert({ title: "B" });
      model.clear();
      expect(model.findAll()).toEqual([]);
    });
  });
});
