require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobs');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({ message: 'Bir hata oluştu!', error: err.message });
});

module.exports = app; 