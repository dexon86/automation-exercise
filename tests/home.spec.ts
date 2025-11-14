import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Automation Exercise/);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Products')).toBeVisible();
    await expect(page.locator('text=Cart')).toBeVisible();
    await expect(page.locator('text=Signup / Login')).toBeVisible();
  });

  test('should display featured items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Features Items')).toBeVisible();
  });
});
