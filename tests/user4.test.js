import { test, expect } from '@playwright/test';

test.describe('User 4 tests', () => {

  // 1. UI TEST
  test('Navigation menu exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  // 2. INTEGRATION TEST
  test('Logo redirects to home', async ({ page }) => {
    await page.goto('/animals');
    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL(/vercel\.app/);
  });

  // 3. NEGATIVE TEST
  test('Invalid page shows 404 content', async ({ page }) => {
    await page.goto('/random-page');
    const text = await page.textContent('body');
    expect(text.toLowerCase()).toContain('could not be found');
  });

});
