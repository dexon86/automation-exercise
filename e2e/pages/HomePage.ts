import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators using role-based selectors
  private get productsLink(): Locator {
    return this.page.getByRole('link', { name: 'Products' });
  }

  private get cartLink(): Locator {
    return this.page.getByRole('link', { name: 'Cart' });
  }

  private get signupLoginLink(): Locator {
    return this.page.getByRole('link', { name: 'Signup / Login' });
  }

  private get featuresItemsHeading(): Locator {
    return this.page.getByRole('heading', { name: /Features Items/i });
  }

  private get loggedInUserLink(): Locator {
    return this.page.locator('a:has-text("Logged in as")');
  }

  private get logoutLink(): Locator {
    return this.page.getByRole('link', { name: 'Logout' });
  }

  private get deleteAccountLink(): Locator {
    return this.page.getByRole('link', { name: 'Delete Account' });
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async navigateToProducts(): Promise<void> {
    await this.productsLink.click();
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async navigateToSignupLogin(): Promise<void> {
    await this.signupLoginLink.click();
  }

  // Verifications
  async verifyPageTitle(): Promise<void> {
    await expect(this.page).toHaveTitle(/Automation Exercise/);
  }

  async verifyNavigationVisible(): Promise<void> {
    await expect(this.productsLink).toBeVisible();
    await expect(this.cartLink).toBeVisible();
    await expect(this.signupLoginLink).toBeVisible();
  }

  async verifyFeaturedItemsVisible(): Promise<void> {
    await expect(this.featuresItemsHeading).toBeVisible();
  }

  async verifyUserLoggedIn(username: string): Promise<void> {
    await expect(this.loggedInUserLink).toContainText(username);
    await expect(this.logoutLink).toBeVisible();
    await expect(this.deleteAccountLink).toBeVisible();
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }
}
