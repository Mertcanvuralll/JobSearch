const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'Türkiye'
    }
  },
  // ... diğer alanlar
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema); 