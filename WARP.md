# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project: Playwright UI Testing Framework (TypeScript) - A comprehensive UI testing framework targeting a web app, featuring Page Object Model with user flow enforcement, data-driven testing, API testing layer, multi-browser support, retries, storage state, and HTML reports.

## MCP (Model Context Protocol) Agent Rules

When using Playwright MCP tools for interactive browser testing:

### Test Generation Workflow
1. Use MCP browser tools (browser_navigate, browser_snapshot, browser_click, browser_type, etc.) to explore and interact with the application
2. Document each interaction step by step
3. After completing all manual exploration, generate a complete Playwright TypeScript test using @playwright/test
4. Save the generated test file in the e2e/ directory (organized by feature)
5. Execute the test file using `npx playwright test` and iterate until it passes
6. Run linter with `npm run lint` to ensure code quality

### MCP Browser Testing Best Practices
- Always use `browser_snapshot` to inspect page structure before attempting interactions
- Use role-based selectors (getByRole, getByLabel, getByText) over CSS/XPath when writing tests
- Prefer `browser_snapshot` over `browser_take_screenshot` for getting element references
- When clicking elements, always provide both `element` (human-readable description) and `ref` (exact element reference from snapshot)
- For form interactions, use `browser_fill_form` when filling multiple fields
- Use `browser_wait_for` when waiting for dynamic content to appear/disappear
- Handle dialogs with `browser_handle_dialog` when they appear
- Use `browser_evaluate` for complex JavaScript operations that can't be done with standard MCP tools

### Test Philosophy
- Test user-visible behavior that users will interact with
- Avoid relying on implementation details
- Each test must be completely isolated from other tests
- Use `test.step` to break complex tests into clear, readable steps
- Use `describe` blocks to group related tests by feature
- Apply tags (@smoke, @regression) for selective test runs

### Page Object Model Guidelines
- Create page objects in e2e/pages/ directory
- Organize by feature (e.g., e2e/pages/auth/ for authentication pages)
- Use private getter methods for locators
- Expose intentful action methods (not raw clicks)
- Use role-based locators (getByRole, getByLabel, getByText)
- Add `{ force: true }` to checkbox/radio interactions when custom UI intercepts clicks
- Scope locators properly (e.g., `page.locator('nb-auth-block').getByRole('link', { name: 'Register' })`)
- Include verification helper methods for common assertions

#### Page Object Flow Pattern (IMPORTANT)
- **Action methods that navigate should return the next page object**
- This enforces proper user flow and prevents navigation shortcuts
- Example:
  ```typescript
  // LoginPage.ts
  async submit(): Promise<IoTDashboardPage> {
    await this.submitButton.click();
    return new IoTDashboardPage(this.page);
  }
  
  // Usage in test
  const loginPage = new LoginPage(page);
  await loginPage.fillCredentials(email, password);
  const dashboardPage = await loginPage.submit();
  // dashboardPage is now ready to use
  ```
- Benefits:
  - Makes test flow readable and self-documenting
  - Prevents direct `goto()` calls that skip user flows
  - Easier to understand navigation paths
  - Type-safe page transitions
- Only use `goto()` for:
  - Homepage/landing page
  - Direct URL navigation when testing specific scenarios
  - Test setup when you need to start at a specific page

### Locator Best Practices
- Priority order: getByRole > getByLabel > getByPlaceholder > getByText > getByTestId > CSS/XPath
- Use chaining and filtering to narrow down search: `page.getByRole('listitem').filter({ hasText: 'Product 2' })`
- Avoid XPath when possible
- Ensure uniqueness by scoping to parent containers
- For custom UI components (Nebular, Material, etc.), scope with parent selector first

### Assertions and Waits
- Always use web-first assertions: `await expect(locator).toBeVisible()`
- Never use manual assertions: avoid `expect(await locator.isVisible()).toBe(true)`
- Playwright auto-waits for: attached, visible, stable, enabled, editable
- Use `{ force: true }` only when elements are intercepted by custom overlays
- Add explicit waits with `waitFor({ state: 'visible', timeout: 10000 })` for dynamic elements

### Test Data
- Use @faker-js/faker for generating random test data
- Import from helpers: `import { faker } from '@faker-js/faker'`
- Generate unique emails, names, passwords to avoid collisions
- Example: `faker.internet.email()`, `faker.person.fullName()`, `faker.internet.password({ length: 10 })`

### Data-Driven Testing
When the same test logic needs to run with different inputs, use data-driven approach:
- **Create test data arrays** outside test blocks (at module level)
- **Use loops** to generate multiple tests from the same logic
- **Apply test design techniques**:
  - **Equivalence Partitioning**: Test different classes of valid inputs
  - **Boundary Value Analysis**: Test edge cases and limits
  - **Matrix Testing**: Test combinations of inputs
