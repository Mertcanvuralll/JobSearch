const express = require('express');
const router = express.Router();
const { POSITIONS, CITIES } = require('../config/constants');
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');

// Pozisyon önerileri endpoint'i
router.get('/positions', (req, res) => {
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

    res.json(filteredPositions.slice(0, 10));
  } catch (error) {
    console.error('Pozisyon arama hatası:', error);
    res.status(500).json({ message: 'Pozisyonlar yüklenirken bir hata oluştu' });
  }
});

// Şehir önerileri endpoint'i
router.get('/cities', (req, res) => {
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

    res.json(filteredCities.slice(0, 10));
  } catch (error) {
    console.error('Şehir arama hatası:', error);
    res.status(500).json({ message: 'Şehirler yüklenirken bir hata oluştu' });
  }
});

// Başvuru route'u - auth middleware'i eklenmiş
router.post('/:id/apply', auth, jobController.applyToJob);

module.exports = router; 