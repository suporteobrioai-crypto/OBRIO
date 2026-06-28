import { describe, expect, it } from "vitest";
import {
  formatPhoneBRDisplay,
  isValidPhoneBR,
  normalizePhoneBR
} from "@/lib/auth/normalize-phone";
import { createSignupToken, hashSignupToken } from "@/lib/auth/signup-token";
import {
  parseHotmartPayload,
  resolvePlanFromProduct
} from "@/lib/hotmart/parse-event";

describe("normalizePhoneBR", () => {
  it("normalizes 11-digit mobile with DDD", () => {
    expect(normalizePhoneBR("(11) 99999-8888")).toBe("5511999998888");
  });

  it("keeps number with country code", () => {
    expect(normalizePhoneBR("+55 11 99999-8888")).toBe("5511999998888");
  });

  it("rejects too short numbers", () => {
    expect(normalizePhoneBR("12345")).toBeNull();
    expect(isValidPhoneBR("12345")).toBe(false);
  });
});

describe("formatPhoneBRDisplay", () => {
  it("formats as user types", () => {
    expect(formatPhoneBRDisplay("11999998888")).toBe("(11) 99999-8888");
  });
});

describe("signup token", () => {
  it("hashes consistently", () => {
    const token = "abc123";
    expect(hashSignupToken(token)).toBe(hashSignupToken(token));
  });

  it("creates unique tokens", () => {
    const a = createSignupToken();
    const b = createSignupToken();
    expect(a).not.toBe(b);
  });
});

describe("parseHotmartPayload", () => {
  const fixture = {
    event: "PURCHASE_COMPLETE",
    data: {
      product: { id: 123456, name: "Obrio AI" },
      buyer: {
        name: "Maria",
        email: "maria@exemplo.com",
        phone: "+5511999998888"
      },
      purchase: {
        transaction: "HP-123",
        status: "APPROVED"
      }
    }
  };

  it("parses approved purchase", () => {
    const parsed = parseHotmartPayload(fixture);
    expect(parsed).toMatchObject({
      email: "maria@exemplo.com",
      transactionId: "HP-123",
      productId: "123456"
    });
  });

  it("ignores non-purchase events", () => {
    expect(parseHotmartPayload({ event: "CART_ABANDONMENT" })).toBeNull();
  });
});

describe("resolvePlanFromProduct", () => {
  it("defaults to premium without map", () => {
    expect(resolvePlanFromProduct("999")).toBe("premium");
  });
});
