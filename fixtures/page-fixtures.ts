import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AccountsPage } from '../pages/AccountsPage';
import { TransferPage } from '../pages/TransferPage';
import { SendMoneyPage } from '../pages/SendMoneyPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { Navbar } from '../pages/components/Navbar';
import { Sidebar } from '../pages/components/Sidebar';


// 1. Declare fixture types
type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  accountsPage: AccountsPage;
  transferPage: TransferPage;
  sendMoneyPage: SendMoneyPage;
  transactionsPage: TransactionsPage;
  navbar: Navbar;
  sidebar: Sidebar;
};

// 2. Extend base test with custom page fixtures
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  accountsPage: async ({ page }, use) => {
    await use(new AccountsPage(page));
  },
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },
  sendMoneyPage: async ({ page }, use) => {
    await use(new SendMoneyPage(page));
  },
  transactionsPage: async ({ page }, use) => {
    await use(new TransactionsPage(page));
  },
  navbar: async ({ page }, use) => {
    await use(new Navbar(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new Sidebar(page));
  },
});

export { expect } from '@playwright/test';