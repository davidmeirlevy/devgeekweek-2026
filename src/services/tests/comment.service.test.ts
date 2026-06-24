import { describe, it, expect, beforeEach } from "vitest";
import { clear as clearTasks } from "../../models/task.model";
import { clear as clearComments } from "../../models/comment.model";
import * as taskService from "../task.service";
import * as commentService from "../comment.service";

beforeEach(() => {
  clearTasks();
  clearComments();
});

describe("commentService", () => {
  describe("addComment", () => {
    it("adds a comment to an existing task", () => {
      const task = taskService.createTask({ title: "Discuss" });
      const comment = commentService.addComment(task.id, { author: "alice", body: "Note" });

      expect(comment).not.toBeNull();
      expect(comment!.taskId).toBe(task.id);
      expect(comment!.author).toBe("alice");
      expect(comment!.body).toBe("Note");
    });

    it("returns null when task does not exist", () => {
      expect(commentService.addComment("nope", { author: "alice", body: "Hi" })).toBeNull();
    });
  });

  describe("getCommentsByTaskId", () => {
    it("returns comments in creation order", () => {
      const task = taskService.createTask({ title: "Discuss" });
      const first = commentService.addComment(task.id, { author: "alice", body: "First" })!;
      const second = commentService.addComment(task.id, { author: "bob", body: "Second" })!;

      expect(commentService.getCommentsByTaskId(task.id)).toEqual([first, second]);
    });

    it("returns empty array when task has no comments", () => {
      const task = taskService.createTask({ title: "Empty" });
      expect(commentService.getCommentsByTaskId(task.id)).toEqual([]);
    });

    it("returns null when task does not exist", () => {
      expect(commentService.getCommentsByTaskId("nope")).toBeNull();
    });
  });

  describe("deleteComment", () => {
    it("deletes a comment belonging to the task", () => {
      const task = taskService.createTask({ title: "Discuss" });
      const comment = commentService.addComment(task.id, { author: "alice", body: "Remove me" })!;

      expect(commentService.deleteComment(task.id, comment.id)).toBe(true);
      expect(commentService.getCommentsByTaskId(task.id)).toEqual([]);
    });

    it("returns false when comment does not exist", () => {
      const task = taskService.createTask({ title: "Discuss" });
      expect(commentService.deleteComment(task.id, "nope")).toBe(false);
    });

    it("returns false when comment belongs to a different task", () => {
      const taskA = taskService.createTask({ title: "A" });
      const taskB = taskService.createTask({ title: "B" });
      const comment = commentService.addComment(taskA.id, { author: "alice", body: "Wrong task" })!;

      expect(commentService.deleteComment(taskB.id, comment.id)).toBe(false);
      expect(commentService.getCommentsByTaskId(taskA.id)).toHaveLength(1);
    });
  });
});
