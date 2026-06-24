import { describe, it, expect, beforeEach } from "vitest";
import * as model from "../comment.model";
import * as taskModel from "../task.model";

beforeEach(() => {
  model.clear();
  taskModel.clear();
});

describe("comment.model", () => {
  const taskId = "task-1";

  describe("insert", () => {
    it("inserts a comment with author and body", () => {
      const comment = model.insert(taskId, { author: "alice@example.com", body: "Looks good" });

      expect(comment.id).toBeDefined();
      expect(comment.taskId).toBe(taskId);
      expect(comment.author).toBe("alice@example.com");
      expect(comment.body).toBe("Looks good");
      expect(comment.createdAt).toBeDefined();
    });
  });

  describe("findByTaskId", () => {
    it("returns comments in creation order", () => {
      const first = model.insert(taskId, { author: "alice", body: "First" });
      const second = model.insert(taskId, { author: "bob", body: "Second" });

      const result = model.findByTaskId(taskId);
      expect(result).toEqual([first, second]);
    });

    it("returns empty array when task has no comments", () => {
      expect(model.findByTaskId(taskId)).toEqual([]);
    });

    it("does not return comments from other tasks", () => {
      model.insert(taskId, { author: "alice", body: "Mine" });
      model.insert("other-task", { author: "bob", body: "Theirs" });

      expect(model.findByTaskId(taskId)).toHaveLength(1);
    });
  });

  describe("findById", () => {
    it("returns the comment when it exists", () => {
      const inserted = model.insert(taskId, { author: "alice", body: "Hi" });
      expect(model.findById(inserted.id)).toEqual(inserted);
    });

    it("returns undefined for unknown id", () => {
      expect(model.findById("nope")).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("removes an existing comment and returns true", () => {
      const inserted = model.insert(taskId, { author: "alice", body: "Delete me" });
      expect(model.remove(inserted.id)).toBe(true);
      expect(model.findById(inserted.id)).toBeUndefined();
    });

    it("returns false for unknown id", () => {
      expect(model.remove("nope")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all comments", () => {
      model.insert(taskId, { author: "alice", body: "A" });
      model.clear();
      expect(model.findByTaskId(taskId)).toEqual([]);
    });
  });
});
