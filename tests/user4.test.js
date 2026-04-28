import { test, expect } from '@playwright/test';

test.describe('User 4 Tests - BaNaNi Zoo', () => {

  test('Auth popup opens correctly', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '👤' }).click();
    await expect(page.locator('.auth-popup')).toBeVisible({ timeout: 8000 });
  });

  test('Footer navigation links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByRole('link', { name: /про нас/i }).first()).toBeVisible();
  });

  test('Adding to favorites requires login', async ({ page }) => {
    await page.goto('/');
    
    // Знаходимо перше сердечко
    const heartButton = page.locator('button[style*="font-size: 24px"]').first();
    await heartButton.click();

    await expect(page.getByText(/увійти|логін|акаунт/i)).toBeVisible({ timeout: 10000 });
  });
});
