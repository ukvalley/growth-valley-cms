# Growth Valley CMS - Test Suite

## Overview

Comprehensive test suite covering backend API and E2E flows.

## Backend API Tests (Jest + Supertest)

### Running Tests

```bash
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Test Coverage

| Suite | Tests | Description |
|-------|-------|-------------|
| **auth.test.js** | 4 | Login, token refresh, protected routes |
| **blog.test.js** | 3 | CRUD operations, route order fix (Bug 1) |
| **caseStudies.test.js** | 2 | CRUD, image handling (Bug 2) |
| **content.test.js** | 2 | Content management, cache fix (Bug 4) |

### Bug Fix Validation

- **Bug 1**: Blog edit not loading - `GET /api/blog/admin/:id` test validates route order
- **Bug 2**: Case studies images - Tests verify relative image URLs are returned
- **Bug 4**: Content not reflecting - Tests verify immediate data persistence

## E2E Tests (Playwright)

### Setup

```bash
npm install
npx playwright install
```

### Running E2E Tests

```bash
npm run test:e2e       # Run all E2E tests
npm run test:e2e:ui    # Interactive UI mode
```

### E2E Test Suites

| Suite | Tests | Description |
|-------|-------|-------------|
| **auth.spec.ts** | 4 | Login/logout flow, error handling |
| **blog.spec.ts** | 4 | Blog CRUD, dark mode (Bug 2), data loading (Bug 1) |
| **case-studies.spec.ts** | 3 | Case study management, image handling |
| **content.spec.ts** | 4 | Content editing, preview routing (Bug 3) |

## Test Structure

```
growth-valley/
├── jest.config.js          # Frontend Jest config
├── jest.setup.ts           # Frontend test setup
├── playwright.config.ts    # E2E test config
├── e2e/                    # E2E tests
│   ├── auth.spec.ts
│   ├── blog.spec.ts
│   ├── case-studies.spec.ts
│   └── content.spec.ts
└── server/
    ├── jest.config.js      # Backend Jest config
    └── tests/
        ├── app.js          # Test Express app
        ├── auth.test.js
        ├── blog.test.js
        ├── caseStudies.test.js
        ├── content.test.js
        └── helpers/
            └── api.js      # Test utilities
```

## Recent Test Results

```
Test Suites: 4 passed, 4 total
Tests:       11 passed, 11 total
Time:        9.11s
```

## Notes

- Backend tests use in-memory MongoDB (MongoMemoryServer)
- E2E tests require both frontend (port 3000) and backend (port 3001) running
- Tests auto-start servers in CI environments