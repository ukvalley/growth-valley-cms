const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const { Admin, Content } = require('../models');

let mongoServer;
let accessToken;

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

describe('Content API', () => {
  beforeEach(async () => {
    await Admin.create({
      email: 'test@growthvalley.com',
      password: 'TestPassword123!',
      name: 'Test Admin',
      role: 'admin',
    });

    const res = await request(app)
      .post('/api/admin/login')
      .send({
        email: 'test@growthvalley.com',
        password: 'TestPassword123!',
      });
    accessToken = res.body.data.accessToken;
  });

  describe('GET /api/content/:page', () => {
    it('should return content for a page', async () => {
      const res = await request(app).get('/api/content/home');
      expect(res.status).toBe(200);
      expect(res.body.data.page).toBe('home');
    });
  });

  describe('PUT /api/content/:page', () => {
    it('should update content (Bug 4 - changes reflect)', async () => {
      const res = await request(app)
        .put('/api/content/about')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          sections: {
            hero: { title: 'Updated Title' },
          },
        });

      expect(res.status).toBe(200);

      // Verify immediate reflection
      const checkRes = await request(app).get('/api/content/about');
      expect(checkRes.body.data.sections.hero.title).toBe('Updated Title');
    });
  });
});