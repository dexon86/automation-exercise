# Automation Exercise

Automated testing suite for [https://automationexercise.com](https://automationexercise.com)

## About

This is a Playwright-based test automation project for the Automation Exercise website - a full-fledged practice website for automation engineers. Built with TypeScript, following Page Object Model pattern, and enforcing strict coding standards.

## Features

- ✅ **Page Object Model** with flow enforcement (navigation methods return next page objects)
- ✅ **TypeScript** with strict type checking (no `any` types)
- ✅ **ESLint** with Playwright plugin (enforces awaited assertions)
- ✅ **Role-based locators** (getByRole, getByLabel) for accessibility
- ✅ **Web-first assertions** for auto-waiting
- ✅ **Global setup** with storage state reuse
- ✅ **API testing layer** with typed helpers
- ✅ **Test tags** (@smoke, @regression) for selective runs
- ✅ **Multi-browser** support (Chromium, Firefox, WebKit)

## Setup

Copy environment file:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Run tests with UI mode:

```bash
npm run test:ui
```

Run tagged suites:

```bash
npm run test:smoke
npm run test:regression
```

Run specific test file:

```bash
npx playwright test e2e/homepage.spec.ts
```

View test report:

```bash
npm run show-report
```

Launch Playwright codegen:

```bash
npm run codegen
```

## Linting

Run lint:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

## Project Structure

```
├── e2e/
│   ├── api/
│   │   └── api-helper.ts       # Typed API helper class
│   ├── pages/
│   │   └── HomePage.ts          # Page object with role-based locators
│   └── homepage.spec.ts         # Test specs with tags
├── .auth/
│   └── user.json                # Storage state (auto-generated)
├── playwright.config.ts         # Playwright configuration
├── auth.setup.ts                # Global setup for storage state
├── tsconfig.json                # TypeScript strict config
├── .eslintrc.cjs                # ESLint rules (no-any, await enforcement)
└── .env.example                 # Environment variables template
```

## Best Practices

- **Never use `any` type** - use `unknown` or specific types
- **Web-first assertions** - `await expect(locator).toBeVisible()`
- **Page object flow** - navigation methods return next page object
- **Role-based selectors** - prefer `getByRole` over CSS
- **Test.step()** - break complex tests into readable steps
- **Tags** - apply @smoke, @regression for selective runs
- **Test isolation** - each test is independent with unique data

## Code Quality Checklist

Before committing:

1. ✅ Run `npm run lint` - must pass with 0 errors
2. ✅ Run tests locally - must pass
3. ✅ Use proper TypeScript types (no `any`)
4. ✅ Follow page object flow pattern
5. ✅ Use web-first assertions
6. ✅ Add test.step() for clarity
7. ✅ Tag tests appropriately
8. ✅ Use role-based selectors
