import { Page, Locator, expect } from '@playwright/test';

export class ProductsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Locators
  private get productsHeading(): Locator {
    return this.page.getByRole('heading', { name: 'All Products' });
  }

  private get productsList(): Locator {
    return this.page.locator('.features_items');
  }

  private get productItems(): Locator {
    return this.page.locator('.productinfo');
  }

  private get searchInput(): Locator {
    return this.page.locator('#search_product');
  }

  private get searchButton(): Locator {
    return this.page.locator('#submit_search');
  }

  // Actions
  async goto(): Promise<void> {
    await this.page.goto('/products');
  }

  async searchProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  // Verifications
  async verifyPageLoaded(): Promise<void> {
    await expect(this.productsHeading).toBeVisible();
    await expect(this.productsList).toBeVisible();
  }

  async verifyProductsDisplayed(): Promise<void> {
    await expect(this.productItems.first()).toBeVisible();
    const count = await this.getProductCount();
    expect(count).toBeGreaterThan(0);
  }
}
