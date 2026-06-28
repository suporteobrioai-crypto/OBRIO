import { expect, test } from "@playwright/test";

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe("Navigation simplification", () => {
  test.beforeEach(async ({ page }) => {
    test.skip(
      !email || !password,
      "Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para rodar redirects autenticados"
    );

    await page.goto("/");
    await page.getByPlaceholder("voce@email.com").fill(email!);
    await page.getByPlaceholder("Sua senha").fill(password!);
    await page.getByRole("button", { name: "Entrar no Obrio AI" }).click();
    await page.waitForURL(/\/(onboarding|dashboard)(\?.*)?$/, { timeout: 30_000 });

    if (page.url().includes("/onboarding")) {
      await page.getByPlaceholder("Seu nome").fill("Usuário E2E Redirects");
      await page.getByRole("button", { name: "Continuar" }).click();
      await page.getByPlaceholder("(11) 99999-9999").fill("(11) 98888-7777");
      await page.getByRole("button", { name: "Continuar" }).click();
      await page.getByRole("button", { name: "Pular foto e continuar" }).click();
      await page.waitForURL(/\/dashboard(\?.*)?$/, { timeout: 30_000 });
    }
  });

  test("legacy routes redirect to new targets", async ({ page }) => {
    await page.goto("/trocar-obra");
    await expect(page).toHaveURL(/\/responsaveis(\?.*)?$/);

    await page.goto("/equipe");
    await expect(page).toHaveURL(/\/responsaveis(\?.*)?$/);

    await page.goto("/clima");
    await expect(page).toHaveURL(/\/dashboard(\?.*)?$/);

    await page.goto("/assistente");
    await expect(page).toHaveURL(/\/dashboard(\?.*)?$/);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });
});
