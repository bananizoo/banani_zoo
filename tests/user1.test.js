import { test, expect } from "@playwright/test";

test.describe("User 1 Tests - BaNaNi Zoo", () => {
  test("Home page loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav").getByRole("link", { name: "Про нас" })).toBeVisible();
  });

  test("Navigation to About page works", async ({ page }) => {
    await page.goto("/");
    await page.locator("nav").getByRole("link", { name: "Про нас" }).click();
    await expect(page).toHaveURL(/about/);
    await expect(page.getByRole("heading", { name: /про нас/i })).toBeVisible();
  });

  test("Footer contains navigation links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.getByRole("link", { name: "Про нас" })).toBeVisible();
  });
});