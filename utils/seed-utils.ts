import { Page } from '@playwright/test';

/** localStorage key under which the app persists its whole state. */
const APP_STORAGE_KEY = 'bank-app-v4';

/**
 * Makes the app start with zero accounts for the given user.
 * Call before the first navigation to the application.
 */
export async function seedUserWithNoAccounts(page: Page, username: string): Promise<void> {
  await page.addInitScript(
    ({ key, user }) => {
      const raw = window.localStorage.getItem(key);
      if (!raw) {
        throw new Error(`Local storage key "${key}" was not found.`);
      }

      const persisted = JSON.parse(raw);

      if (!persisted.state?.accounts || !(user in persisted.state.accounts)) {
        throw new Error(`Accounts data for user "${user}" was not found.`);
      }

      persisted.state.accounts[user] = [];
      window.localStorage.setItem(key, JSON.stringify(persisted));
    },
    { key: APP_STORAGE_KEY, user: username },
  );
}
