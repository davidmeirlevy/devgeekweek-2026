import { randomUUID } from "crypto";
import { Comment, CreateCommentInput } from "../types";

const comments: Map<string, Comment> = new Map();

export function findByTaskId(taskId: string): Comment[] {
  return Array.from(comments.values())
    .filter((c) => c.taskId === taskId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function findById(id: string): Comment | undefined {
  return comments.get(id);
}

export function insert(taskId: string, input: CreateCommentInput): Comment {
  const comment: Comment = {
    id: randomUUID(),
    taskId,
    author: input.author,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  comments.set(comment.id, comment);
  return comment;
}

export function remove(id: string): boolean {
  return comments.delete(id);
}

export function clear(): void {
  comments.clear();
}
