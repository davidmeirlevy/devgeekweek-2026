export type Priority = "low" | "medium" | "high";

export type Status = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string[];
}

export interface TaskFilters {
  status?: Status;
  priority?: Priority;
  tag?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentInput {
  author: string;
  body: string;
}
