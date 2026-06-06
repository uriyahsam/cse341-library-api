const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Author = require('../models/Author');

let testAuthorId;

beforeAll(async () => {
  const author = await Author.create({
    firstName: 'Unit',
    lastName: 'Tester',
    nationality: 'Canadian',
    birthYear: 1980,
    genres: ['Non-Fiction', 'Science'],
    biography: 'A fictitious author created solely for automated unit testing.',
    email: `unittester_${Date.now()}@test.com`
  });
  testAuthorId = author._id.toString();
});

afterAll(async () => {
  await Author.deleteMany({ email: /unittester_/ });
  server.close();
  await mongoose.connection.close();
});

describe('GET /authors', () => {
  test('should return 200 and an array', async () => {
    const res = await request(app).get('/authors');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('each author should have required fields', async () => {
    const res = await request(app).get('/authors');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      const author = res.body[0];
      expect(author).toHaveProperty('firstName');
      expect(author).toHaveProperty('lastName');
      expect(author).toHaveProperty('email');
      expect(author).toHaveProperty('genres');
    }
  });
});

describe('GET /authors/:id', () => {
  test('should return 200 and the author for valid id', async () => {
    const res = await request(app).get(`/authors/${testAuthorId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', testAuthorId);
    expect(res.body.firstName).toBe('Unit');
  });

  test('should return 404 for non-existent author', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/authors/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('should return 500 for malformed id', async () => {
    const res = await request(app).get('/authors/not-a-valid-id');
    expect(res.statusCode).toBe(500);
  });
});
