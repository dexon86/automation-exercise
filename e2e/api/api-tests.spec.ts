import { test, expect } from '@playwright/test';
import { ApiHelper } from './api-helper';
import { UserApi } from './user-api';
import { generateUserData } from '../helpers/test-data';

test.describe('API Tests @smoke', () => {
  test('should get all products list', async ({ request }) => {
    const apiHelper = new ApiHelper(request);

    await test.step('Send GET request to products API', async () => {
      const response = await apiHelper.get('/api/productsList');
      await apiHelper.verifyStatusCode(response, 200);
    });

    await test.step('Verify response contains products', async () => {
      const response = await apiHelper.get('/api/productsList');
      const body = await apiHelper.getResponseBody<{ products: unknown[] }>(response);
      expect(body.products).toBeDefined();
      expect(Array.isArray(body.products)).toBe(true);
      expect(body.products.length).toBeGreaterThan(0);
    });
  });

  test('should get all brands list', async ({ request }) => {
    const apiHelper = new ApiHelper(request);

    await test.step('Send GET request to brands API', async () => {
      const response = await apiHelper.get('/api/brandsList');
      await apiHelper.verifyStatusCode(response, 200);
    });

    await test.step('Verify response contains brands', async () => {
      const response = await apiHelper.get('/api/brandsList');
      const body = await apiHelper.getResponseBody<{ brands: unknown[] }>(response);
      expect(body.brands).toBeDefined();
      expect(Array.isArray(body.brands)).toBe(true);
    });
  });

  test('should create and verify user account via API', async ({ request }) => {
    const userApi = new UserApi(request);
    const userData = generateUserData();

    await test.step('Create user account via API', async () => {
      const response = await userApi.createAccount(userData);
      await userApi.verifyStatusCode(response, 200);
      const body = await userApi.getResponseBody<{ message: string }>(response);
      expect(body.message).toBe('User created!');
    });

    await test.step('Verify login with created credentials', async () => {
      const response = await userApi.verifyLogin(userData.email, userData.password);
      await userApi.verifyStatusCode(response, 200);
      const body = await userApi.getResponseBody<{ message: string }>(response);
      expect(body.message).toBe('User exists!');
    });

    await test.step('Delete user account', async () => {
      const response = await userApi.deleteAccount(userData.email, userData.password);
      await userApi.verifyStatusCode(response, 200);
    });
  });

  test('should return error for invalid login credentials @regression', async ({ request }) => {
    const userApi = new UserApi(request);

    await test.step('Attempt login with invalid credentials', async () => {
      const response = await userApi.verifyLogin('invalid@email.com', 'wrongpassword');
      await userApi.verifyStatusCode(response, 200);
      const body = await userApi.getResponseBody<{ message: string }>(response);
      expect(body.message).toBe('User not found!');
    });
  });
});
