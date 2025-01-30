const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
    minlength: 8
  },
  name: {
    type: String,
    default: function() {
      return this.email ? this.email.split('@')[0] : null;
    }
  },
  surname: {
    type: String,
    default: null
  },
  googleId: String,
  photo: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: 'Türkiye'
  },
  city: {
    type: String,
    default: 'İstanbul'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema); 