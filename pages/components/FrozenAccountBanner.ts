import { Page, Locator, expect } from '@playwright/test';

export class FrozenAccountBanner {
  readonly banner: Locator;

  constructor(page: Page) {
    this.banner = page.getByTestId('frozen-account-banner');
  }

  async verifyIsDisplayed(expectedText: string): Promise<void> {
    await expect(this.banner).toBeVisible();
    await expect(this.banner).toContainText(expectedText);
  }
}
