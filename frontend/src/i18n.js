import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Ana Sayfa
      'Find Your Dream Job': 'Find Your Dream Job',
      'Search among thousands of job listings': 'Search among thousands of job postings',
      'Featured Job Postings': 'Featured Job Postings',
      'Search': 'Search',
      'Position': 'Position',
      'City': 'City',
      'Enter job position': 'Enter job position',
      'Select city': 'Select city',

      // İş Detay
      'Job Description': 'Job Description',
      'Requirements': 'Requirements',
      'Similar Jobs': 'Similar Jobs',
      'Share Job': 'Share Job',
      'Copy Link': 'Copy Link',
      'Link copied to clipboard': 'Link copied to clipboard',
      'Apply Now': 'Apply Now',
      'Share': 'Share',
      'Save Job': 'Save Job',
      'Remove from Saved': 'Remove from Saved',

      // Kullanıcı
      'Login': 'Login',
      'Login/Register': 'Login/Register',
      'Register': 'Register',
      'Profile': 'Profile',
      'Logout': 'Logout',
      'Login Required': 'Login Required',
      'You need to login to apply for this job': 'You need to login to apply for this job',
      'Cancel': 'Cancel',
      'Continue with Google': 'Continue with Google',

      // Filtreler
      'Filters': 'Filters',
      'Location': 'Location',
      'Work Type': 'Work Type',
      'Experience': 'Experience',
      'Sort By': 'Sort By',
      'Search in results': 'Search in results',
      'No jobs found matching your criteria': 'No jobs found matching your criteria',

      // Bildirimler
      'Your application has been received successfully': 'Your application has been received successfully',

      // Yeni çeviriler
      'Active Jobs': 'Active Jobs',
      'Companies': 'Companies',
      'Candidates': 'Candidates',
      'Placements': 'Placements',
      'View More Jobs': 'View More Jobs',
      "Login/Register": "Login/Register",
      'Giriş Yap/Üye Ol': 'Login/Register',
      'Country': 'Country',
    }
  },
  tr: {
    translation: {
      // Ana Sayfa
      'Find Your Dream Job': 'Hayalindeki İşi Bul',
      'Search among thousands of job listings': 'Binlerce iş ilanı arasında arama yap',
      'Featured Job Postings': 'Öne Çıkan İlanlar',
      'Search': 'Ara',
      'Position': 'Pozisyon',
      'City': 'Şehir',
      'Enter job position': 'Pozisyon girin',
      'Select city': 'Şehir seçin',
      'Login/Register': 'Giriş Yap/Üye Ol',

      // İş Detay
      'Job Description': 'İş Tanımı',
      'Requirements': 'Gereksinimler',
      'Similar Jobs': 'Benzer İlanlar',
      'Share Job': 'İlanı Paylaş',
      'Copy Link': 'Linki Kopyala',
      'Link copied to clipboard': 'Link panoya kopyalandı',
      'Apply Now': 'Şimdi Başvur',
      'Share': 'Paylaş',
      'Save Job': 'İlanı Kaydet',
      'Remove from Saved': 'Kaydedilenlerden Kaldır',

      // Kullanıcı
      'Login': 'Giriş Yap',
      'Login/Register': 'Giriş Yap/Üye Ol',
      'Register': 'Kayıt Ol',
      'Profile': 'Profil',
      'Logout': 'Çıkış Yap',
      'Login Required': 'Giriş Gerekli',
      'You need to login to apply for this job': 'Bu ilana başvurmak için giriş yapmalısınız',
      'Cancel': 'İptal',
      'Continue with Google': 'Google ile Devam Et',

      // Filtreler
      'Filters': 'Filtreler',
      'Location': 'Konum',
      'Work Type': 'Çalışma Şekli',
      'Experience': 'Deneyim',
      'Sort By': 'Sıralama',
      'Search in results': 'Sonuçlarda ara',
      'No jobs found matching your criteria': 'Kriterlerinize uygun ilan bulunamadı',

      // Bildirimler
      'Your application has been received successfully': 'Başvurunuz başarıyla alındı',

      // Yeni çeviriler
      'Active Jobs': 'Aktif İlanlar',
      'Companies': 'Şirketler',
      'Candidates': 'Adaylar',
      'Placements': 'Yerleştirmeler',
      'View More Jobs': 'Daha Fazla İlan',
      "Login/Register": "Giriş Yap/Üye Ol",
      'Giriş Yap/Üye Ol': 'Giriş Yap/Üye Ol',
      'Country': 'Ülke',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'tr', // Varsayılan dil
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 