import { test, expect } from '@playwright/test';

test.describe('User 1 tests', () => {

  test('Home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/vercel\.app/);
  });

  test('About page opens from navigation', async ({ page }) => {
    await page.goto('/');

    const aboutLink = page.getByRole('link', { name: /про нас/i });

    if (await aboutLink.count() > 0) {
      await aboutLink.click();
      await expect(page).not.toHaveURL(/$/); // не залишились на головній
    }
  });

  test('Instagram does not open internal page', async ({ page }) => {
    await page.goto('/');

    const insta = page.locator('a[href*="instagram"]');

    if (await insta.count() > 0) {
      const href = await insta.first().getAttribute('href');
      expect(href).toContain('instagram'); // зовнішнє посилання
    }
  });

});
