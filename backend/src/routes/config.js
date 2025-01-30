const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/languages', configController.getLanguages);
router.get('/countries', configController.getCountries);
router.get('/translations', configController.getTranslations);

module.exports = router; 