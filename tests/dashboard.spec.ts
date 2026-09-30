import { test } from '../fixtures/page-fixtures';
import { roles } from '../data/users';

test.describe('Bank Dashboard - Core Features', () => {

  test.use({ storageState: 'playwright/.auth/standard.json' });

  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateTo();
  });

  test('TC-DASH-001: Dashboard should load successfully', { tag: ['@smoke', '@p1'] }, async ({ dashboardPage }) => {
    await dashboardPage.verifyDashboardIsDisplayed(roles.standard.displayName);
  });

  test('TC-DASH-002: Total balance sum should match the individual account balances sum', { tag: ['@smoke', '@p1'] }, async ({ sidebar, accountsPage, dashboardPage }) => {
    await sidebar.navigateToAccountsPage();

    const expectedTotal = await accountsPage.getSumOfAccountBalances();
    await dashboardPage.navigateTo();
    await dashboardPage.verifyTotalBalanceMatches(expectedTotal);
  });

  test('TC-DASH-003: Recent transactions widget should display up to 5 latest transactions, sorted by date descending', { tag: ['@p2'] }, async ({ dashboardPage }) => {
    await dashboardPage.verifyRecentTransactionsWidgetIsDisplayed();
    await dashboardPage.verifyRecentTransactionsCount(5);
    await dashboardPage.verifyRecentTransactionsSortedByDateDescending();
  });
});
