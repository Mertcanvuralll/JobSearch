const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { POSITIONS, CITIES } = require('../config/constants');

// Pozisyon önerileri endpoint'i
router.get('/positions', async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    // Arama terimine göre pozisyonları filtrele
    let filteredPositions = POSITIONS;
    if (search) {
      filteredPositions = POSITIONS.filter(position => 
        position.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Alfabetik sırala
    filteredPositions.sort((a, b) => a.localeCompare(b));

    console.log('Bulunan pozisyonlar:', filteredPositions);
    res.json(filteredPositions.slice(0, 10));
  } catch (error) {
    console.error('Pozisyon arama hatası:', error);
    res.status(500).json({ message: 'Pozisyonlar yüklenirken bir hata oluştu' });
  }
});

// Şehir önerileri endpoint'i
router.get('/cities', async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    // Arama terimine göre şehirleri filtrele
    let filteredCities = CITIES;
    if (search) {
      filteredCities = CITIES.filter(city => 
        city.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Alfabetik sırala
    filteredCities.sort((a, b) => a.localeCompare(b));

    console.log('Bulunan şehirler:', filteredCities);
    res.json(filteredCities.slice(0, 10));
  } catch (error) {
    console.error('Şehir arama hatası:', error);
    res.status(500).json({ message: 'Şehirler yüklenirken bir hata oluştu' });
  }
});

// İş arama endpoint'i
router.get('/search', async (req, res) => {
  try {
    const { position, city } = req.query;
    
    let query = {};
    if (position) {
      query.position = { $regex: position, $options: 'i' };
    }
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    const jobs = await Job.find(query);
    res.json(jobs);
  } catch (error) {
    console.error('İş arama hatası:', error);
    res.status(500).json({ message: 'İş ilanları yüklenirken bir hata oluştu' });
  }
});

// Test endpoint'i - MongoDB bağlantısını kontrol etmek için
router.get('/test', async (req, res) => {
  try {
    const count = await Job.countDocuments();
    res.json({ 
      message: 'MongoDB bağlantısı başarılı',
      documentCount: count 
    });
  } catch (error) {
    console.error('Test hatası:', error);
    res.status(500).json({ 
      message: 'MongoDB bağlantı hatası',
      error: error.message 
    });
  }
});

module.exports = router; 