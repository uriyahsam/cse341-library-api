const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Member = require('../models/Member');

let testMemberId;

beforeAll(async () => {
  const member = await Member.create({
    firstName: 'Jane',
    lastName: 'TestUser',
    email: `jane_test_${Date.now()}@test.com`,
    phone: '+1-555-9999',
    address: '1 Test Lane, Testville',
    membershipType: 'student'
  });
  testMemberId = member._id.toString();
});

afterAll(async () => {
  await Member.deleteMany({ email: /jane_test_/ });
  server.close();
  await mongoose.connection.close();
});

describe('GET /members', () => {
  test('should return 200 and an array', async () => {
    const res = await request(app).get('/members');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('members should contain expected fields', async () => {
    const res = await request(app).get('/members');
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('email');
      expect(res.body[0]).toHaveProperty('membershipType');
    }
  });
});

describe('GET /members/:id', () => {
  test('should return 200 for a valid member id', async () => {
    const res = await request(app).get(`/members/${testMemberId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', testMemberId);
    expect(res.body.firstName).toBe('Jane');
  });

  test('should return 404 for unknown member id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/members/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