- **IMPORTANT**: Never include dynamic data in test titles (Playwright requirement)
  ```typescript
  // ✅ GOOD - Static title, dynamic data in test
  const testData = [
    { description: 'standard email', generator: () => faker.internet.email() },
    { description: 'custom domain', generator: () => `user@${faker.internet.domainName()}` },
  ];
  
  for (const testCase of testData) {
    test(`should accept ${testCase.description}`, async ({ page }) => {
      const email = testCase.generator(); // Generate inside test
      // test logic
    });
  }
  
  // ❌ BAD - Dynamic data in title causes Playwright errors
  for (const email of [faker.internet.email(), faker.internet.email()]) {
    test(`should accept ${email}`, async ({ page }) => { // Title changes each run!
      // test logic
    });
  }
  ```
- See `e2e/forms/data-driven-forms.spec.ts` for complete example
- Benefits: Reduces duplication, easy to add new cases, demonstrates professional test design

### API Testing Layer
This project includes API testing capabilities alongside UI tests:
- **API Helper**: `e2e/api/api-helper.ts` - Reusable class for HTTP requests
- **Test organization**: API tests in `e2e/api/` directory
- **Available methods**:
  - `get(url, headers?)` - GET requests
  - `post(url, body, headers?)` - POST requests with JSON body
  - `put(url, body, headers?)` - PUT requests
  - `patch(url, body, headers?)` - PATCH requests
  - `delete(url, headers?)` - DELETE requests
  - `verifyStatusCode(response, expectedStatus)` - Status validation
  - `getResponseBody(response)` - Extract JSON response
  - `verifyResponseData(actual, expected)` - Data validation
- **Usage example**:
  ```typescript
  test('should create a new post', async ({ request }) => {
    const apiHelper = new ApiHelper(request);
    const response = await apiHelper.post('/api/posts', {
      title: 'Test Post',
      body: 'Content',
      userId: 1
    });
    await apiHelper.verifyStatusCode(response, 201);
    const data = await apiHelper.getResponseBody(response);
    expect(data.id).toBeDefined();
  });
  ```
- **Best practices**:
  - Use API tests for backend validation (faster than UI)
  - Test CRUD operations, schema validation, error handling
  - Use API for test data setup before UI tests
  - Validate response times for performance testing
- **Type safety**: All API helpers use TypeScript types (APIResponse, not `any`)
- See `e2e/api/api-tests.spec.ts` for comprehensive examples

### TypeScript Best Practices
- **Never use `any` type** - use `unknown` or specific types
- **Type all function parameters and return values**
- **Use APIResponse type** from @playwright/test for API responses
- **Use generics** where appropriate for reusable code
- Example:
  ```typescript
  // ❌ BAD
  async post(url: string, body: any) { }
  
  // ✅ GOOD
  async post(url: string, body: unknown, headers?: Record<string, string>) { }
  async verifyStatusCode(response: APIResponse, expectedStatus: number) { }
  ```
- Run `npm run lint` to catch type issues early
- ESLint enforces proper typing and awaited Playwright calls

Commands
- Setup
  - Node 18+ (see README)
  - Install deps
    ```sh path=null start=null
    npm install
    ```
  - Install Playwright browsers
    ```sh path=null start=null
    npx playwright install
    ```
- Environment variables:
    - Copy `.env.example` to `.env` and customize values
    - BASE_URL, LOGIN_USER, LOGIN_PASS are loaded via dotenv
    - Never commit `.env` file (in .gitignore)

- Run tests
  - All tests (all browsers defined in projects)
    ```sh path=null start=null
    npm test
    ```
  - UI mode
    ```sh path=null start=null
    npm run test:ui
    ```
  - Tagged suites
    ```sh path=null start=null
    npm run test:smoke
    npm run test:regression
    ```
  - Single file / directory
    ```sh path=null start=null
    npx playwright test e2e/homepage.spec.ts
    npx playwright test e2e/authentication/register.spec.ts
    npx playwright test e2e/authentication
    ```
  - By test title (grep)
    ```sh path=null start=null
    npx playwright test -g "loads successfully and has a title"
    ```
  - Choose browser project or headed mode
    ```sh path=null start=null
    npx playwright test --project=chromium
    npx playwright test --project=chromium --headed
    ```
  - API tests only (no app needed - uses public API)
    ```sh path=null start=null
    npx playwright test e2e/api
    ```
  - Data-driven tests example
    ```sh path=null start=null
    npx playwright test e2e/forms/data-driven-forms.spec.ts
    ```

