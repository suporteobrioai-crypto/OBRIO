import { expect, test } from "@playwright/test";

test.describe("Navigation simplification", () => {
  test("legacy routes redirect to new targets", async ({ page }) => {
    await page.goto("/trocar-obra");
    await expect(page).toHaveURL(/\/responsaveis$/);

    await page.goto("/equipe");
    await expect(page).toHaveURL(/\/responsaveis$/);

    await page.goto("/clima");
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/assistente");
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.goto("/login");
    await expect(page).toHaveURL(/\/(\?.*)?$/);
  });
});
