import { describe, test, expect } from "vitest";
import {
  calculateDiscount,
  canDrive,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  validateUserInput,
} from "../src/core.js";

describe("getCoupons", () => {
  test("should return a non-empty array", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  test("should return object width valid code", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(coupon.code).toBeTypeOf("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  test("should return object with discount property with values between 0-1", () => {
    const coupons = getCoupons();

    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(coupon.discount).toBeTypeOf("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  test("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  test("should handle non-numeric price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/invalid/i);
  });

  test("should handle negative price", () => {
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  test("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  test("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

describe("validateUserInput", () => {
  test("should return success for valid username and age", () => {
    expect(validateUserInput("alfred", 19)).toMatch(/success/i);
  });

  test("should return invalid for non-string username", () => {
    expect(validateUserInput([], 19)).toMatch(/invalid/i);
  });

  test("should return invalid for username that are too short", () => {
    expect(validateUserInput("sh", 19)).toMatch(/invalid/i);
  });

  test("should return invalid for username that are longer than 255 characters", () => {
    expect(validateUserInput("s".repeat(256), 19)).toMatch(/invalid/i);
  });

  test("should return invalid for non-numeric age arg", () => {
    expect(validateUserInput("alfred", [])).toMatch(/invalid/i);
  });

  test("should return invalid for age less than 18", () => {
    expect(validateUserInput("alfred", 16)).toMatch(/invalid/i);
  });

  test("should return invalid if age is more than 100", () => {
    expect(validateUserInput("alfred", 101)).toMatch(/invalid/i);
  });

  test("should return invalid if both username and age are invalid", () => {
    expect(validateUserInput("ad", 101)).toMatch(/invalid username/i);
    expect(validateUserInput("ad", 101)).toMatch(/invalid age/i);
  });
});

describe("isPriceInRange", () => {
  test.each([
    {
      price: -10,
      scenario: "price < min",
      result: false,
    },
    {
      price: 0,
      result: true,
      scenario: "price = min",
    },
    {
      price: 50,
      result: true,
      scenario: "price between min and max",
    },
    {
      price: 100,
      result: true,
      scenario: "price = max",
    },
    {
      price: 200,
      result: false,
      scenario: "price > max",
    },
  ])("should return $result when $scenario", ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe("isValidUsername", () => {
  const minLength = 5;
  const maxLength = 15;
  test("should return false if username is shorter than maxLength", () => {
    expect(isValidUsername("s".repeat(minLength - 1))).toBe(false);
  });

  test("should return true if username is at the min or max length", () => {
    expect(isValidUsername("s".repeat(minLength))).toBe(true);
    expect(isValidUsername("s".repeat(maxLength))).toBe(true);
  });

  test("should return false if username is more than maxLength", () => {
    expect(isValidUsername("s".repeat(maxLength + 1))).toBe(false);
  });
  test("should return true if username is within expected range", () => {
    expect(isValidUsername("s".repeat(minLength + 1))).toBe(true);
    expect(isValidUsername("s".repeat(maxLength - 1))).toBe(true);
  });

  test("should return false for invalid input types ", () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername("")).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe("canDrive", () => {
  const minUSAge = 16;
  const minUKAge = 17;

  test.each([
    {
      age: 15,
      country: "US",
      result: false,
    },
    {
      age: 16,
      country: "US",
      result: true,
    },
    {
      age: 17,
      country: "US",
      result: true,
    },
    {
      age: 16,
      country: "UK",
      result: false,
    },
    {
      age: 17,
      country: "UK",
      result: true,
    },
    {
      age: 18,
      country: "UK",
      result: true,
    },
  ])(
    "should return $result for ($age, $country)",
    ({ age, country, result }) => {
      expect(canDrive(age, country)).toBe(result);
    }
  );

  test("should return invalid for invalid country code", () => {
    expect(canDrive(18, "NGN")).toMatch(/invalid/i);
  });
});
