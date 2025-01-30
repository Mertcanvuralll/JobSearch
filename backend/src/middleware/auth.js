const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcıyı veritabanından al
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    // req.user'a tüm kullanıcı bilgisini ekle
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Geçersiz token' });
  }
}; 