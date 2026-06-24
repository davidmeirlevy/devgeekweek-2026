import { describe, it, expect } from "vitest";
import { isValidPriority, isValidStatus, isNonEmptyString, isStringArray } from "../../src/validation";

describe("validation", () => {
  describe("isValidPriority", () => {
    it("accepts valid priorities", () => {
      expect(isValidPriority("low")).toBe(true);
      expect(isValidPriority("medium")).toBe(true);
      expect(isValidPriority("high")).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(isValidPriority("critical")).toBe(false);
      expect(isValidPriority("")).toBe(false);
      expect(isValidPriority(42)).toBe(false);
      expect(isValidPriority(null)).toBe(false);
    });
  });

  describe("isValidStatus", () => {
    it("accepts valid statuses", () => {
      expect(isValidStatus("todo")).toBe(true);
      expect(isValidStatus("in-progress")).toBe(true);
      expect(isValidStatus("done")).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(isValidStatus("pending")).toBe(false);
      expect(isValidStatus("")).toBe(false);
      expect(isValidStatus(undefined)).toBe(false);
    });
  });

  describe("isNonEmptyString", () => {
    it("accepts non-empty strings", () => {
      expect(isNonEmptyString("hello")).toBe(true);
      expect(isNonEmptyString("  a  ")).toBe(true);
    });

    it("rejects empty or whitespace-only strings", () => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString("   ")).toBe(false);
    });

    it("rejects non-string types", () => {
      expect(isNonEmptyString(123)).toBe(false);
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });

  describe("isStringArray", () => {
    it("accepts arrays of strings", () => {
      expect(isStringArray([])).toBe(true);
      expect(isStringArray(["a", "b"])).toBe(true);
    });

    it("rejects arrays containing non-strings", () => {
      expect(isStringArray([1, 2])).toBe(false);
      expect(isStringArray(["a", 2])).toBe(false);
    });

    it("rejects non-arrays", () => {
      expect(isStringArray("hello")).toBe(false);
      expect(isStringArray(null)).toBe(false);
    });
  });
});
