import { expect, test } from "@playwright/test";

test.describe("Auth screen", () => {
  test("shows login at root", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await expect(page.getByPlaceholder("voce@email.com")).toBeVisible();
    await expect(page.locator(".hero-bg")).toHaveCount(0);
  });

  test("signup tab hidden when NEXT_PUBLIC_SIGNUP_ENABLED is not true", async ({
    page
  }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Criar conta" })).toHaveCount(
      0
    );
  });
});
