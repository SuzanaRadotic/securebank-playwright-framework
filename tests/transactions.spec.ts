import { transactionsErrors } from '../data/error-messages';
import { test } from '../fixtures/page-fixtures';

test.describe('Transactions Screen Tests', () => {
  test.use({ storageState: 'playwright/.auth/standard.json' });

  test.beforeEach(async ({ transactionsPage }) => {
    await transactionsPage.navigateTo();
  });

  test('TC-TXN-001: Transactions page should load and display recent activity', { tag: ['@smoke', '@p1'] }, async ({ transactionsPage }) => {
    await transactionsPage.verifyTransactionsTableIsLoaded();
  });

  test('TC-TXN-002: Filtering by account should show transactions for that account only', { tag: ['@p2'] }, async ({ transactionsPage }) => {
    await transactionsPage.selectAccountFilter('Everyday Checking');
    await transactionsPage.verifyAllDisplayedTransactionsBelongToAccount('Everyday Checking');
  });

  test('TC-TXN-003: Searching for a term filters the transaction list correctly', { tag: ['@p2'] }, async ({ transactionsPage }) => {
    await transactionsPage.enterSearchTerm('Transfer');
    await transactionsPage.verifyAllDisplayedTransactionsContainTerm('Transfer');
  });

  test('TC-TXN-004: Clicking the Date column header should toggle sorting order', { tag: ['@p3'] }, async ({ transactionsPage }) => {
    await transactionsPage.clickDateColumnHeader();
    await transactionsPage.verifyTransactionsSortedByDate('asc');

    await transactionsPage.clickDateColumnHeader();
    await transactionsPage.verifyTransactionsSortedByDate('desc');
  });

  test('TC-TXN-005: Pagination controls correctly navigate through transaction pages', { tag: ['@p2'] }, async ({ transactionsPage }) => {
    await transactionsPage.clickNextPageButton();
    await transactionsPage.verifyActivePageNumber(2);
  });

  test('TC-TXN-006: No transactions message should appear when filters return no results', { tag: ['@p3'] }, async ({ transactionsPage }) => {
    await transactionsPage.enterSearchTerm('XYZ123NonExistent');
    await transactionsPage.verifyEmptyStateMessageIsDisplayed(transactionsErrors.noMatchingResults);
  });
});