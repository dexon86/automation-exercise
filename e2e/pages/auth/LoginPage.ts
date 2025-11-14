import { Page, Locator, expect } from '@playwright/test';
import { HomePage } from '../HomePage';

export class LoginPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Login form locators
  private get loginEmailInput(): Locator {
    return this.page.locator('[data-qa="login-email"]');
  }

  private get loginPasswordInput(): Locator {
    return this.page.locator('[data-qa="login-password"]');
  }

  private get loginButton(): Locator {
    return this.page.locator('[data-qa="login-button"]');
  }

  // Signup form locators
  private get signupNameInput(): Locator {
    return this.page.locator('[data-qa="signup-name"]');
  }

  private get signupEmailInput(): Locator {
    return this.page.locator('[data-qa="signup-email"]');
  }

  private get signupButton(): Locator {
    return this.page.locator('[data-qa="signup-button"]');
  }

  // Headings
  private get loginHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Login to your account' });
  }

  private get signupHeading(): Locator {
    return this.page.getByRole('heading', { name: 'New User Signup!' });
  }

  // Actions - Login
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async fillLoginCredentials(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
  }

  async submitLogin(): Promise<HomePage> {
    await this.loginButton.click();
    return new HomePage(this.page);
  }

  async login(email: string, password: string): Promise<HomePage> {
    await this.fillLoginCredentials(email, password);
    return await this.submitLogin();
  }

  // Actions - Signup
  async fillSignupInfo(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
  }

  async submitSignup(): Promise<void> {
    await this.signupButton.click();
  }

  // Verifications
  async verifyLoginFormVisible(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.loginEmailInput).toBeVisible();
    await expect(this.loginPasswordInput).toBeVisible();
  }

  async verifySignupFormVisible(): Promise<void> {
    await expect(this.signupHeading).toBeVisible();
    await expect(this.signupNameInput).toBeVisible();
    await expect(this.signupEmailInput).toBeVisible();
  }
}
