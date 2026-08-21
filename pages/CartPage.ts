import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
  }

  async getCartItemNames(): Promise<string[]> {
    return await this.page.locator('.cart_item .inventory_item_name').allTextContents();
  }

  async removeProductByName(name: string) {
    const item = this.page.locator('.cart_item', { has: this.page.locator('.inventory_item_name', { hasText: name }) });
    await item.locator('button').click();
  }

  async getCartItemPrices(): Promise<string[]> {
    return await this.page.locator('.cart_item .inventory_item_price').allTextContents();
  }

  async goToCheckout() {
    await this.page.locator('#checkout').click();
  }
}
