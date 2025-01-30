const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Dosya yükleme konfigürasyonu
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/profile-photos'));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
    cb(null, true);
  }
}).single('photo');

exports.register = async (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Dosya yükleme hatası', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }

    try {
      console.log('Register request body:', req.body);
      console.log('Register file:', req.file);

      const { email, password, name, surname, country, city, passwordConfirm } = req.body;

      // Zorunlu alan kontrolü
      if (!email || !password) {
        return res.status(400).json({ message: 'Email ve şifre zorunludur' });
      }

      // Şifre eşleşme kontrolü
      if (password !== passwordConfirm) {
        return res.status(400).json({ message: 'Şifreler eşleşmiyor' });
      }

      // Email kontrolü
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
      }

      // Yeni kullanıcı oluştur
      const user = new User({
        email: email.toLowerCase(),
        password,
        name: name || email.split('@')[0],
        surname,
        country: country || 'Türkiye',
        city,
        photo: req.file ? `/uploads/profile-photos/${req.file.filename}` : null
      });

      await user.save();

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          country: user.country,
          city: user.city
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        message: 'Kayıt işlemi başarısız',
        error: error.message
      });
    }
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifreyi kontrol et
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Token oluştur
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        country: user.country,
        city: user.city
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Frontend'e yönlendirme yap ve token'ı query param olarak gönder
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?` + 
      `token=${token}&` + 
      `user=${encodeURIComponent(JSON.stringify(req.user))}`
    );
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=google_login_failed`);
  }
}; 