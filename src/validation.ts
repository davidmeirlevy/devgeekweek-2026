const VALID_PRIORITIES = ["low", "medium", "high"] as const;
const VALID_STATUSES = ["todo", "in-progress", "done"] as const;

export function isNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.length > 0;
}

export function isValidPriority(value: unknown): boolean {
  return (
    typeof value === "string" &&
    (VALID_PRIORITIES as readonly string[]).includes(value)
  );
}

export function isValidStatus(value: unknown): boolean {
  return (
    typeof value === "string" &&
    (VALID_STATUSES as readonly string[]).includes(value)
  );
}

export function isStringArray(value: unknown): boolean {
  return Array.isArray(value);
}
