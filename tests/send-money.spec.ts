import { test } from '../fixtures/page-fixtures';
import { sendMoneyData } from '../data/send-money-data';
import { commonErrors, sendMoneyErrors } from '../data/error-messages';

test.describe('Send Money - Standard Account', () => {
 
  test.use({ storageState: 'playwright/.auth/standard.json' });

  test.beforeEach(async ({ sendMoneyPage }) => {
    await sendMoneyPage.navigateTo();
  });

  test('TC-SEND-001: Send Money form, with payee options, should load successfully', { tag: ['@smoke', '@p1'] }, async ({ sendMoneyPage }) => {
    await sendMoneyPage.verifySendMoneyFormIsLoaded();
  });

  test('TC-SEND-002A: Validation error should appear for invalid routing number', { tag: ['@p2'] }, async ({ sendMoneyPage }) => {
    const { name, bankName, routingNumber, accountNumber } = sendMoneyData.payees.invalidRoutingPayee;

    await sendMoneyPage.openAddNewPayeeForm();
    await sendMoneyPage.fillAddNewPayeeForm(name, bankName, routingNumber, accountNumber);
    await sendMoneyPage.clickAddPayeeSubmitButton();
    await sendMoneyPage.verifyRoutingNumberErrorIsDisplayed(sendMoneyErrors.invalidRoutingNumber);
  });

  test('TC-SEND-002B: Validation error should appear for invalid account number', { tag: ['@p2'] }, async ({ sendMoneyPage }) => {
    const { name, bankName, routingNumber, accountNumber } = sendMoneyData.payees.invalidAccountPayee;

    await sendMoneyPage.openAddNewPayeeForm();
    await sendMoneyPage.fillAddNewPayeeForm(name, bankName, routingNumber, accountNumber);
    await sendMoneyPage.clickAddPayeeSubmitButton();
    await sendMoneyPage.verifyAccountNumberErrorIsDisplayed(sendMoneyErrors.invalidAccountNumber);
  });

  test('TC-SEND-003: Successful money transfer should show confirmation page', { tag: ['@smoke', '@p1'] }, async ({ sendMoneyPage }) => {
    await sendMoneyPage.fillSendMoneyForm(sendMoneyData.accounts.checking, sendMoneyData.payees.defaultPayee, sendMoneyData.amounts.validTransfer);
    await sendMoneyPage.clickReviewAndSendButton();
    await sendMoneyPage.clickConfirmAndSendButton();
    await sendMoneyPage.verifySendMoneyIsSuccessful();
  });

  test('TC-SEND-004: New payee should be saved for future transactions', { tag: ['@p2'] }, async ({ sendMoneyPage }) => {
    const uniquePayeeName = `Payee_${Date.now()}`;
    const { bankName, routingNumber, accountNumber } = sendMoneyData.payees.validNewPayee;

    await sendMoneyPage.openAddNewPayeeForm();
    await sendMoneyPage.fillAddNewPayeeForm(uniquePayeeName, bankName, routingNumber, accountNumber);
    await sendMoneyPage.clickAddPayeeSubmitButton();
    await sendMoneyPage.verifyPayeeExistsInList(uniquePayeeName);
  });

  test('TC-SEND-005: Validation error should appear when amount exceeds balance', { tag: ['@smoke', '@p1'] }, async ({ sendMoneyPage }) => {
    await sendMoneyPage.fillSendMoneyForm(sendMoneyData.accounts.checking, sendMoneyData.payees.defaultPayee, sendMoneyData.amounts.exceedingBalance);
    await sendMoneyPage.clickReviewAndSendButton();
    await sendMoneyPage.clickConfirmAndSendButton();
    await sendMoneyPage.verifyInsufficientFundsErrorIsDisplayed(commonErrors.insufficientFunds);
  });
});


test.describe('Send Money - Frozen Account', () => {

  test.use({ storageState: 'playwright/.auth/frozen.json' });

  test('TC-SEND-006: Sending money should be disabled for frozen user', { tag: ['@smoke', '@p1', '@frozen'] }, async ({ sendMoneyPage }) => {
    await sendMoneyPage.navigateTo();

    await sendMoneyPage.verifyFormDisabledBannerIsDisplayed(sendMoneyErrors.sendingDisabled);
    await sendMoneyPage.verifyReviewAndSendButtonIsDisabled();
  });
});
