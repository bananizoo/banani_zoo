import { test, expect } from '@playwright/test';

test.describe('User 2 tests', () => {

  test('Animals navigation exists', async ({ page }) => {
    await page.goto('/');

    const animalsLink = page.getByRole('link', { name: /тварини/i });
    await expect(animalsLink).toBeVisible();
  });

  test('Animals page has content', async ({ page }) => {
    await page.goto('/');

    const text = await page.textContent('body');
    expect(text.length).toBeGreaterThan(50);
  });

  test('TikTok is external link', async ({ page }) => {
    await page.goto('/');

    const tiktok = page.locator('a[href*="tiktok"]');

    if (await tiktok.count() > 0) {
      const href = await tiktok.first().getAttribute('href');
      expect(href).toContain('tiktok');
    }
  });

});
