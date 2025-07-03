const express = require('express');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const { readFile, writeFile } = require('../utils/fileHandler');
const { v4: uuid } = require('uuid');
const router = express.Router();

// ✅ Correctly resolve absolute path to books.json
const BOOKS_FILE = path.join(__dirname, '../data/books.json');

router.use(auth);

// GET /books?genre=&author=&title=&page=&limit=
router.get('/', async (req, res) => {
  const { genre, author, title, page = 1, limit = 200 } = req.query;
  let books = await readFile(BOOKS_FILE);

  if (genre) {
    books = books.filter(b => b.genre.toLowerCase().includes(genre.toLowerCase()));
  }
  if (author) {
    books = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }
  if (title) {
    books = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  }

  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = books.slice(start, start + parseInt(limit));

  res.json(paginated);
});

// GET /books/:id
router.get('/:id', async (req, res) => {
  const books = await readFile(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST /books
router.post('/', async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;

  if (!title || !author || !genre || !publishedYear) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const books = await readFile(BOOKS_FILE);
  const newBook = {
    id: uuid(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.userId,
  };

  books.push(newBook);
  await writeFile(BOOKS_FILE, books);
  res.status(201).json(newBook);
});

// PUT /books/:id
router.put('/:id', async (req, res) => {
  const books = await readFile(BOOKS_FILE);
  const index = books.findIndex(b => b.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  if (books[index].userId !== req.user.userId)
    return res.status(403).json({ error: 'Unauthorized' });

  books[index] = { ...books[index], ...req.body };
  await writeFile(BOOKS_FILE, books);

  res.json(books[index]);
});

// DELETE /books/:id
router.delete('/:id', async (req, res) => {
  let books = await readFile(BOOKS_FILE);
  const book = books.find(b => b.id === req.params.id);

  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (book.userId !== req.user.userId)
    return res.status(403).json({ error: 'Unauthorized' });

  books = books.filter(b => b.id !== req.params.id);
  await writeFile(BOOKS_FILE, books);

  res.json({ message: 'Book deleted' });
});

module.exports = router;