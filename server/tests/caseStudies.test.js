const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./app');
const { Admin, CaseStudy } = require('../models');

let mongoServer;
let accessToken;
let testCaseStudy;

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

describe('Case Studies API', () => {
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

    testCaseStudy = await CaseStudy.create({
      title: 'Test Case Study',
      slug: 'test-case-study',
      clientName: 'Test Client',
      industry: 'Technology',
      challenge: 'Challenge description for test',
      solution: 'Solution description for test',
      results: [
        { metric: 'Revenue', value: '+50%', description: 'Increased revenue' }
      ],
      status: 'published',
      publishDate: new Date(),
      featuredImage: '/uploads/test-image.png', // Relative URL (Bug 2)
    });
  });

  describe('GET /api/case-studies', () => {
    it('should return published case studies', async () => {
      const res = await request(app).get('/api/case-studies');
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/case-studies/admin/:id', () => {
    it('should return case study with image data (Bug 2)', async () => {
      const res = await request(app)
        .get(`/api/case-studies/admin/${testCaseStudy._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.featuredImage).toBeDefined();
    });
  });
});