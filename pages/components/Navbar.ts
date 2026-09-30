import { Page, Locator, expect } from '@playwright/test';

export class Navbar {
  readonly page: Page;
  readonly themeToggleButton: Locator;
  readonly logoutButton: Locator;
  readonly htmlTag: Locator;

  constructor(page: Page) {
    this.page = page;

    this.themeToggleButton = this.page.getByRole('button', {
      name: /switch to (dark|light) mode/i,
    });
    this.logoutButton = this.page.getByRole('button', { name: 'Logout' });
    this.htmlTag = this.page.locator('html');
  }

  async clickThemeToggleButton(): Promise<void> {
    await this.themeToggleButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async verifyDarkModeState(shouldBeEnabled: boolean): Promise<void> {
    if (shouldBeEnabled) {
      await expect(this.htmlTag).toHaveClass(/dark/);
    } else {
      await expect(this.htmlTag).not.toHaveClass(/dark/);
    }
  }

  async verifyLoginPageIsDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL('/bank/login');
  }
}
