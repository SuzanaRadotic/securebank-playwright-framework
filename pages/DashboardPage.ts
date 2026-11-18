import { Page, Locator, expect } from '@playwright/test';
import { FrozenAccountBanner } from './components/FrozenAccountBanner';

export class DashboardPage {
  readonly page: Page;
  readonly frozenAccountBanner: FrozenAccountBanner;
  readonly welcomeHeading: Locator;
  readonly totalBalanceDisplay: Locator;
  readonly recentTransactionsWidget: Locator;
  readonly recentTransactionRows: Locator;
  readonly recentTransactionDates: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body headings and core widgets
    this.welcomeHeading = this.page.getByRole('heading', { name: /Welcome back/i });
    this.totalBalanceDisplay = this.page.getByTestId('stat-card-net-worth-value');
    this.recentTransactionsWidget = this.page.getByTestId('recent-transactions-table');
    this.recentTransactionRows = this.page.getByTestId('recent-txn-row');
    this.recentTransactionDates = this.page.getByTestId('recent-txn-date');

    // Auxiliary dashboard cards and alerts
    this.frozenAccountBanner = new FrozenAccountBanner(page);
  }

  /**
   * Navigates directly to the Dashboard page
   */
  async navigateTo(): Promise<void> {
    await this.page.goto('/bank/dashboard');
    await expect(this.welcomeHeading).toBeVisible();
  }

  /**
   * Verifies dashboard load and welcome text
   */
  async verifyDashboardIsDisplayed(expectedDisplayName?: string): Promise<void> {
    await expect(this.page).toHaveURL('/bank/dashboard');
    await expect(this.welcomeHeading).toBeVisible();

    if (expectedDisplayName) {
      await expect(this.welcomeHeading).toContainText(`Welcome back, ${expectedDisplayName}`);
    }
  }

  /**
   * Verifies total balance display matches expected numeric value
   */
  async verifyTotalBalanceMatches(expectedAmount: number): Promise<void> {
    await expect(this.totalBalanceDisplay).toBeVisible();

    const expectedFormattedSum = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(expectedAmount);

    await expect(this.totalBalanceDisplay).toHaveText(expectedFormattedSum);
  }

  /**
   * Asserts the Recent Transactions widget container is visible
   */
  async verifyRecentTransactionsWidgetIsDisplayed(): Promise<void> {
    await expect(this.recentTransactionsWidget).toBeVisible();
  }

  /**
   * Asserts the recent transactions count is between 1 and maxLimit
   */
  async verifyRecentTransactionsCount(maxLimit: number): Promise<void> {
    const rowCount = await this.recentTransactionRows.count();
    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(maxLimit);
  }

  /**
   * Asserts transactions are sorted by date descending
   */
  async verifyRecentTransactionsSortedByDateDescending(): Promise<void> {
    const dateTexts = await this.recentTransactionDates.allInnerTexts();
    expect(dateTexts.length).toBeGreaterThan(0);

    const timestamps = dateTexts.map((dateStr) => new Date(dateStr).getTime());
    expect(timestamps.every(Number.isFinite)).toBe(true);

    for (let i = 0; i < timestamps.length - 1; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i + 1]);
    }
  }

  /**
   * Verifies account frozen banner text
   */
  async verifyFrozenBannerIsDisplayed(expectedText: string): Promise<void> {
    await expect(this.page).toHaveURL('/bank/dashboard');
    await this.frozenAccountBanner.verifyIsDisplayed(expectedText);
  }
}
