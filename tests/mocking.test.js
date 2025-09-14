import { it, expect, describe, vi } from "vitest";
import { getExchangeRate } from "../src/libs/currency.js";
import { getPriceInCurrency } from "../src/mocking.js";

vi.mock("../src/libs/currency.js");

describe("getPriceInCurrency", () => {
  it("should return price in a target currency", () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");
    expect(price).toBe(15);
  });
});
