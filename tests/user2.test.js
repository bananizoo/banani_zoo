import { test, expect } from '@playwright/test';

test.describe('User 2 tests', () => {

  // 1. INTEGRATION
  test('Animals page opens', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Тварини');
    await expect(page).toHaveURL(/animals/);
  });

  // 2. FUNCTIONAL UI TEST
  test('Animals page has content', async ({ page }) => {
    await page.goto('/animals');
    const text = await page.textContent('body');
    expect(text.length).toBeGreaterThan(10);
  });

  // 3. NEGATIVE TEST
  test('TikTok does not open page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=TikTok');
    await expect(page.url()).not.toContain('/tiktok');
  });

});
