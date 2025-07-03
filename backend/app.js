// backend/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const logger = require('./middleware/logger');

const app = express();

// ✅ Allow both local and deployed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookstore-frontend-cini.onrender.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(logger);

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

// 404 Not Found
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Server Error' });
});

// ✅ Export app (no listen)
module.exports = app;