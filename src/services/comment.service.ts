import { Comment, CreateCommentInput } from "../types";
import * as commentModel from "../models/comment.model";
import * as taskModel from "../models/task.model";

export function getCommentsByTaskId(taskId: string): Comment[] | null {
  if (!taskModel.findById(taskId)) {
    return null;
  }
  return commentModel.findByTaskId(taskId);
}

export function addComment(taskId: string, input: CreateCommentInput): Comment | null {
  if (!taskModel.findById(taskId)) {
    return null;
  }
  return commentModel.insert(taskId, input);
}

export function deleteComment(taskId: string, commentId: string): boolean {
  const comment = commentModel.findById(commentId);
  if (!comment || comment.taskId !== taskId) {
    return false;
  }
  return commentModel.remove(commentId);
}
