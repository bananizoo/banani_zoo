import { test, expect } from '@playwright/test';

test.describe('User 2 tests', () => {

  test('Catalog loads on home page', async ({ page }) => {
    await page.goto('/');

    const products = page.locator('text=₴');
    await expect(products.first()).toBeVisible();
  });

  test('Filter select exists', async ({ page }) => {
    await page.goto('/');

    const select = page.locator('select');
    await expect(select).toBeVisible();

    await expect(select).toContainText('Собаки');
    await expect(select).toContainText('Коти');
  });

  test('Add to cart button exists', async ({ page }) => {
    await page.goto('/');

    const button = page.getByRole('button', { name: /у кошик/i }).first();
    await expect(button).toBeVisible();
  });

});
