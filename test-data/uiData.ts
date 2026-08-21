export const uiData = {
  appUrl: process.env.SAUCE_DEMO_URL || 'https://www.saucedemo.com/',
  validUser: {
    username: process.env.SAUCE_VALID_USERNAME || 'standard_user',
    password: process.env.SAUCE_VALID_PASSWORD || 'secret_sauce',
  },
  invalidUser: {
    username: process.env.SAUCE_INVALID_USERNAME || 'standard_user_Invalid',
    password: process.env.SAUCE_VALID_PASSWORD || 'secret_sauce',
  },
  errorMessage: process.env.SAUCE_ERROR_MESSAGE || 'Epic sadface: Username and password do not match any user in this service',
  products: {
    backpack: process.env.SAUCE_PRODUCT_BACKPACK || 'Sauce Labs Backpack',
    bikeLight: process.env.SAUCE_PRODUCT_BIKE_LIGHT || 'Sauce Labs Bike Light',
    onesie: process.env.SAUCE_PRODUCT_ONESIE || 'Sauce Labs Onesie',
  },
  checkout: {
    firstName: process.env.CHECKOUT_FIRST_NAME || 'John',
    lastName: process.env.CHECKOUT_LAST_NAME || 'Doe',
    postalCode: process.env.CHECKOUT_POSTAL_CODE || '12345',
    successHeader: process.env.CHECKOUT_SUCCESS_HEADER || 'Thank you for your order!',
    successText:
      process.env.CHECKOUT_SUCCESS_TEXT ||
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
  },
  titles: {
    products: 'Products',
    checkoutOverview: 'Checkout: Overview',
  },
};
