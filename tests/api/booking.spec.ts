import { test, expect } from '@playwright/test';
import { AuthApi } from '../../api/AuthApi';
import { BookingApi } from '../../api/BookingApi';
import { bookingData } from '../../test-data/bookingData';
import { attachApiResponse } from './testUtils';


// Central API base URL for the Restful Booker app.
// Keeping it in one place makes the suite easier to run against different environments.
const baseUrl = process.env.BASE_URL || 'https://restful-booker.herokuapp.com';

test.describe('Restful Booker booking API', () => {
  // Flow: create a booking first, then reuse the returned bookingId in the next read request.
  test('Scenario 1 - Get Booking: retrieve a booking and validate response fields', async ({ request }, testInfo) => {
    const bookingApi = new BookingApi(request, baseUrl);

    const created = await bookingApi.createBooking(bookingData.validBooking);
    await attachApiResponse(testInfo, 'Create Booking Response', created.body);
    expect(created.response.status()).toBe(200);
    const bookingId = created.body.bookingid;
    expect(bookingId).toBeTruthy();

    const fetched = await bookingApi.getBookingById(bookingId);
    await attachApiResponse(testInfo, 'Get Booking By ID Response', fetched.body);
    expect(fetched.response.status()).toBe(200);
    expect(fetched.body).toMatchObject({
      firstname: bookingData.validBooking.firstname,
      lastname: bookingData.validBooking.lastname,
      totalprice: bookingData.validBooking.totalprice,
      depositpaid: bookingData.validBooking.depositpaid,
      bookingdates: bookingData.validBooking.bookingdates,
      additionalneeds: bookingData.validBooking.additionalneeds,
    });
  });

  test('Scenario 2 - Create Booking: create a booking and validate response body', async ({ request }, testInfo) => {
    const bookingApi = new BookingApi(request, baseUrl);

    const created = await bookingApi.createBooking(bookingData.validBooking);
    await attachApiResponse(testInfo, 'Create Booking Response', created.body);

    expect(created.response.status()).toBe(200);
    expect(created.body.bookingid).toBeTruthy();
    expect(created.body.booking).toMatchObject({
      firstname: bookingData.validBooking.firstname,
      lastname: bookingData.validBooking.lastname,
      totalprice: bookingData.validBooking.totalprice,
      depositpaid: bookingData.validBooking.depositpaid,
      bookingdates: bookingData.validBooking.bookingdates,
      additionalneeds: bookingData.validBooking.additionalneeds,
    });
    expect(created.body.booking.firstname).toBe(bookingData.validBooking.firstname);
    expect(created.body.booking.lastname).toBe(bookingData.validBooking.lastname);
    expect(created.body.booking.totalprice).toBe(bookingData.validBooking.totalprice);
    expect(created.body.booking.depositpaid).toBe(bookingData.validBooking.depositpaid);
    expect(created.body.booking.bookingdates.checkin).toBe(bookingData.validBooking.bookingdates.checkin);
    expect(created.body.booking.bookingdates.checkout).toBe(bookingData.validBooking.bookingdates.checkout);
  });

  // Flow: create the booking, log in to receive the auth token, then update the same booking using that token.
  test('Scenario 3 - Update Booking: update a created booking and verify changed values', async ({ request }, testInfo) => {
    const bookingApi = new BookingApi(request, baseUrl);
    const authApi = new AuthApi(request, baseUrl);

    const created = await bookingApi.createBooking(bookingData.validBooking);
    await attachApiResponse(testInfo, 'Create Booking Response', created.body);
    const bookingId = created.body.bookingid;
    expect(created.response.status()).toBe(200);

    const auth = await authApi.login();
    await attachApiResponse(testInfo, 'Auth Login Response', {
      token: auth.token,
      status: auth.response.status(),
    });
    expect(auth.response.status()).toBe(200);
    expect(auth.token).toBeTruthy();

    const updated = await bookingApi.updateBooking(bookingId, bookingData.updatedBooking, auth.token);
    await attachApiResponse(testInfo, 'Update Booking Response', updated.body);
    expect(updated.response.status()).toBe(200);
    expect(updated.body).toMatchObject({
      firstname: bookingData.updatedBooking.firstname,
      lastname: bookingData.updatedBooking.lastname,
      totalprice: bookingData.updatedBooking.totalprice,
      depositpaid: bookingData.updatedBooking.depositpaid,
      bookingdates: bookingData.updatedBooking.bookingdates,
      additionalneeds: bookingData.updatedBooking.additionalneeds,
    });

    const fetchedAfterUpdate = await bookingApi.getBookingById(bookingId);
    await attachApiResponse(testInfo, 'Fetched Booking After Update Response', fetchedAfterUpdate.body);
    expect(fetchedAfterUpdate.response.status()).toBe(200);
    expect(fetchedAfterUpdate.body.firstname).toBe(bookingData.updatedBooking.firstname);
    expect(fetchedAfterUpdate.body.lastname).toBe(bookingData.updatedBooking.lastname);
    expect(fetchedAfterUpdate.body.totalprice).toBe(bookingData.updatedBooking.totalprice);
    expect(fetchedAfterUpdate.body.bookingdates.checkin).toBe(bookingData.updatedBooking.bookingdates.checkin);
    expect(fetchedAfterUpdate.body.bookingdates.checkout).toBe(bookingData.updatedBooking.bookingdates.checkout);
    expect(fetchedAfterUpdate.body.additionalneeds).toBe(bookingData.updatedBooking.additionalneeds);
  });

  // Flow: create booking, authenticate, delete it, then verify the booking is no longer available.
  test('Scenario 4 - Delete Booking: delete a created booking and verify it is no longer retrievable', async ({ request }, testInfo) => {
    const bookingApi = new BookingApi(request, baseUrl);
    const authApi = new AuthApi(request, baseUrl);

    const created = await bookingApi.createBooking(bookingData.validBooking);
    await attachApiResponse(testInfo, 'Create Booking Response', created.body);
    const bookingId = created.body.bookingid;
    expect(created.response.status()).toBe(200);

    const auth = await authApi.login();
    await attachApiResponse(testInfo, 'Auth Login Response', {
      token: auth.token,
      status: auth.response.status(),
    });
    expect(auth.response.status()).toBe(200);

    const deleted = await bookingApi.deleteBooking(bookingId, auth.token);
    await attachApiResponse(testInfo, 'Delete Booking Response', {
      status: deleted.response.status(),
      headers: deleted.response.headers(),
      url: deleted.response.url(),
    });
    expect(deleted.response.status()).toBe(201);

    const fetchedAfterDelete = await bookingApi.getBookingById(bookingId);
    await attachApiResponse(testInfo, 'Fetched Booking After Delete Response', fetchedAfterDelete.body);
    expect(fetchedAfterDelete.response.status()).toBe(404);
    expect(fetchedAfterDelete.body).toBeNull();
  });

});
