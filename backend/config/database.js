const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      dbName: 'job-search'
    });

    console.log(`MongoDB Atlas'a bağlandı: ${conn.connection.host}`);
    
    // Bağlantıyı test et
    await conn.connection.db.admin().ping();
    console.log('Database ping başarılı');
    
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 