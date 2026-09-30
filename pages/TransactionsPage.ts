import { expect, type Locator, type Page } from '@playwright/test';

export class TransactionsPage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly transactionsTable: Locator;
  readonly tableHeaders: Locator;
  readonly transactionRows: Locator;
  readonly accountFilterSelect: Locator;
  readonly searchInput: Locator;
  readonly dateHeaderButton: Locator;
  readonly paginationControls: Locator;
  readonly emptyStateMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.getByTestId('bank-main-content');
    
    // Locators
    this.transactionsTable = page.getByTestId('all-transactions-table');
    this.tableHeaders = page.locator('[data-testid="all-transactions-table"] thead th');
    this.transactionRows = page.getByTestId('all-txn-row');
    this.accountFilterSelect = page.getByTestId('all-txn-account-select');
    this.searchInput = page.getByTestId('all-txn-search-input');
    this.dateHeaderButton = page.getByRole('columnheader', { name: /date/i });
    this.paginationControls = page.getByTestId('all-txn-pagination-controls');
    this.emptyStateMessage = page.getByTestId('no-all-transactions-message');
  }

  async navigateTo() {
    await this.page.goto('https://qaplayground.com/bank/transactions');
    await expect(this.transactionsTable).toBeVisible();
  }

  // --- ACTIONS ---

  async selectAccountFilter(accountName: string) {
    await this.accountFilterSelect.click();
    await this.page.getByRole('option', { name: new RegExp(accountName, 'i') }).click();
  }

  async enterSearchTerm(term: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
  }

  async clickDateColumnHeader() {
    const initialFirstDate = (await this.transactionRows.first().locator('td').nth(0).innerText()).trim();
    await this.dateHeaderButton.click();
    // Wait for DOM re-render
    await expect(this.transactionRows.first().locator('td').nth(0)).not.toHaveText(initialFirstDate);
  }

  async clickNextPageButton() {
    await expect(this.paginationControls).toBeVisible();
    const nextButton = this.paginationControls.getByTestId('all-txn-pagination-next');
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
  }

  // --- VERIFICATIONS ---

  async verifyTransactionsTableIsLoaded() {
    await expect(this.transactionsTable).toBeVisible();
    await expect(this.tableHeaders).toHaveText([/date/i, /account/i, /description/i, /category/i, /amount/i]);
  }

  async verifyAllDisplayedTransactionsBelongToAccount(accountName: string) {
    const count = await this.transactionRows.count();
    expect(count).toBeGreaterThan(0);

    const accounts = await this.getColumnValues(1); // Column 1 = Account
    for (const acc of accounts) {
      expect(acc.toLowerCase()).toContain(accountName.toLowerCase());
    }
  }

  async verifyAllDisplayedTransactionsContainTerm(term: string) {
    await expect(this.transactionRows.first()).toBeVisible();

    const descriptions = await this.getColumnValues(2); // Column 2 = Description
    const categories = await this.getColumnValues(3);   // Column 3 = Category
    
    expect(descriptions.length).toBeGreaterThan(0);

    for (let i = 0; i < descriptions.length; i++) {
      const matchesDescription = descriptions[i].toLowerCase().includes(term.toLowerCase());
      const matchesCategory = categories[i].toLowerCase().includes(term.toLowerCase());
      expect(matchesDescription || matchesCategory).toBe(true);
    }
  }

  async verifyTransactionsSortedByDate(expectedOrder: 'asc' | 'desc') {
    const dates = await this.getColumnValues(0); // Column 0 = Date
    const expectedSorted = [...dates].sort((a, b) => {
      const timeA = new Date(a).getTime();
      const timeB = new Date(b).getTime();
      return expectedOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    expect(dates).toEqual(expectedSorted);
  }

  async verifyPaginationTextIsDisplayed(pageText: string) {
    await expect(this.paginationControls).toContainText(pageText);
  }

 async verifyActivePageNumber(expectedPageNumber: number) {
  const pageButton = this.paginationControls.getByRole('button', { name: String(expectedPageNumber) });
  // Verify standard ARIA attribute for current/active page
  await expect(pageButton).toHaveAttribute('aria-current', 'page');
}

async verifyEmptyStateMessageIsDisplayed(expectedMessage: string | RegExp): Promise<void> {
  // 1. Verify 0 rows are displayed in the table
  await expect(this.transactionRows).toHaveCount(0);

  // 2. Verify empty state element is visible and displays the expected text
  await expect(this.emptyStateMessage).toBeVisible();
  await expect(this.emptyStateMessage).toHaveText(expectedMessage);
}

  private async getColumnValues(columnIndex: number): Promise<string[]> {
    const count = await this.transactionRows.count();
    const values: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.transactionRows.nth(i).locator('td').nth(columnIndex).innerText();
      values.push(text.trim());
    }
    return values;
  }


}