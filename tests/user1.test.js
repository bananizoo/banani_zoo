import { test, expect } from '@playwright/test';

test.describe('User 1 tests', () => {

  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/bananizoo/);
  });

  test('About page opens correctly', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /про нас/i }).first();

    await expect(aboutLink).toBeVisible();
    await aboutLink.click();

    await expect(page).toHaveURL(/about/);
  });

  test('Logo is visible', async ({ page }) => {
    await page.goto('/');

    const logo = page.locator('img[src*="logo"]');
    await expect(logo.first()).toBeVisible();
  });

});
