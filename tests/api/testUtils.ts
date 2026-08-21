import { type TestInfo } from '@playwright/test';

// Reusable helper for attaching the actual API response to the Playwright HTML report.
// This makes failures easier to debug because the returned payload is visible beside the assertion.
export async function attachApiResponse(
  testInfo: TestInfo,
  label: string,
  payload: unknown,
  contentType: 'application/json' | 'text/plain' = 'application/json'
) {
  // Some API responses are JSON objects while others are plain text errors.
  // We keep the helper flexible so it works for both response types.
  const body = typeof payload === 'string'
    ? payload
    : JSON.stringify(payload ?? {}, null, 2);

  await testInfo.attach(label, {
    body,
    contentType,
  });
}
