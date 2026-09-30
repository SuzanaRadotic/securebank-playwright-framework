import { commonErrors } from '../data/error-messages';
import { test } from '../fixtures/page-fixtures';

test.describe('Transfer Money - Internal Transfers', { tag: ['@smoke', '@p1'] }, () => {

  test.use({ storageState: 'playwright/.auth/standard.json' });

  test.beforeEach(async ({ transferPage }) => {
    await transferPage.navigateTo();
    await transferPage.navigateTo();
  });

  test('TC-XFER-001: Internal Transfer form, with From/To dropdowns, should load successfully', async ({ transferPage }) => {
    await transferPage.verifyTransferFormIsLoaded();
  });

  test('TC-XFER-003: Internal Transfer form should display error message when transfer amount exceeds available balance', async ({ transferPage }) => {
    await transferPage.fillTransferForm('Checking', 'Savings', '5000');
    await transferPage.clickReviewTransferButton();
    await transferPage.clickConfirmTransferButton();
    await transferPage.verifyInsufficientFundsErrorIsDisplayed(commonErrors.insufficientFunds);
  });

  test('TC-XFER-004: Successful internal transfer should show confirmation page', async ({ transferPage }) => {
    await transferPage.fillTransferForm('Checking', 'Savings', '50.00');
    await transferPage.clickReviewTransferButton();
    await transferPage.clickConfirmTransferButton();
    await transferPage.verifyTransferIsSuccessful();
  });

  test('TC-XFER-006: Account balances should update immediately after successful transfer', async ({ transferPage, sidebar, accountsPage }) => {
    const transferAmount = 10;
    const checkingStartBalance = await transferPage.selectAccountAndGetBalance('Checking', 'from');
    const savingsStartBalance = await transferPage.selectAccountAndGetBalance('Savings', 'to');

    await transferPage.fillAmount(transferAmount);
    await transferPage.clickReviewTransferButton();
    await transferPage.clickConfirmTransferButton();
    await transferPage.verifyTransferIsSuccessful();

    await sidebar.navigateToAccountsPage();
    await accountsPage.verifyTransferBalancesAreUpdated('checking', checkingStartBalance, 'savings', savingsStartBalance, transferAmount);
  });
});