

# 🏦 SecureBank Automation

A scalable UI automation framework for the [QA Playground Bank](https://qaplayground.com/bank/login) web application, built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 📌 Key Features & Coverage

* **Authentication & Security:** Login and role-based authentication flows.
* **Dashboard & Accounts:** Balance validation and dashboard widgets.
* **Transactions:** Transfer, send-money flows, search, and filtering.
* **Network Interception & Mocking:** API error handling (e.g., HTTP 500 scenarios) and network stubbing.
* **UI & Visual Testing:** Cross-page navigation checks and visual regression coverage.

---

## 🛠 Tech Stack

* **Framework:** Playwright Test
* **Language:** TypeScript
* **Design Pattern:** Page Object Model (POM) & Custom Fixtures
* **Reporting:** Allure Report + Native Playwright HTML Reporter
* **Code Quality:** ESLint + Prettier

---

## ⚙️ Prerequisites

* **Node.js:** 18.x or higher
* **npm:** 9.x or higher

---

## 🚀 Setup & Installation

1. Install dependencies:
`npm install`
2. Install Playwright browser binaries:
`npx playwright install`

---

## 🧪 Running Tests

* **Run full test suite:**
`npm test`
* **Run smoke tests:**
`npm run test:smoke`
* **Run a single spec file:**
`npx playwright test tests/transactions.spec.ts`
* **Run tests in headed browser mode:**
`npx playwright test --headed`

---

## 🔐 Authentication & Session Management

The test suite uses Playwright Setup Projects to log in once during initial setup and save the storage state under `.auth/user.json`. Subsequent test specs reuse this state to bypass repetitive UI login steps.

---

## 📁 Project Structure

```
SecureBank/
├── .auth/                 # Saved browser authentication state
├── data/                  # Test data
├── fixtures/              # Custom Playwright test fixtures
├── pages/                 # Page Object Model (POM) classes
├── tests/                 # Test spec files
├── utils/                 # Helper utilities (mockUtils.ts, network interceptors)
├── allure-results/        # Raw Allure test result artifacts
├── playwright-report/     # Playwright HTML report output
├── playwright.config.ts   # Global Playwright configuration
├── package.json
├── tsconfig.json
└── README.md

```

---

## 📊 Available Scripts

* `npm test` — Full test suite
* `npm run test:smoke` — Smoke tests only
* `npm run lint` — ESLint code quality check
* `npm run allure:generate` — Generate Allure report
