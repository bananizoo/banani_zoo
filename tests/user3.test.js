import { test, expect } from '@playwright/test';

test.describe('User 3 Tests - BaNaNi Zoo', () => {

  // Позитивний тест 1
  test('Search functionality works correctly', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    
    await page.getByPlaceholder(/що шукає ваш улюбленець/i).fill('корм');
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/search=корм/);
    await expect(page.locator('text=₴').first()).toBeVisible();
  });

  // Позитивний тест 2
  test('Compare page is accessible', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/compare');
    await expect(page).toHaveURL(/compare/);
    await expect(page.getByText(/порівняння|обране/i)).toBeVisible();
  });

  // Негативний тест
  test('Non-existent page shows 404 (negative)', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/non-existent-page-xyz-12345');
    await expect(page.getByText(/404|не знайдено|page not found/i, { exact: false })).toBeVisible({ timeout: 10000 });
  });
});
