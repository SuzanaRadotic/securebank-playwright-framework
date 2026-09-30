import { test } from '../fixtures/page-fixtures';

test.describe('Global Layout - Navigation & Header Features', () => {

  test.use({ storageState: 'playwright/.auth/standard.json' });

  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.navigateTo();
  });

  test('TC-NAV-001: Clicking Transfer link should navigate to /bank/transfer', async ({ sidebar }) => {
    await sidebar.navigateToTransferPage();
    await sidebar.verifyTransferPageIsDisplayed();
  });

  test('TC-NAV-002: Clicking Pay Bill link should navigate to /bank/bill-pay', async ({ sidebar }) => {
    await sidebar.navigateToBillPayPage();
    await sidebar.verifyBillPayPageIsDisplayed();
  });

  test('TC-NAV-003: Clicking the moon/sun icon should toggle dark mode', async ({ navbar }) => {
    await navbar.clickThemeToggleButton();
    await navbar.verifyDarkModeState(true);

    await navbar.clickThemeToggleButton();
    await navbar.verifyDarkModeState(false);
  });

  test('TC-NAV-004: Clicking Logout button should redirect user back to Login page', async ({ navbar }) => {
    await navbar.logout();
    await navbar.verifyLoginPageIsDisplayed();
  });
});