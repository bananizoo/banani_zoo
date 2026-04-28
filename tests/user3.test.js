import { test, expect } from '@playwright/test';

test.describe('User 3 Tests - BaNaNi Zoo', () => {

  test('Search returns results', async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder(/що шукає/i).fill('корм');
    await page.keyboard.press('Enter');
    
    // Перевіряємо, що товари з'явилися
    await expect(page.locator('text=₴').first()).toBeVisible({ timeout: 10000 });
  });

  test('Compare page is accessible', async ({ page }) => {
    await page.goto('/compare');
    await expect(page.getByRole('heading', { name: /порівняння/i })).toBeVisible();
  });

  test('Non-existent page returns 404', async ({ page }) => {
    await page.goto('/non-existent-page-xyz12345');
    await expect(page.getByText(/404|не знайдено/i, { exact: false })).toBeVisible({ timeout: 10000 });
  });
});
