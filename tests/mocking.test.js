import { it, expect, describe, vi } from "vitest";
import { getExchangeRate } from "../src/libs/currency.js";
import { getPriceInCurrency, getShippingInfo } from "../src/mocking.js";
import { getShippingQuote } from "../src/libs/shipping.js";

vi.mock("../src/libs/currency.js");
vi.mock("../src/libs/shipping.js");

describe("getPriceInCurrency", () => {
  it("should return price in a target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");
    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return cost and estimated days of arrival for known destination", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 14, estimatedDays: 3 });

    const result = getShippingInfo("lagos");

    console.log(result);
    expect(result).toMatch(/\$14 \(3 days\)/i);
  });

  it("should handle unknown destination ", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo("unknown");

    expect(result).toMatch(/unavailable/i);
  });
});
