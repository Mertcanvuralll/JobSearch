const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

const sampleJobs = [
  {
    title: 'Frontend Geliştirici',
    company: {
      name: 'Tech Solutions A.Ş.',
      logo: '/images/companies/tech-solutions.png'
    },
    location: {
      city: 'İstanbul',
      district: 'Maslak'
    },
    description: 'Modern web teknolojileri kullanarak kullanıcı arayüzleri geliştirmek...',
    requirements: [
      'React ve Redux deneyimi',
      'TypeScript bilgisi',
      'Responsive tasarım tecrübesi',
      'Git versiyon kontrol sistemi kullanımı',
      'Minimum 5 yıl deneyim'
    ],
    type: 'Tam Zamanlı',
    experience: '5-10 yıl',
    salary: {
      min: 25000,
      max: 35000,
      currency: 'TL'
    },
    tags: ['React', 'TypeScript', 'Redux', 'Frontend'],
    benefits: [
      'Özel sağlık sigortası',
      'Yemek kartı',
      'Uzaktan çalışma imkanı',
      'Yıllık izin'
    ]
  },
  {
    title: 'Backend Geliştirici',
    company: {
      name: 'Innovate Yazılım',
      logo: '/images/companies/tech-solutions2.png'
    },
    location: {
      city: 'Ankara',
      district: 'Çankaya'
    },
    description: 'Node.js ve MongoDB kullanarak RESTful API servisleri geliştirmek...',
    requirements: [
      'Node.js ve Express.js deneyimi',
      'MongoDB veya benzeri NoSQL veritabanı tecrübesi',
      'API tasarımı ve dokümantasyonu',
      'Minimum 3 yıl deneyim'
    ],
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    salary: {
      min: 20000,
      max: 30000,
      currency: 'TL'
    },
    tags: ['Node.js', 'MongoDB', 'Express', 'Backend'],
    benefits: [
      'Özel sağlık sigortası',
      'Servis',
      'Yemek kartı'
    ]
  },
  // Finans Sektörü
  {
    title: 'Finans Uzmanı',
    company: {
      name: 'Global Finance Bank',
      logo: '/images/companies/tech-solutions3.png'
    },
    location: {
      city: 'İstanbul',
      district: 'Levent'
    },
    description: 'Finansal raporlama ve analiz konusunda deneyimli analist arayışındayız.',
    requirements: [
      'Finans veya İşletme bölümü mezunu',
      'Excel ve finansal modelleme tecrübesi',
      'Analitik düşünme yeteneği',
      'İyi derecede İngilizce'
    ],
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    salary: {
      min: 18000,
      max: 25000,
      currency: 'TL'
    },
    tags: ['Finans', 'Analiz', 'Excel', 'Raporlama'],
    benefits: ['Özel sağlık sigortası', 'Performans primi', 'Yemek kartı']
  },

  // Pazarlama Sektörü
  {
    title: 'Pazarlama Uzmanı',
    company: {
      name: 'Marketing Pro',
      logo: '/images/companies/tech-solutions4.png'
    },
    location: {
      city: 'İzmir',
      district: 'Konak'
    },
    description: 'Sosyal medya ve dijital pazarlama stratejileri geliştirecek uzman arayışındayız.',
    requirements: [
      'Sosyal medya platformları deneyimi',
      'Google Ads ve Analytics sertifikaları',
      'İçerik üretimi tecrübesi',
      'SEO bilgisi'
    ],
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    salary: {
      min: 15000,
      max: 22000,
      currency: 'TL'
    },
    tags: ['Dijital Pazarlama', 'SEO', 'Sosyal Medya', 'Google Ads'],
    benefits: ['Özel sağlık sigortası', 'Yemek kartı']
  },

  // Sağlık Sektörü
  {
    title: 'Hemşire',
    company: {
      name: 'Özel Sağlık Hastanesi',
      logo: '/images/companies/tech-solutions5.png'
    },
    location: {
      city: 'Ankara',
      district: 'Çankaya'
    },
    description: 'Yoğun bakım ünitesinde görev alacak deneyimli hemşire arayışındayız.',
    requirements: [
      'Hemşirelik bölümü mezunu',
      'Yoğun bakım sertifikası',
      'Minimum 2 yıl deneyim',
      'Vardiyalı çalışabilme'
    ],
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    salary: {
      min: 17000,
      max: 23000,
      currency: 'TL'
    },
    tags: ['Sağlık', 'Hemşirelik', 'Yoğun Bakım'],
    benefits: ['Özel sağlık sigortası', 'Vardiya primi', 'Yemek']
  },

  // Eğitim Sektörü
  {
    title: 'Öğretmen',
    company: {
      name: 'International School',
      logo: '/images/companies/tech-solutions6.png'
    },
    location: {
      city: 'İstanbul',
      district: 'Beşiktaş'
    },
    description: 'İlkokul seviyesinde İngilizce dersi verecek öğretmen arayışındayız.',
    requirements: [
      'İngilizce Öğretmenliği mezunu',
      'CELTA/DELTA sertifikası',
      'İlkokul deneyimi',
      'Yaratıcı öğretim teknikleri'
    ],
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    salary: {
      min: 16000,
      max: 22000,
      currency: 'TL'
    },
    tags: ['Eğitim', 'İngilizce', 'İlkokul'],
    benefits: ['Özel sağlık sigortası', 'Yemek', 'Servis']
  },

  // Üretim Sektörü
  {
    title: 'Mühendis',
    company: {
      name: 'Endüstri A.Ş.',
      logo: '/images/companies/tech-solutions7.png'
    },
    location: {
      city: 'Bursa',
      district: 'Nilüfer'
    },
    description: 'Otomotiv yan sanayi üretim tesisinde görev alacak mühendis arayışındayız.',
    requirements: [
      'Endüstri/Makine Mühendisliği mezunu',
      'Üretim planlama tecrübesi',
      'Lean manufacturing bilgisi',
      'SAP deneyimi'
    ],
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    salary: {
      min: 22000,
      max: 32000,
      currency: 'TL'
    },
    tags: ['Üretim', 'Mühendislik', 'Otomotiv'],
    benefits: ['Özel sağlık sigortası', 'Servis', 'Yemek']
  },
  // Mevcut ilanlardan sonra, sampleJobs array'ine eklenecek yeni ilanlar:

  // Teknoloji Sektörü
  {
    title: 'Yazılım Mühendisi',
    company: {
      name: 'Digital Solutions Ltd.',
      logo: '/images/companies/tech-solutions8.png'
    },
    location: {
      city: 'İstanbul',
      district: 'Şişli'
    },
    description: 'Modern web uygulamaları geliştirmek için deneyimli Full Stack Developer arayışındayız.',
    requirements: [
      'React ve Node.js deneyimi',
      'PostgreSQL veya MongoDB tecrübesi',
      'Docker ve Kubernetes bilgisi',
      'CI/CD süreçlerine hakimiyet',
      'Minimum 4 yıl deneyim'
    ],
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    salary: {
      min: 28000,
      max: 40000,
      currency: 'TL'
    },
    tags: ['React', 'Node.js', 'Docker', 'Kubernetes', 'Full Stack'],
    benefits: [
      'Özel sağlık sigortası',
      'Yemek kartı',
      'Uzaktan çalışma imkanı',
      'Yıllık izin',
      'Eğitim bütçesi'
    ]
  },
  {
    title: 'Yazılım Mühendisi',
    company: {
      name: 'Mobile Tech A.Ş.',
      logo: '/images/companies/tech-solutions9.png'
    },
    location: {
      city: 'İzmir',
      district: 'Bornova'
    },
    description: 'iOS platformunda yenilikçi mobil uygulamalar geliştirecek deneyimli yazılımcı arıyoruz.',
    requirements: [
      'Swift ve iOS SDK deneyimi',
      'UIKit ve SwiftUI tecrübesi',
      'Git kullanımı',
      'Clean Code prensipleri',
      'Minimum 3 yıl iOS geliştirme deneyimi'
    ],
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    salary: {
      min: 25000,
      max: 35000,
      currency: 'TL'
    },
    tags: ['iOS', 'Swift', 'Mobile', 'SwiftUI'],
    benefits: [
      'Özel sağlık sigortası',
      'Yemek kartı',
      'Spor salonu üyeliği',
      'Yıllık izin'
    ]
  },

  // Pazarlama ve Reklam Sektörü
  {
    title: 'Ürün Yöneticisi',
    company: {
      name: 'Creative Agency',
      logo: '/images/companies/tech-solutions10.png'
    },
    location: {
      city: 'İstanbul',
      district: 'Kadıköy'
    },
    description: 'Uluslararası markalar için stratejik marka yönetimi yapacak deneyimli yönetici arıyoruz.',
    requirements: [
      'Pazarlama veya İşletme bölümü mezunu',
      'Minimum 5 yıl marka yönetimi deneyimi',
      'Dijital pazarlama bilgisi',
      'Proje yönetimi tecrübesi',
      'İleri düzey İngilizce'
    ],
    type: 'Tam Zamanlı',
    experience: '5-10 yıl',
    salary: {
      min: 30000,
      max: 45000,
      currency: 'TL'
    },
    tags: ['Pazarlama', 'Marka Yönetimi', 'Dijital Pazarlama'],
    benefits: [
      'Özel sağlık sigortası',
      'Yemek kartı',
      'Performans primi',
      'Yıllık izin',
      'Şirket telefonu'
    ]
  },

  // Otomotiv Sektörü
  {
    title: 'Mühendis',
    company: {
      name: 'AutoTech Otomotiv',
      logo: '/images/companies/tech-solutions11.png'
    },
    location: {
      city: 'Bursa',
      district: 'Nilüfer'
    },
    description: 'Elektrikli araç teknolojileri geliştirme projelerinde görev alacak AR-GE mühendisi arıyoruz.',
    requirements: [
      'Elektrik-Elektronik Mühendisliği mezunu',
      'Güç elektroniği bilgisi',
      'MATLAB/Simulink tecrübesi',
      'Prototip geliştirme deneyimi',
      'İyi derecede İngilizce'
    ],
    type: 'Tam Zamanlı',
    experience: '3-5 yıl',
    salary: {
      min: 27000,
      max: 38000,
      currency: 'TL'
    },
    tags: ['AR-GE', 'Otomotiv', 'Elektrikli Araçlar'],
    benefits: [
      'Özel sağlık sigortası',
      'Servis',
      'Yemek',
      'Performans primi'
    ]
  },

  // E-ticaret Sektörü
  {
    title: 'E-ticaret Uzmanı',
    company: {
      name: 'ShopNow',
      logo: '/images/companies/tech-solutions12.png'
    },
    location: {
      city: 'Ankara',
      district: 'Çankaya'
    },
    description: 'Online mağaza operasyonlarını yönetecek deneyimli uzman arayışındayız.',
    requirements: [
      'E-ticaret platformları deneyimi',
      'Stok ve sipariş yönetimi tecrübesi',
      'MS Office programlarına hakimiyet',
      'Raporlama ve analiz yeteneği',
      'Minimum 2 yıl deneyim'
    ],
    type: 'Tam Zamanlı',
    experience: '1-3 yıl',
    salary: {
      min: 15000,
      max: 22000,
      currency: 'TL'
    },
    tags: ['E-ticaret', 'Operasyon', 'Perakende'],
    benefits: [
      'Özel sağlık sigortası',
      'Yemek kartı',
      'Prim sistemi'
    ]
  },

  // Turizm Sektörü
  {
    title: 'Otel Müdürü',
    company: {
      name: 'Luxury Resort Hotel',
      logo: '/images/companies/tech-solutions13.png'
    },
    location: {
      city: 'Antalya',
      district: 'Kemer'
    },
    description: '5 yıldızlı otel işletmesinde görev alacak deneyimli otel müdürü arıyoruz.',
    requirements: [
      'Turizm ve Otelcilik bölümü mezunu',
      'Minimum 7 yıl otelcilik deneyimi',
      'İleri düzey İngilizce',
      'İkinci yabancı dil tercih sebebi',
      'Kriz yönetimi tecrübesi'
    ],
    type: 'Tam Zamanlı',
    experience: '5-10 yıl',
    salary: {
      min: 35000,
      max: 50000,
      currency: 'TL'
    },
    tags: ['Turizm', 'Otelcilik', 'Yönetim'],
    benefits: [
      'Özel sağlık sigortası',
      'Konaklama imkanı',
      'Yemek',
      'Performans primi',
      'Lojman imkanı'
    ]
  }
  // Daha fazla örnek iş ilanı eklenebilir...
];

const seedJobs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut iş ilanlarını temizle
    await Job.deleteMany({});
    console.log('Mevcut iş ilanları temizlendi');

    // Yeni iş ilanlarını ekle
    const createdJobs = await Job.insertMany(sampleJobs);
    console.log(`${createdJobs.length} adet iş ilanı eklendi`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
  
};

seedJobs(); 
