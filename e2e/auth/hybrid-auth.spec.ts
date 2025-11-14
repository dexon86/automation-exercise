import { test, expect } from '@playwright/test';
import { UserApi } from '../api/user-api';
import { generateUserData, UserData } from '../helpers/test-data';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

test.describe('Hybrid Authentication Tests @smoke', () => {
  let testUser: UserData;

  test.beforeEach(async ({ request }) => {
    await test.step('Setup: Create test user via API', async () => {
      testUser = generateUserData();
      const userApi = new UserApi(request);
      const response = await userApi.createAccount(testUser);
      await userApi.verifyStatusCode(response, 200);
    });
  });

  test.afterEach(async ({ request }) => {
    await test.step('Cleanup: Delete test user via API', async () => {
      const userApi = new UserApi(request);
      try {
        await userApi.deleteAccount(testUser.email, testUser.password);
      } catch (error) {
        console.log('User already deleted or not found');
      }
    });
  });

  test('should login with API-created user and verify logged-in state', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginFormVisible();
    });

    await test.step('Login with credentials', async () => {
      await loginPage.fillLoginCredentials(testUser.email, testUser.password);
    });

    await test.step('Submit login and verify redirect', async () => {
      const homePage = await loginPage.submitLogin();
      await homePage.verifyUserLoggedIn(testUser.firstname);
    });
  });

  test('should login and access products page', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Login with test user', async () => {
      await loginPage.goto();
      const homePage = await loginPage.login(testUser.email, testUser.password);
      await homePage.verifyUserLoggedIn(testUser.firstname);
    });

    await test.step('Navigate to products page', async () => {
      const productsPage = new ProductsPage(page);
      await productsPage.goto();
      await productsPage.verifyPageLoaded();
      await productsPage.verifyProductsDisplayed();
    });

    await test.step('Verify user remains logged in', async () => {
      const isLoggedIn = await page.getByRole('link', { name: 'Logout' }).isVisible();
      expect(isLoggedIn).toBe(true);
    });
  });

  test('should verify products count after login @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await test.step('Login and navigate to products', async () => {
      await loginPage.goto();
      await loginPage.login(testUser.email, testUser.password);
      await productsPage.goto();
    });

    await test.step('Verify products are displayed', async () => {
      await productsPage.verifyProductsDisplayed();
      const productCount = await productsPage.getProductCount();
      expect(productCount).toBeGreaterThan(30);
    });
  });
});

test.describe('Login Validation Tests @regression', () => {
  test('should show error for invalid login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
      await loginPage.verifyLoginFormVisible();
    });

    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.fillLoginCredentials('invalid@test.com', 'wrongpassword');
      await loginPage.submitLogin();
    });

    await test.step('Verify error message displayed', async () => {
      await expect(page.locator('p').filter({ hasText: 'Your email or password is incorrect!' })).toBeVisible();
    });
  });
});
