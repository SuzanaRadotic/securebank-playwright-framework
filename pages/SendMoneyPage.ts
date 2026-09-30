import { Page, Locator, expect } from '@playwright/test';

export class SendMoneyPage {
  readonly page: Page;

  // Main form locators
  readonly sendMoneyPage: Locator;
  readonly sendMoneyForm: Locator;
  readonly fromAccountSelect: Locator;
  readonly payeeSelect: Locator;
  readonly addPayeeButton: Locator;
  readonly payeeSelectedSummary: Locator;

  // Main form inputs
  readonly amountInput: Locator;
  readonly noteInput: Locator;

  // Add New Payee dialog locators
  readonly addPayeeDialog: Locator;
  readonly payeeNameInput: Locator;
  readonly payeeBankInput: Locator;
  readonly payeeRoutingInput: Locator;
  readonly payeeAccountInput: Locator;
  readonly addPayeeSubmitButton: Locator;

  // Action buttons and dialogs
  readonly reviewAndSendButton: Locator;
  readonly confirmDialog: Locator;
  readonly confirmSendButton: Locator;

  // Validation error and banner locators
  readonly addPayeeErrorMessage: Locator;
  readonly insufficientFundsError: Locator;
  readonly formDisabledBanner: Locator;
  readonly successBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sendMoneyPage = this.page.getByTestId('bank-main-content');

    // Main form locators
    this.sendMoneyForm = this.page.getByTestId('send-money-form');
    this.fromAccountSelect = this.page.getByTestId('send-from-account-select');
    this.payeeSelect = this.page.getByTestId('payee-select');
    this.addPayeeButton = this.page.getByTestId('add-payee-btn');
    this.payeeSelectedSummary = this.page.getByTestId('payee-selected-summary');

    // Inputs
    this.amountInput = this.page.getByTestId('send-amount-input');
    this.noteInput = this.page.getByTestId('send-note-input');

    // Add New Payee dialog locators 
    this.addPayeeDialog = this.page.getByTestId('add-payee-dialog');
    this.payeeNameInput = this.addPayeeDialog.getByTestId('add-payee-name-input');
    this.payeeBankInput = this.addPayeeDialog.getByTestId('add-payee-bank-input');
    this.payeeRoutingInput = this.addPayeeDialog.getByTestId('add-payee-routing-input');
    this.payeeAccountInput = this.addPayeeDialog.getByTestId('add-payee-account-input');
    this.addPayeeSubmitButton = this.addPayeeDialog.getByTestId('save-add-payee-btn');

    // Confirmation dialog modal
    this.reviewAndSendButton = this.page.getByTestId('review-send-btn');
    this.confirmDialog = this.page.getByTestId('send-money-confirm-dialog');
    this.confirmSendButton = this.confirmDialog.getByTestId('confirm-send-btn');

