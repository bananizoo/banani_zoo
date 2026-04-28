import { test, expect } from '@playwright/test';

test.describe('User 4 tests', () => {

  test('Logo redirects to home', async ({ page }) => {
    await page.goto('/about');

    const logo = page.locator('img[alt="banani"]');
    await logo.click();

    await expect(page).toHaveURL('/');
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
