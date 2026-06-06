const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Book = require('../models/Book');
const Author = require('../models/Author');

let testAuthorId;
let testBookId;

beforeAll(async () => {
  // Create a test author to use as reference
  const author = await Author.create({
    firstName: 'Test',
    lastName: 'Author',
    nationality: 'American',
    birthYear: 1970,
    genres: ['Fiction'],
    biography: 'A test author used for unit testing purposes only.',
    email: `testauthor_books_${Date.now()}@test.com`
  });
  testAuthorId = author._id.toString();

  const book = await Book.create({
    title: 'Test Book',
    authorId: testAuthorId,
    isbn: `TEST-${Date.now()}`,
    genre: 'Fiction',
    publishedYear: 2020,
    totalCopies: 3
  });
  testBookId = book._id.toString();
});

afterAll(async () => {
  await Book.deleteMany({ title: /Test Book/ });
  await Author.deleteMany({ email: /testauthor_books/ });
  server.close();
  await mongoose.connection.close();
});

describe('GET /books', () => {
  test('should return 200 and an array of books', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('response should contain expected fields', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(200);
    if (res.body.length > 0) {
      const book = res.body[0];
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('isbn');
      expect(book).toHaveProperty('genre');
    }
  });
});

describe('GET /books/:id', () => {
  test('should return 200 and a single book for valid id', async () => {
    const res = await request(app).get(`/books/${testBookId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', testBookId);
    expect(res.body).toHaveProperty('title', 'Test Book');
  });

  test('should return 404 for non-existent book id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('should return 500 for invalid id format', async () => {
    const res = await request(app).get('/books/invalid-id-format');
    expect(res.statusCode).toBe(500);
  });
});