    // Banners and validation messages
    this.addPayeeErrorMessage = this.addPayeeDialog.getByTestId('add-payee-error-message');
    this.insufficientFundsError = this.page.getByTestId('send-money-error');
    this.formDisabledBanner = this.page.getByTestId('send-money-frozen-banner');
    this.successBanner = this.page.getByTestId('send-success-heading');
  }

  /**
   * Navigates directly to the Send Money page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/bank/send-money');
  }


  // --- ACTIONS ---

  /**
   * Selects an account from the 'From Account' dropdown
   */
  async selectFromAccount(accountNameOrId: string): Promise<void> {
    await this.fromAccountSelect.click();
    const option = this.page.getByRole('option', { name: new RegExp(accountNameOrId, 'i') });
    await expect(option).toBeVisible();
    await option.click();
  }

  /**
   * Selects an existing payee from the Payee dropdown
   */
  async selectPayee(payeeName: string): Promise<void> {
    await this.payeeSelect.click();
    const option = this.page.getByRole('option', { name: new RegExp(payeeName, 'i') });
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
   * Fills in the optional note input
   */
  async fillNote(note: string): Promise<void> {
    await this.noteInput.fill(note);
  }

  /**
   * Fills in the main Send Money form (From Account, Payee, Amount, and optional Note)
   */
  async fillSendMoneyForm(fromAccount: string, payeeName: string, amount: string | number, note?: string): Promise<void> {
    await this.selectFromAccount(fromAccount);
    await this.selectPayee(payeeName);
    await this.fillAmount(amount);
    if (note) {
      await this.fillNote(note);
    }
  }

  /**
   * Clicks the '+ Add' button and waits for the dialog to be visible.
   */
  async openAddNewPayeeForm() {
    await this.addPayeeButton.click();
    await expect(this.addPayeeDialog).toBeVisible(); 
  }

  /**
   * Fills in all input fields inside the 'Add New Payee' dialog
   */
  async fillAddNewPayeeForm(name: string, bankName: string, routingNumber: string, accountNumber: string): Promise<void> {
    await this.payeeNameInput.fill(name);
    await this.payeeBankInput.fill(bankName);
    await this.payeeRoutingInput.fill(routingNumber);
    await this.payeeAccountInput.fill(accountNumber);
  }

  /**
   * Clicks 'Review & Send' and waits for the confirmation dialog to open
   */
  async clickReviewAndSendButton(): Promise<void> {
    await expect(this.reviewAndSendButton).toBeEnabled();
    await this.reviewAndSendButton.click();
    await expect(this.confirmDialog).toBeVisible();
  }

    /**
   * Clicks the 'Add Payee' submit button inside the dialog
   */
  async clickAddPayeeSubmitButton(): Promise<void> {
    await expect(this.addPayeeSubmitButton).toBeEnabled();
    await this.addPayeeSubmitButton.click();
  }

  /**
   * Clicks 'Confirm & Send' inside the dialog and waits for dialog to close
   */
  async clickConfirmAndSendButton(): Promise<void> {
    await expect(this.confirmDialog).toBeVisible();
    await expect(this.confirmSendButton).toBeVisible();
    await expect(this.confirmSendButton).toBeEnabled();

    await this.confirmSendButton.click();
    await expect(this.confirmDialog).toBeHidden();
  }

   // --- VERIFICATIONS ---

  /**
   * Asserts form container and core dropdowns are loaded
   */
  async verifySendMoneyFormIsLoaded(): Promise<void> {
    await expect(this.sendMoneyForm).toBeVisible();
    await expect(this.fromAccountSelect).toBeVisible();
    await expect(this.payeeSelect).toBeVisible();
    await expect(this.addPayeeButton).toBeVisible();
  }

  /**
   * Asserts routing number validation error inside Add Payee modal
   */
  async verifyRoutingNumberErrorIsDisplayed(expectedError: string | RegExp) {
    await expect(this.addPayeeErrorMessage).toBeVisible();
    await expect(this.addPayeeErrorMessage).toContainText(expectedError);
  }

  /**
   * Asserts account number validation error inside Add Payee modal
   */
  async verifyAccountNumberErrorIsDisplayed(expectedError: string | RegExp) {
    await expect(this.addPayeeErrorMessage).toBeVisible();
    await expect(this.addPayeeErrorMessage).toContainText(expectedError);
  }

  /**
   * Asserts successful send money confirmation message
   */
  async verifySendMoneyIsSuccessful(expectedMessage: string | RegExp = 'Money Sent Successfully'): Promise<void> {
    await expect(this.successBanner).toBeVisible();
    await expect(this.successBanner).toContainText(expectedMessage);
  }

  /**
     * Asserts 'Insufficient funds' error message and available balance details.
     */
  async verifyInsufficientFundsErrorIsDisplayed(expectedError: string | RegExp): Promise<void> {
    await expect(this.insufficientFundsError).toBeVisible();
    await expect(this.insufficientFundsError).toContainText(expectedError);
  }

  /**
   * Asserts 'Sending money is disabled' banner for frozen accounts
   */
  async verifyFormDisabledBannerIsDisplayed(expectedMessage: string | RegExp): Promise<void> {
    await expect(this.formDisabledBanner).toBeVisible();
    await expect(this.formDisabledBanner).toContainText(expectedMessage);
  }

  /**
   * Asserts 'Review & Send' button is disabled
   */
  async verifyReviewAndSendButtonIsDisabled(): Promise<void> {
    await expect(this.reviewAndSendButton).toBeDisabled();
  }

  /**
   * Verifies that a payee name is present in the Payee dropdown options
   */
  async verifyPayeeExistsInList(payeeName: string): Promise<void> {
    await this.payeeSelect.click();
    const option = this.page.getByRole('option', { name: new RegExp(payeeName, 'i') });
    await expect(option).toBeVisible();
    await this.page.keyboard.press('Escape');
  }

 /**
   * Captures Send Money screen visual baseline
   */
  async verifySendMoneyPageVisuals() {
    await expect(this.sendMoneyPage).toHaveScreenshot('send-money-page.png');
  }

   /**
   * Captures And New Payee dialog visual baseline
   */
  async verifyAddNewPayeeFormVisuals() {
    await expect(this.addPayeeDialog).toHaveScreenshot('add-payee-dialog.png', { maxDiffPixelRatio: 0.02 });
  }
}