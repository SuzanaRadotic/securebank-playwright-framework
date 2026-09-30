# SecureBank Automation

A scalable UI & Network Automation framework for the QA Playground Bank web application, built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)**.

## Key Features & Coverage
- Login and role-based authentication 
- Dashboard and account balance validation
- Transfer and send-money flows
- Transaction history, search, and filtering
- Network interception and API mocking (HTTP 500 error handling)
- Navigation and UI behavior
- Visual regression coverage

## Tech Stack
- **Framework:** Playwright Test
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM) & Custom Fixtures
- **Reporting:** Allure Report + Native HTML Reporter
- **Code Quality:** ESLint + Prettier

## Prerequisites
- **Node.js:** 18+
- **npm:** 9+

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browser binaries
npx playwright install

Running Tests

# Run full test suite
npm test

# Run smoke tests
npm run test:smoke

# Run a single spec file
npx playwright test tests/transactions.spec.ts

# Run tests in headed browser mode
npx playwright test --headed

Project Structure

SecureBank/
├── data/                 # Error message constants & regex patterns
├── fixtures/             # Custom Playwright test fixtures
├── pages/                # Page Object Model (POM) classes
├── tests/                # Test spec files
├── utils/                # Helper utilities (mockUtils.ts, network interceptors)
├── .auth/                # Saved browser authentication state
├── allure-results/       # Raw Allure test result artifacts
├── playwright-report/    # Playwright HTML report output
├── playwright.config.ts  # Global Playwright configuration
├── package.json
├── tsconfig.json
└── README.md

Authentication & Session Management
The suite uses Playwright setup project capabilities to log in once during initial setup and save the storage state under .auth/user.json. Subsequent test specs reuse this state to bypass repetitive UI login steps.

Reporting & Scripts
npm test — full test suite
npm run test:smoke — smoke tests only
npm run lint — ESLint code quality check
npm run allure:generate — generate Allure report
