import { test, expect } from '@playwright/test';

test.describe('User 4 Tests - BaNaNi Zoo', () => {

  test('Auth popup opens when clicking profile icon', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: '👤' }).click();
    await expect(page.locator('.auth-popup')).toBeVisible({ timeout: 10000 });
  });

  test('Footer is present with navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByRole('link', { name: /калькулятор/i })).toBeVisible();
  });

  test('Clicking favorite heart shows login prompt', async ({ page }) => {
    await page.goto('/');
    
    const heart = page.locator('button[style*="24px"], button:has-text("❤️"), button:has-text("🤍")').first();
    await heart.click();

    await expect(page.getByText(/увійти|логін|акаунт/i)).toBeVisible({ timeout: 12000 });
  });
});
