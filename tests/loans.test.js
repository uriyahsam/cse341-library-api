const request = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../server');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Author = require('../models/Author');
const Member = require('../models/Member');

let testLoanId;

beforeAll(async () => {
  const author = await Author.create({
    firstName: 'Loan',
    lastName: 'TestAuthor',
    nationality: 'British',
    birthYear: 1965,
    genres: ['Mystery'],
    biography: 'A test author created for loan unit tests in the library API system.',
    email: `loan_author_${Date.now()}@test.com`
  });

  const book = await Book.create({
    title: 'Loan Test Book',
    authorId: author._id,
    isbn: `LOAN-${Date.now()}`,
    genre: 'Mystery',
    publishedYear: 2019,
    totalCopies: 2
  });

  const member = await Member.create({
    firstName: 'Loan',
    lastName: 'Tester',
    email: `loan_member_${Date.now()}@test.com`,
    phone: '+1-555-8888',
    address: '42 Loan Street, Booktown',
    membershipType: 'premium'
  });

  const loan = await Loan.create({
    bookId: book._id,
    memberId: member._id,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  });
  testLoanId = loan._id.toString();
});

afterAll(async () => {
  await Loan.deleteMany({});
  await Book.deleteMany({ title: 'Loan Test Book' });
  await Author.deleteMany({ email: /loan_author_/ });
  await Member.deleteMany({ email: /loan_member_/ });
  server.close();
  await mongoose.connection.close();
});

describe('GET /loans', () => {
  test('should return 200 and an array', async () => {
    const res = await request(app).get('/loans');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('loans should have required fields', async () => {
    const res = await request(app).get('/loans');
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('status');
      expect(res.body[0]).toHaveProperty('dueDate');
    }
  });
});

describe('GET /loans/:id', () => {
  test('should return 200 for valid loan id', async () => {
    const res = await request(app).get(`/loans/${testLoanId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', testLoanId);
  });

  test('should return 404 for unknown loan', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/loans/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });
});
