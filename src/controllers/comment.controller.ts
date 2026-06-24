import { Request, Response } from "express";
import * as commentService from "../services/comment.service";
import { isNonEmptyString } from "../validation";

export function list(req: Request, res: Response): void {
  const comments = commentService.getCommentsByTaskId(req.params.id);
  if (comments === null) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(comments);
}

export function create(req: Request, res: Response): void {
  const { author, body } = req.body;

  if (!isNonEmptyString(author)) {
    res.status(400).json({ error: "author is required" });
    return;
  }
  if (!isNonEmptyString(body)) {
    res.status(400).json({ error: "body is required" });
    return;
  }

  const comment = commentService.addComment(req.params.id, { author, body });
  if (!comment) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.status(201).json(comment);
}

export function remove(req: Request, res: Response): void {
  const deleted = commentService.deleteComment(req.params.id, req.params.commentId);
  if (!deleted) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }
  res.status(204).send();
}
