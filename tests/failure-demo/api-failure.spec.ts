import { test, expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';

// Intentionally failing API test for failure-reporting demonstration.
// This test creates a valid booking and then deliberately expects the wrong status code to show failure evidence in the HTML report.
test('INTENTIONAL API FAILURE - wrong expected status code', async ({ request }, testInfo) => {
  const payload = {
    firstname: 'John',
    lastname: 'Brown',
    totalprice: 111,
    depositpaid: true,
    bookingdates: {
      checkin: '2024-01-01',
      checkout: '2024-01-02',
    },
    additionalneeds: 'Breakfast',
  };

  const response = await request.post(`${baseUrl}/booking`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  const body = await response.json();

  await testInfo.attach('Create Booking Response - intentional failure', {
    body: JSON.stringify(body, null, 2),
    contentType: 'application/json',
  });

  expect(response.status()).toBe(201);
});
