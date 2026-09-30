import { test } from '../fixtures/page-fixtures';
import { roles } from '../data/users';
import { accountsErrors, commonErrors } from '../data/error-messages';
import { mockServerError } from '../utils/mock-utils';

test.describe('Accounts Screen - Account Management', () => {

  test.describe('Standard User', () => {
    
    test.use({ storageState: 'playwright/.auth/standard.json' });

    test.beforeEach(async ({ accountsPage }) => {
      await accountsPage.navigateTo();
    });

    test('TC-ACC-001: Accounts page should load and display users accounts', { tag: ['@smoke', '@p1'] }, async ({ accountsPage }) => {
      await accountsPage.verifyAccountsListIsLoaded();
    });

    test('TC-ACC-002: Accounts list should display details - name, type, and masked account number', { tag: ['@smoke', '@p1'] }, async ({ accountsPage }) => {
      await accountsPage.verifyAccountDetailsAreDisplayed();
    });

    test('TC-ACC-006: User should successfully add a new savings account', { tag: ['@p2'] }, async ({ accountsPage }) => {
      const newAccountName = `Holiday Savings ${Date.now().toString().slice(-4)}`;
      await accountsPage.createNewAccount(newAccountName, 'Savings', '500.00');
      await accountsPage.verifyAccountExistsByName(newAccountName);
    });
  });

  
  test.describe('Frozen User', () => {
    
    test.use({ storageState: 'playwright/.auth/frozen.json' });

    test('TC-ACC-004: Frozen Account Alert should be displayed for frozen user', { tag: ['@p2', '@frozen'] }, async ({ accountsPage }) => {
      await accountsPage.navigateTo();
      await accountsPage.verifyFrozenBannerIsDisplayed(commonErrors.frozenAccount);
    });
  });

 
  test.describe('Overdraft User', () => {
   
    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC-ACC-003: Accounts with negative balance should show an overdraft banner or indicator', { tag: ['@p2', '@overdraft'] }, async ({ loginPage, accountsPage, sidebar }) => {
      await loginPage.navigateTo();
      await loginPage.enterUserNameAndPassword(roles.overdraft.username, roles.overdraft.password);

      await sidebar.navigateToAccountsPage();
      await accountsPage.verifyOverdraftWarningIsDisplayed();
    });
  });
});

  test.describe('Accounts - Network Interception & Fallback', () => {
    test('TC-ACC-007: Fallback to empty state on HTTP 500 server error', async ({ page, accountsPage }) => {
      await mockServerError(page, '**/bank/accounts*');
      await accountsPage.navigateTo();
      await accountsPage.verifyEmptyStateMessageIsDisplayed(accountsErrors.noMatchingResults);
    });
  });