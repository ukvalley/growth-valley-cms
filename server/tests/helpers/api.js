// Test helper utilities for API tests
const request = require('supertest');
const app = require('../server');
const { Admin } = require('../models');

/**
 * Create a test admin and return auth tokens
 */
async function createTestAdmin(overrides = {}) {
  const admin = await Admin.create({
    email: 'test@growthvalley.com',
    password: 'TestPassword123!',
    name: 'Test Admin',
    role: 'admin',
    ...overrides,
  });

  const loginRes = await request(app)
    .post('/api/admin/login')
    .send({
      email: admin.email,
      password: overrides.password || 'TestPassword123!',
    });

  return {
    admin,
    accessToken: loginRes.body.data.accessToken,
    refreshToken: loginRes.body.data.refreshToken,
  };
}

/**
 * Make an authenticated request
 */
function authRequest(method, path, token) {
  return request(app)[method](path).set('Authorization', `Bearer ${token}`);
}

module.exports = {
  createTestAdmin,
  authRequest,
};