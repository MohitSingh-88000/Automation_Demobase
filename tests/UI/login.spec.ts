import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { uiData } from '../../test-data/uiData';

test.describe('Sauce Demo - Login Scenarios', () => {
  test('Scenario 1 - Valid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(uiData.validUser.username, uiData.validUser.password);

    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('.title')).toHaveText(uiData.titles.products);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Scenario 2 - Invalid Login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(uiData.invalidUser.username, uiData.invalidUser.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(uiData.errorMessage);

    const errorText = await loginPage.getErrorText();
    expect(errorText).toBeTruthy();
  });
});
