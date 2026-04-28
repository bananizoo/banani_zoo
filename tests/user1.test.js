import { test, expect } from '@playwright/test';

test.describe('User 1 tests', () => {

  // 1. SMOKE TEST
  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/vercel\.app/);
  });

  // 2. INTEGRATION UI TEST
  test('About page opens from navigation', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href*="about"]').first().click();
    await expect(page).toHaveURL(/about|pro-nas/);
  });

  // 3. NEGATIVE TEST
  test('Instagram does not open internal page', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('a[href*="instagram"]');

    if (await link.count() > 0) {
      await link.first().click();
      await expect(page.url()).not.toContain('/instagram');
    }
  });

});
