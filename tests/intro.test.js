import { describe, test, it, expect } from "vitest";
import { calculateAverage, factorial, fizzBuzz, max } from "../src/intro.js";

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

describe("calculateAverage", () => {
  test("should return NaN if given an empty array", () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  test("should calculate the average of an array with a single element", () => {
    expect(calculateAverage([1])).toBe(1);
  });

  test("should calculate the average of an array with two elements", () => {
    expect(calculateAverage([1, 2])).toBe(1.5);
  });

  test("should calculate the average of an array with three elements", () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe("factorial", () => {
  test("should return NaN if arg is less than 0 (-ve)", () => {
    expect(factorial(-2)).toBe(NaN);
  });

  test("should return factorial of 0", () => {
    expect(factorial(0)).toBe(1);
  });

  test("should return factorial of 1", () => {
    expect(factorial(1)).toBe(1);
  });

  test("should return factorial of valid numbers", () => {
    expect(factorial(2)).toBe(2);
    expect(factorial(5)).toBe(120);
  });
});
