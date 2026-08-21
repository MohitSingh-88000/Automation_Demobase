import { test, expect } from '@playwright/test';

// Intentionally failing UI test for failure-reporting demonstration.
// This is not part of the normal passing suite and should only be used to inspect Playwright report evidence.
test('INTENTIONAL UI FAILURE - wrong product title assertion', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.locator('.title')).toHaveText('Wrong Title For Demo');
});
