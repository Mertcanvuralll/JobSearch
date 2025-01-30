require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const passport = require('passport');
require('./config/passport');
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const configRoutes = require('./routes/config');
const path = require('path');
const multer = require('multer');

// MongoDB bağlantısı
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3030',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// body-parser limitleri
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/jobs', jobRoutes); // /api prefix'ini kaldırdık çünkü frontend bu şekilde istek yapıyor
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: 'Dosya yükleme hatası',
      error: err.message
    });
  }

  res.status(500).json({ 
    message: 'Sunucu hatası',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 