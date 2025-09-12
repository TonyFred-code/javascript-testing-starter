import { describe, test, it, expect } from "vitest";
import { fizzBuzz, max } from "../src/intro.js";

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

// Exercise:

describe("fizzBuzz", () => {
  test("should return FizzBuzz if number is divisible by 3 and 5", () => {
    expect(fizzBuzz(15)).toBe("FizzBuzz");
  });

  test("should return Fizz if number is only divisible by 3", () => {
    expect(fizzBuzz(6)).toBe("Fizz");
  });

  test("should return Buzz if number is only divisible by 5", () => {
    expect(fizzBuzz(20)).toBe("Buzz");
  });

  test("should return number as string if number is not divisible by 3 or 5", () => {
    expect(fizzBuzz(4)).toBe("4");
  });
});
