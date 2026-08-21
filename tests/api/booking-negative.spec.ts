import { test, expect } from '@playwright/test';
import { BookingApi } from '../../api/BookingApi';
import { bookingData } from '../../test-data/bookingData';
import { attachApiResponse } from './testUtils';

// Base URL for negative scenarios. This stays aligned with the main API suite for consistency.
const baseUrl = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';

test.describe('Restful Booker negative API scenarios', () => {
  // Negative validation flow: send a broken booking payload and confirm the API rejects it with the expected error.
  test('Scenario 5 - Negative API: create booking without firstname returns 500', async ({ request }, testInfo) => {
    const bookingApi = new BookingApi(request, baseUrl);

    const invalidBooking = {
      lastname: bookingData.validBooking.lastname,
      totalprice: bookingData.validBooking.totalprice,
      depositpaid: bookingData.validBooking.depositpaid,
      bookingdates: bookingData.validBooking.bookingdates,
      additionalneeds: bookingData.validBooking.additionalneeds,
    };

    const created = await bookingApi.createBooking(invalidBooking as any);
    const responseText = await created.response.text();
    await attachApiResponse(testInfo, 'Invalid Booking Response', responseText || 'No response body received', 'text/plain');
    expect(created.response.status()).toBe(500);
    expect(responseText).toContain('Internal Server Error');
  });
});
