import { defineConfig, devices } from '@playwright/test';
import os from 'os';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['list', { printSteps: true }],
    ['html', { open: 'never' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: "allure-results",
      suiteTitle: true,
environmentInfo: {
        // Custom metadata parameters
        'environment': 'QA',
        'app_URL': 'https://qaplayground.com/bank',
        
        // System metadata
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
      },
    }],
    ['line'],
  ],
  use: {
    baseURL: 'https://qaplayground.com',
    headless: !!process.env.CI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1. Setup project runs first and builds state files for all roles
    { 
      name: 'setup', 
      testMatch: /.*\.setup\.ts/ 
    },

    // 2. Main test suite runner
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 💡 No default storageState here! 
        // Leaves default tests unauthenticated (perfect for login.spec.ts).
      },
      dependencies: ['setup'],
    },
  ],
});