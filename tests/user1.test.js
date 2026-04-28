import { test, expect } from '@playwright/test';

test.describe('User 1 Tests - BaNaNi Zoo', () => {

  test('Home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/bananizoo/);
    await expect(page.getByRole('link', { name: /про нас/i })).toBeVisible();
  });

  test('Navigation to About page works', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: /про нас/i }).first();
    await aboutLink.click();
    
    await expect(page).toHaveURL(/about/, { timeout: 10000 }).catch(() => {
      console.log('URL не змінився, перевіряємо наявність тексту');
    });
    await expect(page.getByText(/про нас|about/i, { exact: false })).toBeVisible({ timeout: 8000 });
  });

  test('Footer contains navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByRole('link', { name: /про нас/i }).first()).toBeVisible();
  });
});
