import { describe, test, it, expect } from "vitest";
import { max } from "../src/intro.js";

describe("max", () => {
  test("should return the first argument if it is greater", () => {
    expect(max(2, 1)).toBe(2);
  });

  test("should return the second argument if it is greater", () => {
    expect(max(1, 2)).toBe(2);
  });

  test("should return the first argument if arguments are equal", () => {
    expect(max(2, 2)).toBe(2);
  });
});
