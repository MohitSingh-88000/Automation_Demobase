import { APIRequestContext, APIResponse } from '@playwright/test';

export type BookingPayload = {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: {
    checkin: string;
    checkout: string;
  };
  additionalneeds?: string;
};

// API wrapper for the Restful Booker booking endpoints.
// The methods return both the raw Playwright response and the parsed JSON body,
// so the test can assert on status code and payload values without extra boilerplate.
export class BookingApi {
  constructor(
    private request: APIRequestContext,
    // Default base URL can be overridden by environment config, which is useful for CI or different environments.
    private baseUrl: string = process.env.BASE_URL || 'https://restful-booker.herokuapp.com'
  ) {}

  // Playwright responses are text-based, so we parse JSON when possible and safely return null for empty/non-JSON bodies.
  private async parseJsonBody(response: APIResponse) {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  // Creates a booking and returns the created booking ID plus the full booking payload.
  async createBooking(data: BookingPayload) {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const body = await this.parseJsonBody(response);
    return { response, body };
  }

  // Fetches a single booking by id. This is the read step used after create/update flows.
  async getBookingById(id: number) {
    const response = await this.request.get(`${this.baseUrl}/booking/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const body = await this.parseJsonBody(response);
    return { response, body };
  }

  // Lists all bookings. This is useful for verifying data availability or smoke checks.
  async getAllBookings() {
    const response = await this.request.get(`${this.baseUrl}/booking`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    const body = await this.parseJsonBody(response);
    return { response, body };
  }

  // PUT replaces the booking data, and we pass the auth cookie so the API accepts the update.
  async updateBooking(id: number, data: BookingPayload, token: string) {
    const response = await this.request.put(`${this.baseUrl}/booking/${id}`, {
      data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`,
      },
    });

    const body = await this.parseJsonBody(response);
    return { response, body };
  }

  // PATCH is a partial update; useful when only a subset of the fields needs to change.
  async partialUpdateBooking(id: number, partialData: Partial<BookingPayload>, token: string) {
    const response = await this.request.patch(`${this.baseUrl}/booking/${id}`, {
      data: partialData,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`,
      },
    });

    const body = await this.parseJsonBody(response);
    return { response, body };
  }

  // DELETE removes the created booking and requires the auth token for protected operations.
  async deleteBooking(id: number, token: string) {
    const response = await this.request.delete(`${this.baseUrl}/booking/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
    });

    return { response };
  }
}
