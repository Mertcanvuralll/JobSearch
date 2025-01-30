exports.getLanguages = async (req, res) => {
  try {
    // Desteklenen diller
    const languages = [
      { code: 'tr', name: 'TR' },
      { code: 'en', name: 'EN' }
    ];
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.getCountries = async (req, res) => {
  try {
    // Şimdilik sadece Türkiye destekleniyor
    const countries = [
      { code: 'TR', name: 'Türkiye' }
    ];
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

exports.getTranslations = async (req, res) => {
  try {
    const translations = {
      en: {
        translation: {
          'Search Jobs': 'Search Jobs',
          'Position': 'Position',
          'City': 'City',
          'Enter job position': 'Enter job position (e.g. Software Developer)',
          'Select city': 'Select city',
          'Search': 'Search',
          'Login': 'Login',
          'Register': 'Register',
          'Login/Register': 'Login/Register',
          'Profile': 'Profile',
          'Logout': 'Logout',
          'Find Your Dream Job': 'Find Your Dream Job',
          'Search among thousands of job postings': 'Search among thousands of job postings',
          'Featured Job Postings': 'Featured Job Postings',
          'Loading...': 'Loading...',
          'Job Description': 'Job Description',
          'Requirements': 'Requirements',
          'Apply Now': 'Apply Now',
          'Similar Jobs': 'Similar Jobs',
          'Login Required': 'Login Required',
          'You need to login to apply for this job': 'You need to login to apply for this job',
          'Cancel': 'Cancel',
          'Your application has been received successfully': 'Your application has been received successfully',
          'Filters': 'Filters',
          'Location': 'Location',
          'Work Type': 'Work Type',
          'Experience': 'Experience',
          'No jobs found matching your criteria': 'No jobs found matching your criteria',
          'Town': 'Town',
          'Select town': 'Select town',
          'No towns found': 'No towns found for selected city',
        }
      },
      tr: {
        translation: {
          'Search Jobs': 'İş Ara',
          'Position': 'Pozisyon',
          'City': 'Şehir',
          'Enter job position': 'Pozisyon girin (örn. Yazılım Uzmanı)',
          'Select city': 'Şehir seçin',
          'Search': 'Ara',
          'Login': 'Giriş Yap',
          'Login/Register': 'Giriş Yap/Üye Ol',
          'Register': 'Kayıt Ol',
          'Profile': 'Profil',
          'Logout': 'Çıkış Yap',
          'Find Your Dream Job': 'Hayalindeki İşi Bul',
          'Search among thousands of job listings': 'Binlerce iş ilanı arasında arama yap',
          'Featured Job Postings': 'Öne Çıkan İlanlar',
          'Loading...': 'Yükleniyor...',
          'Job Description': 'İş Tanımı',
          'Requirements': 'Gereksinimler',
          'Apply Now': 'Şimdi Başvur',
          'Similar Jobs': 'Benzer İlanlar',
          'Login Required': 'Giriş Gerekli',
          'You need to login to apply for this job': 'Bu ilana başvurmak için giriş yapmalısınız',
          'Cancel': 'İptal',
          'Your application has been received successfully': 'Başvurunuz başarıyla alındı',
          'Filters': 'Filtreler',
          'Location': 'Konum',
          'Work Type': 'Çalışma Şekli',
          'Experience': 'Deneyim',
          'No jobs found matching your criteria': 'Kriterlerinize uygun ilan bulunamadı',
          'Town': 'İlçe',
          'Select town': 'İlçe seçin',
          'No towns found': 'Seçili şehir için ilçe bulunamadı',
        }
      }
    };
    res.json(translations);
  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}; 