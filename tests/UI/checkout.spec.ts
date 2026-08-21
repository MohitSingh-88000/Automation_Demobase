import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { uiData } from '../../test-data/uiData';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(uiData.validUser.username, uiData.validUser.password);
  await expect(page).toHaveURL(/inventory\.html/);
});

test.describe('Sauce Demo - Checkout', () => {
  test('Scenario 4 - Checkout', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
  

    const productName = uiData.products.backpack;
    await inventory.addProductToCartByName(productName);
    await expect(inventory.cartBadge).toBeVisible();
    const badgeCount = await inventory.getCartBadgeCount();
    expect(badgeCount).toBe(1);

    await inventory.goToCart();
    await expect(page).toHaveURL(/.*cart\.html/);
    await cart.goToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one\.html/);

    await checkout.fillCustomerInfo(uiData.checkout.firstName, uiData.checkout.lastName, uiData.checkout.postalCode);
    await expect(page).toHaveURL(/.*checkout-step-two\.html/);
    await expect(page.locator('.title')).toHaveText(uiData.titles.checkoutOverview);

    await expect(page.locator('.cart_item')).toBeVisible();
    const itemNames = await page.locator('.inventory_item_name').allTextContents();
    expect(itemNames).toContain(productName);
    await expect(page.locator('.summary_total_label')).toBeVisible();

    await checkout.finishCheckout();
    await expect(page).toHaveURL(/.*checkout-complete\.html/);
    await checkout.waitForSuccessPage();
    await expect(checkout.completeHeader).toHaveText(uiData.checkout.successHeader);
    await expect(checkout.completeText).toHaveText(uiData.checkout.successText);
  });
});
