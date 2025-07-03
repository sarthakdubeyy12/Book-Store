const request = require('supertest');
const app = require('../app'); // ✅ Correct path relative to tests/
const { v4: uuid } = require('uuid');

let token = '';
let bookId = '';

beforeAll(async () => {
  // Register a new user
  await request(app)
    .post('/auth/register')
    .send({ email: 'test@example.com', password: 'password123' });

  // Login and store token
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'password123' });

  token = res.body.token;
});

describe('Book API Tests', () => {
  test('POST /books → creates a new book', async () => {
    const res = await request(app)
      .post('/books')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Book',
        author: 'Author X',
        genre: 'Test Genre',
        publishedYear: 2024,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    bookId = res.body.id;
  });

  test('GET /books → returns list of books', async () => {
    const res = await request(app)
      .get('/books')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /books/:id → updates book if creator', async () => {
    const res = await request(app)
      .put(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  test('DELETE /books/:id → deletes book if creator', async () => {
    const res = await request(app)
      .delete(`/books/${bookId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Book deleted');
  });

  test('GET /books without token → fails', async () => {
    const res = await request(app).get('/books');
    expect(res.statusCode).toBe(401);
  });
});