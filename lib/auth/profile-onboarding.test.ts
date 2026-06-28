import { describe, expect, it } from "vitest";
import { isProfileComplete } from "@/lib/auth/profile-onboarding";

describe("isProfileComplete", () => {
  it("returns false when profile is null", () => {
    expect(isProfileComplete(null)).toBe(false);
  });

  it("returns false when name or whatsapp is missing", () => {
    expect(isProfileComplete({ full_name: "Maria", whatsapp: null })).toBe(false);
    expect(isProfileComplete({ full_name: null, whatsapp: "5511999998888" })).toBe(
      false
    );
    expect(isProfileComplete({ full_name: "  ", whatsapp: "5511999998888" })).toBe(
      false
    );
  });

  it("returns true when name and whatsapp are filled", () => {
    expect(
      isProfileComplete({ full_name: "Maria Silva", whatsapp: "5511999998888" })
    ).toBe(true);
  });
});
