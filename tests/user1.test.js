import { test, expect } from '@playwright/test';

test.describe('User 1 tests', () => {

  // 1. SMOKE TEST
  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/bananizoo/);
  });

  // 2. INTEGRATION UI TEST
  test('About page opens from navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Про нас');
    await expect(page).toHaveURL(/about|pro-nas/);
  });

  // 3. NEGATIVE TEST
  test('Instagram does not open internal page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Instagram');
    await expect(page.url()).not.toContain('/instagram');
  });

});
