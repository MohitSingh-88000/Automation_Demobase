import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  productLocatorByName(name: string) {
    // Locate the inventory_item that has the product name
    return this.page.locator('.inventory_item', { has: this.page.locator('.inventory_item_name', { hasText: name }) });
  }

  async addProductToCartByName(name: string) {
    const product = this.productLocatorByName(name);
    await product.locator('button').click();
  }

  async removeProductFromInventoryByName(name: string) {
    const product = this.productLocatorByName(name);
    await product.locator('button').click();
  }

  async getCartBadgeCount(): Promise<number | null> {
    if (await this.cartBadge.count() === 0) return null;
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : null;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
