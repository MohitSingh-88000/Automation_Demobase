# SauceDemo Playwright Automation Project

This project is a Playwright-based automation suite for two different kinds of testing:

- UI testing on SauceDemo
- API testing on Restful Booker
- a small failure-reporting demo to show how Playwright captures failures, screenshots, and traces

The goal is to keep automated tests simple, reusable, and easy to debug when something breaks.

## What this project is doing

### 1. UI tests
These tests interact with the SauceDemo website using Playwright browser automation.

The UI tests are built with a Page Object Model (POM), which means:
- page-related selectors and actions live in files under `pages/`
- test specs under `tests/UI/` focus on business flows and assertions
- the code is easier to maintain because UI logic is separated from test logic

Example flow:
- open login page
- enter username/password
- click login
- verify page loads
- add product to cart
- check cart details
- complete checkout

### 2. API tests
These tests interact with the Restful Booker API using Playwright's `request` context.

The API tests use helper classes in `api/`:
- `AuthApi` handles login and token generation
- `BookingApi` handles create, read, update, and delete booking actions

This helps keep the tests structured and avoids repeating raw request logic everywhere.

Example flow:
- create booking
- read returned booking ID
- use that ID for a later request
- login and get auth token
- update or delete the booking
- validate the status code and response body

### 3. Failure demo tests
The `tests/failure-demo/` folder contains intentionally failing tests.

These are not part of the normal passing suite. They are used to demonstrate:
- assertion failures
- screenshot capture on failure
- trace capture on failure
- HTML report generation
- API response debugging using `testInfo.attach()`

## Project structure

```text
Automation_SauceDemo/
├── api/
│   ├── AuthApi.ts
│   └── BookingApi.ts
├── pages/
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── test-data/
│   ├── uiData.ts
│   └── bookingData.ts
├── tests/
│   ├── UI/
│   │   ├── login.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   ├── api/
│   │   ├── booking.spec.ts
│   │   ├── booking-negative.spec.ts
│   │   └── testUtils.ts
│   └── failure-demo/
│       ├── ui-failure.spec.ts
│       └── api-failure.spec.ts
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
└── node_modules/
```

## Requirements

You need:
- Node.js
- npm

Install project dependencies:

```bash
npm install
```

## Environment variables

This project reads environment variables from a local `.env` file.

Create your local file from the example:

Linux/macOS:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

You can also manually copy the contents of `.env.example` into a new `.env` file if needed.

Example:

```env
BASE_URL=https://restful-booker.herokuapp.com
BOOKING_USERNAME=admin
BOOKING_PASSWORD=password123
```

This keeps secrets and environment-specific values out of source control.

The expected values are:
- `BASE_URL`
- `BOOKING_USERNAME`
- `BOOKING_PASSWORD`

## Running tests

### Run all tests

```bash
npx playwright test
```

### Run only UI tests

```bash
npx playwright test --project=ui
```

### Run only API tests

```bash
npx playwright test --project=api
```

### Run the failure demo

```bash
npm run test:failure
```

This intentionally fails 2 tests to show debugging/reporting behavior.

## How Playwright is configured

The configuration file `playwright.config.ts` controls:
- test directory
- browser/project setup
- HTML report generation
- screenshot behavior
- trace retention on failure
- parallel execution settings

The important defaults are:
- screenshot is captured only on failure
- trace is retained on failure
- HTML report is generated for easier debugging

## Reports and artifacts

When tests fail, Playwright stores useful debugging files in:

- `playwright-report/` - HTML report
- `test-results/` - raw test artifacts such as:
  - screenshots
  - traces (`trace.zip`)
  - error context files

Open the HTML report:

```bash
npx playwright show-report
```

### View a failed test trace zip

After a failure, go to a failed test folder inside `test-results` and open the `trace.zip` file.

Example:

```bash
npx playwright show-trace test-results/ui-failure-INTENTIONAL-UI--b433e-ong-product-title-assertion-failure-demo/trace.zip
```

This opens the Playwright Trace Viewer so you can inspect the browser run step by step.

If you want to open the trace from an API failure, follow the same pattern:

```bash
npx playwright show-trace test-results/api-failure-INTENTIONAL-AP-59bd9--wrong-expected-status-code-failure-demo/trace.zip
```

## Why the project is structured this way

This setup separates responsibilities:

- `pages/` = UI interaction logic
- `api/` = API request logic
- `test-data/` = reusable input values
- `tests/` = actual scenarios and assertions
- `playwright.config.ts` = project-level behavior and reporting control

This makes the project:
- cleaner
- easier to debug
- easier to extend
- easier to maintain as test coverage grows

## Key concepts used in this project

### Page Object Model (POM)
UI pages are wrapped in classes so tests do not directly interact with raw selectors all over the place.

Example:
- `LoginPage` handles login input and submit actions
- `InventoryPage` handles product actions and cart interactions
- `CheckoutPage` handles customer info and order completion

### API request wrappers
API calls are wrapped in helper classes so tests can do:
- create booking
- get booking by ID
- update booking
- delete booking
- login and fetch token

This avoids repeating request code in each test.

### Chaining data between requests
A common API pattern in this project is:
- create booking
- store returned `bookingId`
- use that `bookingId` in the next request
- login and use `token` for protected operations

This is a very common and realistic API automation pattern.

## Important notes

- The regular test suite is meant to pass and validate application behavior.
- The `failure-demo` tests are intentionally failing for educational/reporting use only.
- Do not change the main passing tests unless there is a real requirement change.
- Keep the code reusable and readable.

## Typical workflow

1. Identify the business flow you want to test
2. Add or reuse data in `test-data/`
3. Create or update page/API helper classes
4. Write a test in `tests/`
5. Run the test
6. Check Playwright report or `test-results` on failure
7. Fix the app or the test based on the actual result

This project is a practical example of how to build a maintainable Playwright automation framework with both UI and API coverage.
