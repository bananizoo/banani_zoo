import { test, expect } from '@playwright/test';

test.describe('User 1 Tests - BaNaNi Zoo', () => {

  test('Home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/bananizoo/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Navigation to About page works', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: /про нас/i }).first();
    await expect(aboutLink).toBeVisible();
    await aboutLink.click();
    await expect(page).toHaveURL(/about/);
  });

  test('Social media links in footer are placeholders', async ({ page }) => {
    await page.goto('/');
    const footerLinks = page.locator('footer .social-icon a');
    await expect(footerLinks).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(footerLinks.nth(i)).toHaveAttribute('href', '#');
    }
  });
});
