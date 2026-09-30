import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageContainer: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = this.page.getByTestId('login-username-input');
    this.passwordInput = this.page.getByTestId('login-password-input');
    this.loginButton = this.page.getByRole('button', { name: 'Sign In' });
    this.errorMessageContainer = this.page.getByTestId('login-error-message');
  }

  async navigateTo(): Promise<void> {
    await this.page.goto('/bank/login');
  }

  async enterUserNameAndPassword(username: string, pass: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  /**
   * Verifies that the expected error message text is displayed in the error container
   */
  async verifyErrorMessageIsDisplayed(expectedMessage: string | RegExp): Promise<void> {
    await expect(this.errorMessageContainer).toHaveText(expectedMessage);
  }
}
