const express = require('express');
const jwt = require('jsonwebtoken');
const { readFile, writeFile } = require('../utils/fileHandler');
const { v4: uuid } = require('uuid');
const router = express.Router();

const USERS_FILE = './data/users.json';
const secret = 'secret123';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const users = await readFile(USERS_FILE);
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }
  const newUser = { id: uuid(), email, password };
  users.push(newUser);
  await writeFile(USERS_FILE, users);
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readFile(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;