import { APIRequestContext } from '@playwright/test';

// Wrapper for authentication-related endpoints.
// The login call returns the auth token that is later reused for protected booking operations.
export class AuthApi {
  constructor(
    private request: APIRequestContext,
    // Base URL is configurable so the same tests can run against dev, staging, or prod.
    private baseUrl: string = process.env.BASE_URL || 'https://restful-booker.herokuapp.com'
  ) {}

  // Logs in and returns the token needed for update/delete operations.
  async login() {
    const response = await this.request.post(`${this.baseUrl}/auth`, {
      data: {
        username: process.env.BOOKING_USERNAME || 'admin',
        password: process.env.BOOKING_PASSWORD || 'password123',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const body = await response.json();
    return {
      response,
      token: body.token,
    };
  }
}
