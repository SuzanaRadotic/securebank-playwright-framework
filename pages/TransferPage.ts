import { Page, Locator, expect } from '@playwright/test';

export class TransferPage {
  readonly page: Page;

  // Form elements
  readonly transferPage: Locator;
  readonly transferForm: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly amountInput: Locator;
  readonly reviewTransferButton: Locator;

  // Dialog elements
  readonly confirmDialog: Locator;
  readonly confirmTransferButton: Locator;
  readonly cancelConfirmButton: Locator;

  // Error container
  readonly insufficientFundsError: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.transferPage = this.page.getByTestId('bank-main-content');

    // Form elements
    this.transferForm = this.page.getByTestId('transfer-form');
    this.fromAccountSelect = this.page.getByTestId('transfer-from-select');
    this.toAccountSelect = this.page.getByTestId('transfer-to-select');
    this.amountInput = this.page.getByTestId('transfer-amount-input');
    this.reviewTransferButton = this.page.getByTestId('review-transfer-btn');

    // Modal dialog locators
    this.confirmDialog = this.page.getByTestId('transfer-confirm-dialog');
    this.confirmTransferButton = this.confirmDialog.getByTestId('confirm-transfer-btn');
    this.cancelConfirmButton = this.confirmDialog.getByTestId('cancel-confirm-transfer-btn');

    // Error alert banner & success message
    this.insufficientFundsError = this.page.getByTestId('transfer-error-message');
    this.successBanner = this.page.getByTestId('transfer-success-heading');
  }

  /**
   * Navigates directly to the Transfer page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/bank/transfer');
  }

  // --- ACTIONS ---

  /**
   * Selects an account in the 'From Account' combobox
   */
  async selectFromAccount(accountNameOrId: string): Promise<void> {
    await this.fromAccountSelect.click();

    const option = this.page.getByRole('listbox').getByRole('option', { name: new RegExp(accountNameOrId, 'i') });

    await expect(option).toBeVisible();
    await option.click();
  }

  /**
   * Selects an account in the 'To Account' combobox
   */
  async selectToAccount(accountNameOrId: string): Promise<void> {
    await this.toAccountSelect.click();

    const option = this.page.getByRole('listbox').getByRole('option', { name: new RegExp(accountNameOrId, 'i') });

    await expect(option).toBeVisible();
    await option.click();
  }

  /**
   * Fills in the transfer amount input
   */
  async fillAmount(amount: string | number): Promise<void> {
    await this.amountInput.fill(amount.toString());
  }

    /**
   * Fills in the transfer money details (From Account, To Account, Amount, and optional Memo)
   */
  async fillTransferForm(fromAccount: string, toAccount: string, amount: string | number): Promise<void> {
    await this.selectFromAccount(fromAccount);
    await this.selectToAccount(toAccount);
    await this.fillAmount(amount);
  }

  /**
   * Clicks 'Review Transfer' and waits for the confirmation dialog
   */
  async clickReviewTransferButton(): Promise<void> {
    await expect(this.reviewTransferButton).toBeEnabled();
    await this.reviewTransferButton.click();
    await expect(this.confirmDialog).toBeVisible();
  }

  /**
   * Clicks 'Confirm Transfer' inside the review modal and waits for the modal to automatically close
   */
  async clickConfirmTransferButton(): Promise<void> {
    await expect(this.confirmDialog).toBeVisible();
    await expect(this.confirmTransferButton).toBeVisible();
    await expect(this.confirmTransferButton).toBeEnabled();

    await this.confirmTransferButton.click();
    await expect(this.confirmDialog).toBeHidden();
  }

  /**
   * Opens the specified account dropdown, parses and returns the balance from option text, and selects the option.
   */
  async selectAccountAndGetBalance(accountType: 'Checking' | 'Savings', targetDropdown: 'from' | 'to'): Promise<number> {
    const trigger = targetDropdown === 'from' ? this.fromAccountSelect : this.toAccountSelect;
    await trigger.click();

    const option = this.page.getByRole('listbox').getByRole('option', { name: new RegExp(accountType, 'i') });

    await expect(option).toBeVisible();

    const optionText = await option.innerText();
    await option.click();
    return this.parseBalanceFromText(optionText);
  }

  /**
   * Safely parses monetary balances without mistaking text separator dashes (" - ") for negative signs
   */
  private parseBalanceFromText(text: string): number {
    if (text.includes('$')) {
      const parts = text.split('$');
      const prefix = parts[0].trim(); // Text before $ (e.g. "Everyday Checking -")
      const amountStr = parts[1]; // Text after $ (e.g. "12,800.00")

      // Check if prefix indicates a true negative balance (e.g. "Checking - -" or "Checking -$")
      const isNegative =
        prefix.endsWith('- -') ||
        prefix.endsWith('--') ||
        (prefix.endsWith('-') && !prefix.includes(' -'));

      const numericPart = amountStr.match(/^[\d,]+(\.\d{2})?/)?.[0] || '0';
      const amount = parseFloat(numericPart.replace(/,/g, ''));
      return isNegative ? -amount : amount;
    }

    // Fallback if no '$' sign exists
    const cleanStr = text.replace(/[^0-9.-]+/g, '');
    return parseFloat(cleanStr) || 0;
  }

  // --- VERIFICATIONS ---

    /**
   *  Asserts that the transfer form loads with all required inputs
   */
  async verifyTransferFormIsLoaded(): Promise<void> {
    await expect(this.transferForm).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.toAccountSelect).toBeVisible();
    await expect(this.amountInput).toBeVisible();
  }

    /**
   * Asserts 'Insufficient funds' error appears at top of form
   */
async verifyInsufficientFundsErrorIsDisplayed(expectedError: string | RegExp): Promise<void> {
  await expect(this.insufficientFundsError).toBeVisible();
  await expect(this.insufficientFundsError).toContainText(expectedError);
}

  async verifyTransferIsSuccessful(
    expectedMessage: string | RegExp = 'Transfer Successful'): Promise<void> {
    await expect(this.successBanner).toBeVisible();
    await expect(this.successBanner).toContainText(expectedMessage);
  }

    /**
   * Captures Transfer Money screen visual baseline
   */
  async verifyTransferPageVisuals() {
    await expect(this.transferPage).toHaveScreenshot('transfer-money-page.png', { maxDiffPixelRatio: 0.015 });
  }
}
