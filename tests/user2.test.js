import { test, expect } from '@playwright/test';

test.describe('User 2 Tests - BaNaNi Zoo', () => {

  // Позитивний тест 1
  test('Add product to cart works (unauthorized fallback)', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    
    const addToCartBtn = page.getByRole('button', { name: /у кошик/i }).first();
    await addToCartBtn.click();

    // Відкриваємо кошик
    await page.locator('button:has-text("🛒")').click();
    await expect(page.getByText(/кошик/i)).toBeVisible();
    await expect(page.locator('text=грн')).toBeVisible();
  });

  // Позитивний тест 2
  test('Favorites page opens and shows auth message for unauth user', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/favorites');
    await expect(page).toHaveURL(/favorites/);
    await expect(page.getByText(/увійти|акаунт|обране/i)).toBeVisible();
  });

  // Негативний тест
  test('Checkout button requires authentication (negative)', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    await page.getByRole('button', { name: /у кошик/i }).first().click();
    
    await page.locator('button:has-text("🛒")').click();
    await page.getByRole('button', { name: /оформити замовлення/i }).click();

    await expect(page.getByText(/увійти|авториз|акаунт/i)).toBeVisible({ timeout: 8000 });
  });
});
