import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe("Auth flow", () => {
  test.beforeEach(() => {
    test.skip(
      !email || !password,
      "Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para rodar E2E"
    );
  });

  test("login page at root", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
    await expect(page.getByPlaceholder("voce@email.com")).toBeVisible();
  });

  test("login, dashboard, logout", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("voce@email.com").fill(email!);
    await page.getByPlaceholder("Sua senha").fill(password!);
    await page.getByRole("button", { name: "Entrar no Obrio AI" }).click();

    await page.waitForURL("**/dashboard", { timeout: 30_000 });
    await expect(page.getByText("Dashboard da obra")).toBeVisible();

    await page.locator("button[aria-expanded]").click();
    await page.locator("button[aria-expanded='true']").locator("..").getByRole("button", { name: "Sair" }).click();
    await expect(page.getByRole("heading", { name: "Sair da conta?" })).toBeVisible();
    await page.locator('form[action="/auth/signout"] button[type="submit"]').click();

    await page.waitForURL(/\/(\?.*)?$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });
});
