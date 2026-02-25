/**
 * Integration Tests Summary
 * 
 * This test suite covers:
 * 
 * 1. Authentication Tests (auth.test.js)
 *    - Login with valid/invalid credentials
 *    - Token refresh mechanism
 *    - Protected route access
 * 
 * 2. Blog API Tests (blog.test.js)
 *    - Public: List published posts, get by slug
 *    - Admin: CRUD operations, route order fix (Bug 1)
 * 
 * 3. Case Studies Tests (caseStudies.test.js)
 *    - Public: List published, get by slug
 *    - Admin: CRUD, image handling (Bug 2)
 * 
 * 4. Content Tests (content.test.js)
 *    - Public: Get content by page
 *    - Admin: Update content
 *    - Preview route mapping (Bug 3)
 * 
 * Run tests:
 * - cd server && npm test           # Run all tests
 * - cd server && npm run test:watch # Watch mode
 * - cd server && npm run test:coverage # With coverage report
 */