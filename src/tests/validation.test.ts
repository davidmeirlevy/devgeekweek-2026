import { describe, it, expect } from "vitest";
import {
  isNonEmptyString,
  isValidPriority,
  isValidStatus,
  isStringArray,
} from "../validation";

describe("isNonEmptyString", () => {
  it("returns true for a non-empty string", () => {
    expect(isNonEmptyString("hello")).toBe(true);
  });

  it("returns false for an empty string", () => {
    expect(isNonEmptyString("")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isNonEmptyString(undefined)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isNonEmptyString(null)).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isNonEmptyString(123)).toBe(false);
    expect(isNonEmptyString(true)).toBe(false);
    expect(isNonEmptyString([])).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
  });
});

describe("isValidPriority", () => {
  it.each(["low", "medium", "high"])("returns true for %s", (priority) => {
    expect(isValidPriority(priority)).toBe(true);
  });

  it("returns false for invalid priority strings", () => {
    expect(isValidPriority("critical")).toBe(false);
    expect(isValidPriority("")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidPriority(undefined)).toBe(false);
    expect(isValidPriority(null)).toBe(false);
    expect(isValidPriority(123)).toBe(false);
  });
});

describe("isValidStatus", () => {
  it.each(["todo", "in-progress", "done"])("returns true for %s", (status) => {
    expect(isValidStatus(status)).toBe(true);
  });

  it("returns false for invalid status strings", () => {
    expect(isValidStatus("invalid")).toBe(false);
    expect(isValidStatus("")).toBe(false);
  });

  it("returns false for non-string values", () => {
    expect(isValidStatus(undefined)).toBe(false);
    expect(isValidStatus(null)).toBe(false);
    expect(isValidStatus(123)).toBe(false);
  });
});

describe("isStringArray", () => {
  it("returns true for an array", () => {
    expect(isStringArray([])).toBe(true);
    expect(isStringArray(["frontend", "urgent"])).toBe(true);
  });

  it("returns false for non-array values", () => {
    expect(isStringArray(undefined)).toBe(false);
    expect(isStringArray(null)).toBe(false);
    expect(isStringArray("frontend")).toBe(false);
    expect(isStringArray(123)).toBe(false);
    expect(isStringArray({})).toBe(false);
  });
});
