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
    await expect(page.locator(".hero-bg")).toHaveCount(0);
  });

  test("login, profile onboarding, dashboard, logout", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("voce@email.com").fill(email!);
    await page.getByPlaceholder("Sua senha").fill(password!);
    await page.getByRole("button", { name: "Entrar no Obrio AI" }).click();

    await page.waitForURL(/\/(onboarding|dashboard)(\?.*)?$/, { timeout: 30_000 });

    if (page.url().includes("/onboarding")) {
      await expect(page.getByRole("heading", { name: "Seu nome" })).toBeVisible();
      await page.getByPlaceholder("Seu nome").fill("Usuário Teste E2E");
      await page.getByRole("button", { name: "Continuar" }).click();

      await expect(page.getByRole("heading", { name: "WhatsApp" })).toBeVisible();
      await page.getByPlaceholder("(11) 99999-9999").fill("(11) 98888-7777");
      await page.getByRole("button", { name: "Continuar" }).click();

      await expect(page.getByRole("heading", { name: "Foto de perfil" })).toBeVisible();
      await page.getByRole("button", { name: "Pular foto e continuar" }).click();

      await page.waitForURL(/\/dashboard(\?.*)?$/, { timeout: 30_000 });
    }

    await expect(page.getByText("Seu painel está pronto")).toBeVisible();

    await page.getByRole("complementary").getByRole("button", { name: /Plano Gratuito/ }).click();
    await page.getByRole("complementary").getByRole("button", { name: "Sair" }).click();
    await expect(page.getByRole("heading", { name: "Sair da conta?" })).toBeVisible();
    await page.locator('form[action="/auth/signout"] button[type="submit"]').click();

    await page.waitForURL(/\/(\?.*)?$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Entrar" })).toBeVisible();
  });
});
