import { test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home Page @smoke', () => {
  test('should load successfully with correct title', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to home page', async () => {
      await homePage.goto();
    });

    await test.step('Verify page title', async () => {
      await homePage.verifyPageTitle();
    });
  });

  test('should display main navigation links', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to home page', async () => {
      await homePage.goto();
    });

    await test.step('Verify navigation is visible', async () => {
      await homePage.verifyNavigationVisible();
    });
  });

  test('should display featured items section @regression', async ({ page }) => {
    const homePage = new HomePage(page);

    await test.step('Navigate to home page', async () => {
      await homePage.goto();
    });

    await test.step('Verify featured items section', async () => {
      await homePage.verifyFeaturedItemsVisible();
    });
  });
});
