import { test, expect } from '@playwright/test';

test.describe('User 1 Tests - BaNaNi Zoo', () => {

  // Позитивний тест 1
  test('Home page loads and "Про нас" link works', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    await expect(page).toHaveURL(/bananizoo/);
    
    const aboutLink = page.getByRole('link', { name: /про нас/i }).first();
    await expect(aboutLink).toBeVisible();
    
    await aboutLink.click();
    await expect(page).toHaveURL(/about/);
    await expect(page.getByText(/про нас|about/i, { exact: false })).toBeVisible();
  });

  // Позитивний тест 2
  test('Catalog displays products and pet filter works', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    await expect(page.locator('text=₴').first()).toBeVisible();

    await page.locator('select').filter({ hasText: 'Усі тварини' }).selectOption('DOG');
    await expect(page.getByText('Собака', { exact: false })).toBeVisible({ timeout: 10000 });
  });

  // Негативний тест
  test('Social media links in footer point to # (negative)', async ({ page }) => {
    await page.goto('https://bananizoo.vercel.app/');
    
    const socialIcons = page.locator('.social-icon a');
    await expect(socialIcons).toHaveCount(3);

    for (let i = 0; i < 3; i++) {
      await expect(socialIcons.nth(i)).toHaveAttribute('href', '#');
    }
  });
});
