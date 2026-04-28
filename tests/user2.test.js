import { test, expect } from '@playwright/test';

test.describe('User 2 tests', () => {

  test('Catalog loads on home page', async ({ page }) => {
    await page.goto('/');

    const products = page.locator('text=₴');
    await expect(products.first()).toBeVisible();
  });

  test('Filter buttons exist', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/собаки/i)).toBeVisible();
    await expect(page.getByText(/коти/i)).toBeVisible();
  });

  test('Add to cart button works (exists)', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: /у кошик/i }).first();
    await expect(button).toBeVisible();
  });

});
