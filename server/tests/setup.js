const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_EXPIRES_IN = '7d';
process.env.JWT_REFRESH_EXPIRES_IN = '30d';

// Mock the database connection
jest.mock('../config/database', () => {
  return jest.fn().mockImplementation(async () => {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri);
    }
  });
});

// Prevent server from starting
jest.mock('../config', () => ({
  nodeEnv: 'test',
  port: 3001,
  jwtSecret: 'test-jwt-secret-key',
  jwtExpiresIn: '7d',
  jwtRefreshExpiresIn: '30d',
  mongodbUri: 'mongodb://localhost:27017/test',
  corsOrigin: 'http://localhost:3000',
  email: {
    host: 'smtp.test.com',
    port: 587,
    user: 'test@test.com',
    pass: 'testpass',
  },
}));

// Connect to in-memory database before all tests
beforeAll(async () => {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }
  const mongoUri = mongoServer.getUri();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
});

// Clear all collections after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close database connection after all tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});