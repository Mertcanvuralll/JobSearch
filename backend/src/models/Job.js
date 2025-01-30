const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  company: {
    name: {
      type: String,
      required: true,
    },
    logo: String
  },
  location: {
    city: {
      type: String,
      required: true,
      index: true
    },
    district: String
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [{
    type: String,
  }],
  type: {
    type: String,
    enum: ['Tam Zamanlı', 'Yarı Zamanlı', 'Uzaktan', 'Staj'],
    required: true,
  },
  experience: {
    type: String,
    enum: ['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl'],
    required: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'TL'
    },
  },
  tags: [{
    type: String,
  }],
  benefits: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Güncelleme tarihini otomatik güncelle
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Arama için text index ekleyelim
jobSchema.index({ title: 'text', 'location.city': 'text' });

// Sanal alan olarak başvuru sayısını ekleyelim
jobSchema.virtual('applicationCount').get(function() {
  return this.applications ? this.applications.length : 0;
});

// JSON dönüşümünde sanal alanları dahil edelim
jobSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Job', jobSchema); 