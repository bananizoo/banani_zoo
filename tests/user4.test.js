import { test, expect } from "@playwright/test";

test.describe("User 4 Tests - BaNaNi Zoo", () => {
  test("Auth popup opens when clicking profile icon", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "👤" }).click();
    await expect(page.locator(".auth-popup")).toBeVisible({ timeout: 10000 });
  });

  test("Footer is present with navigation", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link", { name: "Калькулятор" })).toBeVisible();
  });

  test("Favorites page shows login prompt", async ({ page }) => {
    await page.goto("/favorites");
    await expect(page.getByText(/увійти|акаунт|авториз/i)).toBeVisible({ timeout: 12000 });
  });
});