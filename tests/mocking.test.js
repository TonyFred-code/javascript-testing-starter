import { it, expect, describe, vi } from "vitest";
import { getExchangeRate } from "../src/libs/currency.js";
import {
  getPriceInCurrency,
  getShippingInfo,
  renderPage,
  submitOrder,
} from "../src/mocking.js";
import { getShippingQuote } from "../src/libs/shipping.js";
import { trackPageView } from "../src/libs/analytics.js";
import { charge } from "../src/libs/payment.js";

vi.mock("../src/libs/currency.js");
vi.mock("../src/libs/shipping.js");
vi.mock("../src/libs/analytics.js");
vi.mock("../src/libs/payment.js");

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

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const creditCard = {
    creditCardNumber: 33244332,
  };
  const order = {
    totalAmount: 3432,
  };

  it("should call charge with correct arguments", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return error message and false success status when payment fails", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toHaveProperty("success", false);
    expect(result).toHaveProperty("error");
    expect(result.error).toMatch(/error/i);
  });

  it("should return success without error when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    expect(result).toHaveProperty("success", true);
    expect(result).not.toHaveProperty("error");
  });
});
