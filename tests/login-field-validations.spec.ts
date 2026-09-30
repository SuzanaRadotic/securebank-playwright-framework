import { loginErrors } from '../data/error-messages';
import { test } from '../fixtures/page-fixtures';

test.describe('Bank Login - Unsuccessful Login & Error Validations', { tag: ['@smoke', '@p1'] }, () => {
  
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateTo();
  });

  test('Validation error "Please enter your username." should appear when username is empty', async ({ loginPage }) => {
    await loginPage.enterUserNameAndPassword('', 'somePassword123');
    await loginPage.verifyErrorMessageIsDisplayed(loginErrors.requiredUsername);
  });

  test('Validation error "Please enter your password." should appear when password is empty', async ({ loginPage }) => {
    await loginPage.enterUserNameAndPassword('standard_user', '');
    await loginPage.verifyErrorMessageIsDisplayed(loginErrors.requiredPassword);
  });

  test('Validation error should appear when both fields are empty', async ({ loginPage }) => {
    await loginPage.enterUserNameAndPassword('', '');
    await loginPage.verifyErrorMessageIsDisplayed(loginErrors.requiredUsername);
  });

  test('Validation error should appear for invalid credentials', async ({ loginPage }) => {
    await loginPage.enterUserNameAndPassword('invalid_user', 'wrong_password');
    await loginPage.verifyErrorMessageIsDisplayed(loginErrors.invalidCredentials);
  });
});