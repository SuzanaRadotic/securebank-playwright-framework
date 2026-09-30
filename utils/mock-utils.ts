import { Page } from '@playwright/test';

export async function mockServerError(page: Page, urlPattern: string | RegExp, status = 500) {
  await page.route(urlPattern, route => {
    if (['fetch', 'xhr'].includes(route.request().resourceType())) {
      route.fulfill({ status, json: { message: 'Server Error' } });
    } else {
      route.continue();
    }
  });
}