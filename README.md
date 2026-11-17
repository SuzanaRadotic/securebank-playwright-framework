# 🏦 SecureBank Automation

A scalable UI automation framework for the [QA Playground Bank](https://qaplayground.com/bank/login) web application, built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** pattern.

---

## 📌 Key Features & Coverage

| Area           | Scenarios                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Authentication | Login for several user roles, field validations, invalid and locked credentials                         |
| Dashboard      | Welcome message, total balance vs. accounts, recent transactions                                        |
| Accounts       | Account list and details, overdraft indicator, add account, frozen-account banner, empty state          |
| Transfer       | Form load, successful transfer, insufficient funds, balances updated after transfer                     |
| Send Money     | Form load, payee validation (routing and account number), new payee, insufficient funds, frozen account |
| Transactions   | Table load, account filter, search, date sorting, pagination, empty state                               |
| Navigation     | Sidebar links, dark-mode toggle, logout                                                                 |
| Visual         | Screenshot comparison of the main forms and dialogs                                                     |

---

## 🛠 Tech Stack

- **Framework:** Playwright Test
- **Language:** TypeScript
- **Design Pattern:** Page Object Model (POM) with custom fixtures
- **Reporting:** Allure Report and native Playwright HTML reporter
- **Code Quality:** ESLint and Prettier
- **CI:** GitHub Actions
- **Browser:** Chromium (Desktop Chrome)

---

## ⚙️ Prerequisites

- **Node.js:** 20.x or higher
- **npm:** 9.x or higher

---

## 🚀 Setup & Installation

1. Install dependencies:
   `npm ci`
2. Install Playwright browser binaries:
   `npx playwright install`

---

## 🧪 Running Tests

- **Run full test suite:**
  `npm test`
- **Run smoke tests:**
  `npm run test:smoke`
- **Run a single spec file:**
  `npx playwright test tests/transactions.spec.ts`
- **Run tests in headed browser mode:**
  `npx playwright test --headed`

---

## 🏷️ Tags

| Tag                     | Meaning                       |
| ----------------------- | ----------------------------- |
| `@smoke`                | Critical-path checks          |
| `@p1` / `@p2` / `@p3`   | Priority                      |
| `@frozen`, `@overdraft` | Scenario-specific user states |
| `@visual`               | Screenshot comparison tests   |

```bash
npx playwright test --grep @visual
npx playwright test --grep @visual --update-snapshots   # regenerate baselines
```

---

## 🔐 Authentication and test state

`tests/auth.setup.ts` runs before the test project and writes:

- `playwright/.auth/standard.json`
- `playwright/.auth/frozen.json`

These files are generated, git-ignored, and must never be committed. Other roles (overdraft, slow, admin, locked) log in through the UI within their own tests.

---

## ⚙️ GitHub Actions: CI pipeline

`.github/workflows/playwright.yml` runs on every push and pull request to `main`, and can be started manually. It installs dependencies with `npm ci`, runs the suite, and uploads the Playwright report and Allure results as artifacts (14-day retention).

---

## 📁 Project Structure

```
SecureBank/
├── .github/workflows/     # CI pipeline
├── playwright/
│   └── .auth/             # Saved browser authentication state
├── data/                  # Test data
├── fixtures/              # Custom Playwright test fixtures
├── pages/                 # Page Object Model (POM) classes
│   └── components/        # Shared UI components (Navbar, Sidebar)
├── tests/                 # Test spec files
├── utils/                 # Helper utilities (state seeding)
├── allure-results/        # Raw Allure test result artifacts
├── playwright-report/     # Playwright HTML report output
├── playwright.config.ts   # Global Playwright configuration
├── package.json
├── tsconfig.json
└── README.md

```

## ⚠️ Known limitations

- **Visual baselines are platform-specific.** Snapshots were generated on Windows (`*-win32.png`) and CI runs on `windows-latest`. Running `@visual` tests on Linux or macOS requires regenerating baselines.
- **Public demo credentials.** The users in `data/users.ts` are the practice site's published demo accounts, not real credentials.

---

## 📊 Available Scripts

- `npm test` — Full test suite
- `npm run test:smoke` — Smoke tests only
- `npm run lint` — ESLint code quality check
- `npm run format` - Format with Prettier
- `npm run allure:serve` — Generate and open Allure report
- `npm run allure:generate` — Generate a standalone HTML report
- `npm run allure:open` — Open the generated HTML report
