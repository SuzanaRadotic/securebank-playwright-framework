import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { roles } from '../data/users';
import { DashboardPage } from '../pages/DashboardPage';
import { commonErrors } from '../data/error-messages';
import path from 'path';
import fs from 'fs';


const authDir = 'playwright/.auth';

function ensureAuthDir() {
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
}

setup('authenticate as standard user', async ({ page }) => {
  ensureAuthDir();
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page)

  await loginPage.navigateTo();
  await loginPage.enterUserNameAndPassword(roles.standard.username, roles.standard.password);

  await expect(dashboardPage.welcomeHeading).toBeVisible();

  await page.context().storageState({ path: path.join(authDir, 'standard.json') });
});

setup('authenticate as frozen user', async ({ page }) => {
  ensureAuthDir();
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page)

  await loginPage.navigateTo();
  await loginPage.enterUserNameAndPassword(roles.frozen.username, roles.frozen.password);
  
  await dashboardPage.frozenAccountBanner.verifyIsDisplayed(commonErrors.frozenAccount);

  await page.context().storageState({ path: path.join(authDir, 'frozen.json') });
});