import { test } from '../fixtures/page-fixtures';
import { roles } from '../data/users';
import { commonErrors, loginErrors } from '../data/error-messages';

test.describe('Bank Login - User Specific Behaviors', { tag: ['@smoke', '@p1'] }, () => {
 
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });

  test('Standard user should successfully log in', async ({ loginPage, dashboardPage }) => {
    await loginPage.enterUserNameAndPassword(roles.standard.username, roles.standard.password);
    await dashboardPage.verifyDashboardIsDisplayed(roles.standard.displayName);
  });

  test('Locked user should see error displayed on the Login page', async ({ loginPage }) => {
    await loginPage.enterUserNameAndPassword(roles.locked.username, roles.locked.password);
    await loginPage.verifyErrorMessageIsDisplayed(loginErrors.lockedAccount);
  });

  test('Frozen user should see Account frozen warning banner on dashboard @frozen', async ({ loginPage, dashboardPage }) => {
    await loginPage.enterUserNameAndPassword(roles.frozen.username, roles.frozen.password);
    await dashboardPage.verifyFrozenBannerIsDisplayed(commonErrors.frozenAccount);
  });

  test('Slow user should successfully log in', async ({ loginPage, dashboardPage }) => {
    await loginPage.enterUserNameAndPassword(roles.slow.username, roles.slow.password);
    await dashboardPage.verifyDashboardIsDisplayed(roles.slow.displayName);
  });

  test('Admin user should successfully log in', async ({ loginPage, dashboardPage }) => {
    await loginPage.enterUserNameAndPassword(roles.admin.username, roles.admin.password);
    await dashboardPage.verifyDashboardIsDisplayed(roles.admin.displayName);
  });
});
