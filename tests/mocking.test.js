import { it, expect, describe, vi } from "vitest";
import { getExchangeRate } from "../src/libs/currency.js";
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking.js";
import { getShippingQuote } from "../src/libs/shipping.js";
import { trackPageView } from "../src/libs/analytics.js";
import { charge } from "../src/libs/payment.js";
import { sendEmail } from "../src/libs/email.js";
import security from "../src/libs/security.js";

vi.mock("../src/libs/currency.js");
vi.mock("../src/libs/shipping.js");
vi.mock("../src/libs/analytics.js");
vi.mock("../src/libs/payment.js");
vi.mock("../src/libs/email.js", async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

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

describe("signUp", () => {
  const validEmail = "name@domain.com";

  it("should return false if email is not valid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(validEmail);

    expect(result).toBe(true);
  });

  it("should send welcome message", async () => {
    await signUp(validEmail);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    const [email, message] = args;
    expect(email).toBe(validEmail);
    expect(message).toMatch(/welcome/i);
  });
});

describe("login", () => {
  it("should send email", async () => {
    const spy = vi.spyOn(security, "generateCode");

    const email = "name@domain.com";

    await login(email);
    const code = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, code);
  });
});

describe("isOnline", () => {
  it("should return false if outside opening hours", () => {
    vi.setSystemTime("2025-09-15 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2025-09-15 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if within opening hours", () => {
    vi.setSystemTime("2025-09-15 08:01");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2025-09-15 19:59");
    expect(isOnline()).toBe(true);
  });
});

describe("getDiscount", () => {
  it("should return a discount for christmas day", () => {
    vi.setSystemTime("2024-12-25 00:00");

    expect(getDiscount()).toBe(0.2);

    vi.setSystemTime("2024-12-25 23:59");

    expect(getDiscount()).toBe(0.2);
  });

  it("should return zero discount for any day that is not christmas", () => {
    vi.setSystemTime("2024-12-24 00:01");

    expect(getDiscount()).toBe(0);

    vi.setSystemTime("2024-12-26 00:01");

    expect(getDiscount()).toBe(0);
  });
});
