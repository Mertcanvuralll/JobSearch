const Job = require('../models/Job');
const mongoose = require('mongoose');
const Application = require('../models/Application');

// Tüm iş ilanlarını getir ve filtrele
exports.getJobs = async (req, res) => {
  try {
    const { 
      title,
      city, 
      type, 
      experience,
      limit = 10,
      page = 1,
      sort = '-createdAt'
    } = req.query;

    console.log('Received Query Params:', req.query);

    const skip = (page - 1) * limit;
    let query = { status: 'active' };
    
    // Başlık araması - regex ile kısmi eşleşme
    if (title && title.trim()) {
      query.title = { 
        $regex: title.trim(), 
        $options: 'i'  // büyük/küçük harf duyarsız
      };
      console.log('Title Query:', { title: query.title });
    }
    
    // Şehir araması - regex ile kısmi eşleşme
    if (city && city.trim()) {
      query['location.city'] = { 
        $regex: city.trim(), 
        $options: 'i'  // büyük/küçük harf duyarsız
      };
      console.log('City Query:', { city: query['location.city'] });
    }
    
    // Diğer filtreler
    if (Array.isArray(type) && type.length > 0) {
      query.type = { $in: type };
    } else if (type && typeof type === 'string') {
      query.type = type;
    }
    
    if (Array.isArray(experience) && experience.length > 0) {
      query.experience = { $in: experience };
    } else if (experience && typeof experience === 'string') {
      query.experience = experience;
    }

    console.log('Final MongoDB Query:', JSON.stringify(query, null, 2));

    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Job.countDocuments(query);

    console.log(`Found ${total} jobs matching criteria`);
    console.log('Found jobs:', jobs.map(job => ({ 
      title: job.title, 
      city: job.location?.city 
    })));

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error in getJobs:', error);
    res.status(500).json({ 
      message: 'İş ilanları yüklenirken bir hata oluştu',
      error: error.message 
    });
  }
};

// ID'ye göre iş ilanı getir
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Özel route'lar için kontrol
    if (id === 'work-types') {
      return res.json(['Tam Zamanlı', 'Yarı Zamanlı', 'Uzaktan', 'Staj']);
    }
    
    if (id === 'experience-levels') {
      return res.json(['0-1 yıl', '1-3 yıl', '3-5 yıl', '5-10 yıl', '10+ yıl']);
    }

    // ObjectId kontrolü
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Geçersiz iş ilanı ID' });
    }

    const job = await Job.findById(id);
    
    if (!job) {
      return res.status(404).json({ message: 'İş ilanı bulunamadı' });
    }

    res.json(job);
  } catch (error) {
    console.error('İş detayı getirme hatası:', error);
    res.status(500).json({ message: 'İş detayları yüklenirken bir hata oluştu' });
  }
};

// İş ilanına başvur
exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id; // Kullanıcı ID'sini al

    console.log('Applying job with:', { jobId, userId }); // Debug için

    // İş ilanını kontrol et
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // Daha önce başvuru yapılıp yapılmadığını kontrol et
    const existingApplication = await Application.findOne({
      job: jobId,
      user: userId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Bu ilana daha önce başvuru yaptınız' });
    }

    // Yeni başvuru oluştur
    const application = new Application({
      job: jobId,
      user: userId,
      status: 'pending',
      appliedAt: new Date()
    });

    console.log('Created application:', application); // Debug için

    await application.save();

    // İş ilanının başvuru sayısını güncelle
    job.applications.push(application._id);
    await job.save();

    res.status(201).json({ 
      message: 'Başvurunuz başarıyla alındı',
      applicationId: application._id 
    });

  } catch (error) {
    console.error('Başvuru hatası:', error);
    res.status(500).json({ 
      message: 'Başvuru işlemi sırasında bir hata oluştu',
      error: error.message 
    });
  }
};

// İş ilanını kaydet
exports.saveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // User modelinde savedJobs array'i olduğunu varsayıyoruz
    if (!req.user.savedJobs.includes(req.params.id)) {
      req.user.savedJobs.push(req.params.id);
      await req.user.save();
    }

    res.json({ message: 'İlan kaydedildi' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// İş ilanını kayıtlardan kaldır
exports.unsaveJob = async (req, res) => {
  try {
    req.user.savedJobs = req.user.savedJobs.filter(
      id => id.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ message: 'İlan kayıtlardan kaldırıldı' });
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.getRelatedJobs = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    // Benzer ilanları bul
    const relatedJobs = await Job.find({
      _id: { $ne: job._id },
      $or: [
        { title: { $regex: job.title, $options: 'i' } },
        { 'location.city': job.location.city }
      ]
    })
    .limit(3);

    res.json(relatedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Pozisyonları getir
exports.getPositions = async (req, res) => {
  try {
    // Veritabanından benzersiz pozisyonları çek
    const positions = await Job.distinct('title');
    res.json(positions);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Şehirleri getir
exports.getCities = async (req, res) => {
  try {
    // Veritabanından benzersiz şehirleri çek
    const cities = await Job.distinct('location.city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Çalışma tiplerini getir
exports.getWorkTypes = async (req, res) => {
  try {
    const workTypes = await Job.distinct('type');
    res.json(workTypes);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Deneyim seviyelerini getir
exports.getExperienceLevels = async (req, res) => {
  try {
    const experienceLevels = await Job.distinct('experience');
    res.json(experienceLevels);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// İlçeleri getir
exports.getTowns = async (req, res) => {
  try {
    const { city } = req.query;
    let filter = {};
    
    if (city) {
      filter['location.city'] = city;
    }

    const towns = await Job.distinct('location.town', filter);
    res.json(towns);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      type,
      experience,
      skills,
      salary
    } = req.body;

    const job = new Job({
      title,
      company,
      description,
      location,
      type,
      experience,
      skills,
      salary,
      applications: []
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.getJobDetails = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('applications');
    
    if (!job) {
      return res.status(404).json({ message: 'İlan bulunamadı' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}; 