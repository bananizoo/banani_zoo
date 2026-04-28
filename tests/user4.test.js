import { test, expect } from '@playwright/test';

test.describe('User 4 tests', () => {

  test('Navigation menu exists', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  test('Logo exists and is clickable', async ({ page }) => {
    await page.goto('/');

    const logo = page.locator('a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('Invalid page shows 404', async ({ page }) => {
    await page.goto('/random-page');

    const text = await page.textContent('body');
    expect(text.toLowerCase()).toContain('could not be found');
  });

});
