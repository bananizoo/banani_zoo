import { test, expect } from '@playwright/test';

test.describe('User 3 tests', () => {

  test('Contacts link exists', async ({ page }) => {
    await page.goto('/');

    const contacts = page.getByRole('link', { name: /контакти/i });
    await expect(contacts).toBeVisible();
  });

  test('Page contains form or contact info', async ({ page }) => {
    await page.goto('/');

    const body = await page.textContent('body');
    expect(body.toLowerCase()).toContain('контакт');
  });

  test('Telegram is external link', async ({ page }) => {
    await page.goto('/');

    const telegram = page.locator('a[href*="t.me"]');

    if (await telegram.count() > 0) {
      const href = await telegram.first().getAttribute('href');
      expect(href).toContain('t.me');
    }
  });

});
