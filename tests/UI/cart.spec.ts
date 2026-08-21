import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { uiData } from '../../test-data/uiData';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(uiData.validUser.username, uiData.validUser.password);
  await expect(page).toHaveURL(/inventory\.html/);
});

test.describe('Sauce Demo - Cart Scenarios', () => {
  test('Scenario 3 - Add Product to Cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    
    const productName = uiData.products.backpack;
    await inventory.addProductToCartByName(productName);

    await expect(inventory.cartBadge).toBeVisible();
    const badgeCount = await inventory.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    await inventory.goToCart();
    const names = await cart.getCartItemNames();
    expect(names).toContain(productName);
  });

  test('Scenario 5 - Multiple Products / Cart Validation', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    const prod1 = uiData.products.backpack;
    const prod2 = uiData.products.bikeLight;
    const prod3 = uiData.products.onesie;

    await inventory.addProductToCartByName(prod1);
    await inventory.addProductToCartByName(prod2);
    await inventory.addProductToCartByName(prod3);

    await expect(inventory.cartBadge).toBeVisible();
    const count = await inventory.getCartBadgeCount();
    expect(count).toBe(3);

    await inventory.goToCart();
    let names = await cart.getCartItemNames();
    expect(names).toEqual(expect.arrayContaining([prod1, prod2, prod3]));

    await cart.removeProductByName(prod3);

    names = await cart.getCartItemNames();
    expect(names).toEqual(expect.arrayContaining([prod1, prod2]));
    expect(names).not.toContain(prod3);
  });
});
