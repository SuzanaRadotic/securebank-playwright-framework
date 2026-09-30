import { Page, Locator, expect } from '@playwright/test';

export class AccountsPage {
  readonly page: Page;

  // Table and row locators
  readonly accountsTable: Locator;
  readonly accountRows: Locator;
  readonly accountBalanceCells: Locator;

  // Status indicators and banners
  readonly overdraftWarningIndicator: Locator;
  readonly frozenAccountBanner: Locator;
  readonly emptyStateMessage: Locator;

  // Account dialog locators
  readonly addAccountButton: Locator;
  readonly addAccountDialog: Locator;
  readonly accountNameInput: Locator;
  readonly accountTypeSelect: Locator;
  readonly startingBalanceInput: Locator;
  readonly acceptTermsCheckbox: Locator;
  readonly submitAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Table and row locators
    this.accountsTable = this.page.getByTestId('accounts-table');
    this.accountRows = this.accountsTable.getByTestId('account-row');
    this.accountBalanceCells = this.accountsTable.getByTestId('account-row-balance');

    // Status indicators and banners
    this.overdraftWarningIndicator = this.accountsTable.getByTestId('account-row-overdrawn');
    this.frozenAccountBanner = this.page.getByTestId('frozen-account-banner');
    this.emptyStateMessage = page.getByText('No accounts found.');
    

