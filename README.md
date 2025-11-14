# Automation Exercise

Automated testing suite for [https://automationexercise.com](https://automationexercise.com)

## About

This is a Playwright-based test automation project for the Automation Exercise website - a full-fledged practice website for automation engineers.

## Setup

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

View test report:

```bash
npm run report
```

## Project Structure

```
├── tests/          # Test files
├── pages/          # Page Object Models
└── fixtures/       # Test fixtures and utilities
```
