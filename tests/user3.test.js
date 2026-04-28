import { test, expect } from '@playwright/test';

test.describe('User 3 tests', () => {

  test('Page has main title', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText(/зоомагазин/i)).toBeVisible();
  });

  test('Products are displayed', async ({ page }) => {
    await page.goto('/');

    const items = page.locator('text=₴');
    await expect(items.first()).toBeVisible();
  });

  test('Cart opens and shows empty message', async ({ page }) => {
    await page.goto('/');

    const cartButton = page.getByText(/кошик/i).first();
    await cartButton.click();

    await expect(page.getByText(/кошик порожній/i)).toBeVisible();
  });

});
