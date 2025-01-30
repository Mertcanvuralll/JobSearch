const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const auth = require('../middleware/auth');
const { POSITIONS, CITIES } = require('../config/constants');

// Public routes - Özel route'lar önce gelmeli
router.get('/search', jobController.getJobs); // searchJobs yerine getJobs kullanıyoruz
router.get('/positions', (req, res) => {
  try {
    const { search = '' } = req.query;
    
    let filteredPositions = POSITIONS;
    if (search) {
      filteredPositions = POSITIONS.filter(position => 
        position.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredPositions);
  } catch (error) {
    console.error('Pozisyon arama hatası:', error);
    res.status(500).json({ message: 'Pozisyonlar yüklenirken bir hata oluştu' });
  }
});

router.get('/cities', (req, res) => {
  try {
    const { search = '' } = req.query;
    
    let filteredCities = CITIES;
    if (search) {
      filteredCities = CITIES.filter(city => 
        city.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredCities);
  } catch (error) {
    console.error('Şehir arama hatası:', error);
    res.status(500).json({ message: 'Şehirler yüklenirken bir hata oluştu' });
  }
});

router.get('/work-types', (req, res) => {
  res.json(['Tam Zamanlı', 'Yarı Zamanlı', 'Uzaktan', 'Staj']);
});

router.get('/experience-levels', (req, res) => {
  res.json(['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl']);
});

router.get('/towns', jobController.getTowns);

// Ana route'lar
router.get('/', jobController.getJobs);

// ID'ye göre işlemler en sonda olmalı
router.get('/:id', jobController.getJobById);

// Protected routes
router.post('/:id/apply', auth, jobController.applyToJob);
router.post('/save/:id', auth, jobController.saveJob);
router.delete('/save/:id', auth, jobController.unsaveJob);

module.exports = router; 