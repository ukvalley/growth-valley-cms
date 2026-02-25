const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const { Admin } = require('../models');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Authentication API', () => {
  const testAdmin = {
    email: 'test@growthvalley.com',
    password: 'TestPassword123!',
    name: 'Test Admin',
    role: 'admin',
  };

  beforeEach(async () => {
    await Admin.create(testAdmin);
  });

  describe('POST /api/admin/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should fail with invalid password', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: testAdmin.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    let accessToken;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: testAdmin.email,
          password: testAdmin.password,
        });
      accessToken = res.body.data.accessToken;
    });

    it('should access protected route with valid token', async () => {
      const res = await request(app)
        .get('/api/admin/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(testAdmin.email);
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/admin/me');
      expect(res.status).toBe(401);
    });
  });
});