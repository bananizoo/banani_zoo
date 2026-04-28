import { test, expect } from '@playwright/test';

test.describe('User 4 tests', () => {

  test('Logo exists on page', async ({ page }) => {
    await page.goto('/');

    const logo = page.locator('img[src*="logo"]');
    await expect(logo.first()).toBeVisible();
  });

  test('404 page works', async ({ page }) => {
    await page.goto('/random-page-123');

    await expect(page.getByText(/404/i)).toBeVisible();
  });

  test('Footer exists', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('footer')).toBeVisible();
  });

});