    // Dialog and form locators
    this.addAccountButton = this.page.getByTestId('add-account-btn');
    this.addAccountDialog = this.page.getByTestId('add-account-dialog');
    this.accountNameInput = this.page.getByTestId('account-form-name-input');
    this.accountTypeSelect = this.page.getByTestId('account-form-type-select');
    this.startingBalanceInput = this.page.locator('input[name="account_balance_field"]');
    this.acceptTermsCheckbox = this.page.getByTestId('account-form-accept-terms-checkbox');
    this.submitAccountButton = this.page.getByTestId('save-account-form-btn');
  }

  /**
   * Navigates directly to the Accounts page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/bank/accounts');
  }

  /**
   * Calculates the numerical sum of all account balances present in the table
   */
  async getSumOfAccountBalances(): Promise<number> {
    await expect(this.accountsTable).toBeVisible();
    await expect(this.accountBalanceCells.first()).toBeVisible();

    const balanceTexts = await this.accountBalanceCells.allInnerTexts();

    return balanceTexts.reduce((total, text) => {
      // Parses numerical value while stripping currency symbols and special characters
      const numericValue = parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
      return total + numericValue;
    }, 0);
  }

  /**
   * Helper method to locate a specific account row by type (checking, savings, credit)
   */
  getAccountRowByType(accountType: 'checking' | 'savings' | 'credit'): Locator {
    return this.accountsTable.locator(`[data-account-type="${accountType}"]`);
  }

  /**
   * Retrieves the current numeric balance for a specific account type on the Accounts page
   */
  async getAccountBalance(accountType: 'checking' | 'savings' | 'credit'): Promise<number> {
    const row = this.getAccountRowByType(accountType);
    await expect(row).toBeVisible();

    const balanceCell = row.getByTestId('account-row-balance');
    await expect(balanceCell).toBeVisible();

    const text = await balanceCell.innerText();
    return parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
  }

   /**
   * Clicks the 'Add Account' button and waits for the modal to be visible
   */
  async openAddAccountForm() {
    await this.addAccountButton.click();
    await expect(this.addAccountDialog).toBeVisible(); 
  }

  /**
   * Opens the dialog, populates account details, accepts terms, and submits the form
   */
  async createNewAccount(name: string, type: 'Checking' | 'Savings', startingBalance: string): Promise<void> {
    await this.openAddAccountForm();
    await this.accountNameInput.fill(name);

    await expect(this.accountTypeSelect).toBeEnabled();
    await this.accountTypeSelect.click();

    // Target the option specifically inside the floating listbox/popover overlay to avoid matching table badges
    const dropdownOption = this.page.getByRole('listbox').getByRole('option', { name: type });

    await expect(dropdownOption.first()).toBeVisible();
    await dropdownOption.first().click();

    await this.startingBalanceInput.fill(startingBalance);

    await this.acceptTermsCheckbox.click();

    await this.submitAccountButton.click();
    await expect(this.addAccountDialog).toBeHidden();
  }

  // --- VERIFICATIONS ---

  /**
   * Asserts that the accounts table loads successfully with at least one row
   */
  async verifyAccountsListIsLoaded(): Promise<void> {
    await expect(this.accountsTable).toBeVisible();
    await expect(this.accountRows.first()).toBeVisible();

    const rowCount = await this.accountRows.count();
    expect(rowCount).toBeGreaterThan(0);
  }

  /**
   * Verifies each account row displays account name, valid type badge, and masked account number
   */
  async verifyAccountDetailsAreDisplayed(): Promise<void> {
    await expect(this.accountsTable).toBeVisible();

    const rows = await this.accountRows.all();
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {  
      await expect(row.getByTestId('account-row-name')).toBeVisible();
      await expect(row.getByTestId('account-row-type-badge')).toBeVisible();
      await expect(row.getByText(/(\*|•){4}\d{4}/)).toBeVisible();
    }
  }

  /**
   * Asserts that a checking account with a negative balance displays the Overdrawn warning indicator
   */
  async verifyOverdraftWarningIsDisplayed(): Promise<void> {
    await expect(this.accountsTable).toBeVisible();

    // Target checking account row
    const checkingRow = this.accountsTable.locator('tr[data-account-type="checking"]').first();
    await expect(checkingRow).toBeVisible();

    // Extract balance and assert that the value is negative
    const balanceCell = checkingRow.getByTestId('account-row-balance');
    await expect(balanceCell).toBeVisible();

    const balanceText = await balanceCell.innerText();
    const numericBalance = parseFloat(balanceText.replace(/[^0-9.-]+/g, ''));

    expect(numericBalance).toBeLessThan(0);

    // Confirm 'Overdrawn' indicator is visible within that row
    const overdraftBadge = checkingRow.getByTestId('account-row-overdrawn');
    await expect(overdraftBadge).toBeVisible();
  }

  /**
   * Asserts that an account with a specific name exists in the table
   */
  async verifyAccountExistsByName(accountName: string): Promise<void> {
    await expect(this.accountsTable).toBeVisible();

    const newAccountRow = this.accountRows.filter({ has: this.page.getByTestId('account-row-name'), hasText: accountName });

    await expect(newAccountRow).toBeVisible();
  }

  /**
   * Verifies that the source account balance decreased by transferAmount
   * and the destination account balance increased by transferAmount.
   */
  async verifyTransferBalancesAreUpdated(
    fromAccountType: 'checking' | 'savings' | 'credit',
    fromStartBalance: number,
    toAccountType: 'checking' | 'savings' | 'credit',
    toStartBalance: number,
    transferAmount: number,
  ): Promise<void> {
    const fromEndBalance = await this.getAccountBalance(fromAccountType);
    const toEndBalance = await this.getAccountBalance(toAccountType);

    // Verify source account balance decreased
    expect(fromEndBalance).toBeCloseTo(fromStartBalance - transferAmount, 2);

    // Verify destination account balance increased
    expect(toEndBalance).toBeCloseTo(toStartBalance + transferAmount, 2);
  }

    /**
   * Asserts that the 'Account Frozen' banner is visible on the Accounts page
   */
  async verifyFrozenBannerIsDisplayed(expectedText?: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL('/bank/accounts');

    await expect(this.frozenAccountBanner).toBeVisible();

    if (expectedText) {
      await expect(this.frozenAccountBanner).toContainText(expectedText);
    } else {
      await expect(this.frozenAccountBanner).toContainText(/account frozen/i);
    }
  }

  async verifyEmptyStateMessageIsDisplayed(expectedMessage: string | RegExp): Promise<void> {
  // 1. Verify 0 rows are displayed in the table
  await expect(this.accountRows).toHaveCount(0);

  // 2. Verify empty state element is visible and displays the expected text
  await expect(this.emptyStateMessage).toBeVisible();
  await expect(this.emptyStateMessage).toHaveText(expectedMessage);
}

    /**
   * Captures And New Account dialog visual baseline
   */
    async verifyAddNewAccountFormVisuals() {
    await expect(this.addAccountDialog).toHaveScreenshot('add-new-account-dialog.png', { maxDiffPixelRatio: 0.02 });
  }
}
