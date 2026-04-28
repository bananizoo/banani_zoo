import { test, expect } from '@playwright/test';

test.describe('User 2 Tests - BaNaNi Zoo', () => {

  test('Add product to cart and open cart drawer', async ({ page }) => {
    await page.goto('/');
    
    const addButton = page.getByRole('button', { name: /у кошик/i }).first();
    await addButton.click();

    await page.locator('button:has-text("🛒")').click({ timeout: 10000 });
    
    await expect(page.getByText(/кошик/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('Favorites page shows authentication message', async ({ page }) => {
    await page.goto('/favorites');
    await expect(page.getByText(/увійти|акаунт/i)).toBeVisible({ timeout: 10000 });
  });

  test('Checkout button shows auth warning', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /у кошик/i }).first().click();
    await page.locator('button:has-text("🛒")').click();

    await page.getByRole('button', { name: /оформити замовлення/i }).click();
    
    await expect(page.getByText(/увійти|авториз|акаунт/i)).toBeVisible({ timeout: 12000 });
  });
});
