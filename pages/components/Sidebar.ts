import { Page, Locator, expect } from '@playwright/test';

export class Sidebar {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly accountsLink: Locator;
  readonly transferLink: Locator;
  readonly sendMoneyLink: Locator;
  readonly billPayLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.dashboardLink = this.page.getByTestId('sidebar-link-dashboard');
    this.accountsLink = this.page.getByTestId('sidebar-link-accounts');
    this.transferLink = this.page.getByTestId('sidebar-link-transfer');
    this.sendMoneyLink = this.page.getByTestId('sidebar-link-send-money');
    this.billPayLink = this.page.getByTestId('sidebar-link-bill-pay');
  }

  async navigateToDashboardPage(): Promise<void> {
    await this.dashboardLink.click();
  }

  async navigateToAccountsPage(): Promise<void> {
    await this.accountsLink.click();
  }

  async navigateToTransferPage(): Promise<void> {
    await this.transferLink.click();
  }

  async navigateToSendMoneyPage(): Promise<void> {
    await this.sendMoneyLink.click();
  }

  async navigateToBillPayPage(): Promise<void> {
    await this.billPayLink.click();
  }

  async verifyTransferPageIsDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL('/bank/transfer');
  }

  async verifyBillPayPageIsDisplayed(): Promise<void> {
    await expect(this.page).toHaveURL('/bank/bill-pay');
  }
}
