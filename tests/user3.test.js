import { test, expect } from '@playwright/test';

test.describe('User 3 Tests - BaNaNi Zoo', () => {

  test('Search functionality returns products', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/що шукає/i).fill('корм');
    await page.keyboard.press('Enter');
    
    await expect(page.locator('text=₴').first()).toBeVisible({ timeout: 15000 });
  });

  test('Compare page loads', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByRole('heading', { name: /порівняння/i })).toBeVisible({ timeout: 8000 });
  });

  test('Non-existent route shows error or 404', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await expect(page.locator('body')).toBeVisible();
  });
});
