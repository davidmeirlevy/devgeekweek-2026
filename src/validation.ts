import { Priority, Status } from "./types";

const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];
const VALID_STATUSES: Status[] = ["todo", "in-progress", "done"];

export function isValidPriority(value: unknown): value is Priority {
  return typeof value === "string" && VALID_PRIORITIES.includes(value as Priority);
}

export function isValidStatus(value: unknown): value is Status {
  return typeof value === "string" && VALID_STATUSES.includes(value as Status);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}
