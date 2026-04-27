import { test, expect } from '@playwright/test';

test.describe('User 3 tests', () => {

  // 1. INTEGRATION
  test('Contacts page opens', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Контакти');
    await expect(page).toHaveURL(/contacts/);
  });

  // 2. UI TEST
  test('Contact form is visible', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page.locator('form')).toBeVisible();
  });

  // 3. NEGATIVE TEST
  test('Telegram does not open internal route', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Telegram');
    await expect(page.url()).not.toContain('/telegram');
  });

});
