import { test } from '../fixtures/page-fixtures';

test.describe('Forms - Visual Regression Tests @visual', () => {
  test.use({ storageState: 'playwright/.auth/standard.json' });

  test('TC-VIS-001: Verify Transfer Money form visual layout', async ({ transferPage }) => {
    await transferPage.navigateTo();
    await transferPage.verifyTransferPageVisuals();
  });

  test('TC-VIS-002: Verify Send Money form and Add Payee form visual layout', async ({ sendMoneyPage }) => {
    await sendMoneyPage.navigateTo();
    await sendMoneyPage.verifySendMoneyPageVisuals();

    await sendMoneyPage.openAddNewPayeeForm();
    await sendMoneyPage.verifyAddNewPayeeFormVisuals();
  });

  test('TC-VIS-003: Verify Add New Account form visual layout', async ({ accountsPage }) => {
    await accountsPage.navigateTo();
    await accountsPage.openAddAccountForm();
    await accountsPage.verifyAddNewAccountFormVisuals();
  });
});
