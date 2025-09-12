import { describe, test, expect } from "vitest";
import { getCoupons } from "../src/core.js";

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
