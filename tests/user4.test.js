import { test, expect } from '@playwright/test';

test.describe('User 4 Tests - BaNaNi Zoo', () => {

  // Позитивний тест 1
  test('Auth popup opens and allows switching between login and register', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    
    await page.getByRole('button', { name: '👤' }).click();
    await expect(page.locator('.auth-popup')).toBeVisible();

    await page.getByRole('button', { name: /реєстрація/i }).click();
    await expect(page.getByPlaceholder(/ім'я/i)).toBeVisible();
  });

  // Позитивний тест 2
  test('Footer is visible and contains navigation links', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    await expect(page.locator('footer')).toBeVisible();
    
    await expect(page.getByRole('link', { name: /про нас/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /калькулятор/i })).toBeVisible();
  });

  // Негативний тест
  test('Add to favorites requires login (negative)', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    
    // Знаходимо кнопку "сердечко"
    const heartButton = page.locator('button[style*="24px"]').first();
    await heartButton.click();

    await expect(page.getByText(/увійти|логін|акаунт/i)).toBeVisible({ timeout: 8000 });
  });
});