- Lint
  ```sh path=null start=null
  npm run lint
  npm run lint:fix
  ```
  Notes: ESLint enforces awaiting Playwright actions/assertions (playwright/missing-playwright-await) and disallows floating promises (@typescript-eslint/no-floating-promises).

- Reports and tooling
  ```sh path=null start=null
  npm run show-report   # open last HTML report
  npm run codegen       # launch Playwright codegen
  ```

Architecture and configuration
- Test directory: e2e/
  - Specs grouped by feature (e.g., e2e/authentication, e2e/homepage.spec.ts)
  - Tags used for suite selection: @smoke, @regression
- Page Objects: e2e/pages/
  - Encapsulates common flows and role/label-based locators (e.g., LoginPage, RegisterPage)
  - Navigation methods return next page objects to enforce proper flow
- API Layer: e2e/api/
  - api-helper.ts: Reusable API request utilities
  - api-tests.spec.ts: API test examples with CRUD operations
- Helpers: e2e/helpers/
  - Data generation via Faker (createUser, etc.)
- Examples:
  - e2e/forms/data-driven-forms.spec.ts: Data-driven testing with test design techniques
- Global setup: auth.setup.ts
  - Runs before tests (configured as globalSetup)
  - Seeds a benign cookie and persists storage state at .auth/user.json for reuse across tests
- Playwright config: playwright.config.ts
  - testDir: ./e2e
  - fullyParallel: true, retries: 2
  - reporter: list + html
  - globalSetup: ./auth.setup.ts
  - use:
    - baseURL: from process.env.BASE_URL (dotenv) with fallback to https://playwright.dev
    - storageState: .auth/user.json
    - artifacts: trace on-first-retry, screenshots only-on-failure, video retain-on-failure
  - projects: chromium, firefox, webkit (Desktop profiles)
- TypeScript: tsconfig.json
  - Strict type checking; includes e2e/**/*.ts, playwright.config.ts, auth.setup.ts
- Linting: .eslintrc.cjs
  - Extends plugin:playwright/recommended; enforces awaited Playwright calls
- CI: .github/workflows/ci.yml
  - Node 18, npm ci, npx playwright install --with-deps
  - Supports manual workflow dispatch with inputs:
    - Branch selection
    - Test suite selection (all, smoke, regression)
  - Environment variables via GitHub secrets (BASE_URL, LOGIN_USER, LOGIN_PASS)
  - Uploads HTML report and test artifacts with run numbers
  - Timeout: 30 minutes
  - Separate artifact upload on failure for debugging

Operational notes for Warp
- Environment
  - Copy `.env.example` to `.env` and customize
  - .env is read automatically via dotenv/config imported in playwright.config.ts
  - Define BASE_URL and optional LOGIN_USER/LOGIN_PASS
- Running a subset quickly
  - Prefer scoping by file/dir and grep/title to minimize runtime
  - Use --project to constrain browsers when iterating locally (e.g., chromium only)
  - API tests run standalone (no app needed)
- Artifacts and debugging
  - On failures, inspect traces/screenshots/videos
  - Open HTML report with `npm run show-report`
  - Check linting with `npm run lint` before committing
- Storage state
  - If test flows rely on pre-auth state, ensure .auth/user.json exists (global setup creates/updates it each run)

## Advanced Patterns & Best Practices

### When to Use Each Testing Approach
- **UI Tests**: Critical user journeys, visual validation, cross-browser compatibility
- **API Tests**: Backend validation, data integrity, faster feedback, test data setup
- **Data-Driven Tests**: Same logic with multiple inputs, test design technique demonstration
- **Combined approach**: Use API for setup/teardown, UI for user workflows

### Test Independence
- Each test must be completely independent
- No shared state between tests
- Tests can run in any order or in parallel
- Use faker for unique test data to avoid collisions
- Don't rely on previous tests' side effects

### Code Quality Checklist
Before committing new tests:
1. ✅ Run `npm run lint` - must pass with 0 errors
2. ✅ Run tests locally - must pass
3. ✅ Use proper TypeScript types (no `any`)
4. ✅ Follow page object flow pattern (return next page)
5. ✅ Use web-first assertions
6. ✅ Add test.step() for clarity
7. ✅ Tag tests appropriately (@smoke, @regression)
8. ✅ Use role-based selectors when possible

### Documentation Files
- **WARP.md** (this file): Agent guidance and best practices
- **IMPROVEMENTS_SUMMARY.md**: Recent improvements and metrics
- **INTERVIEW_PREP_GUIDE.md**: Interview preparation with Q&A
- **INTERVIEW_QUESTIONS.md**: Technical interview Q&A reference
- **README.md**: Project setup and general information
