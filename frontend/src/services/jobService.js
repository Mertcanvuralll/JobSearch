import api from './api';

// İş ilanlarını ara
export const searchJobs = async (params) => {
  try {
    console.log('Raw search params:', params);

    const cleanParams = Object.fromEntries(
      Object.entries({
        title: params.title,
        city: params.city,
        type: params.workTypes,
        experience: params.experience,
        sort: params.sort,
        limit: params.limit
      }).filter(([key, value]) => {
        console.log(`Checking param ${key}:`, value);
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        // Boş string kontrolünü kaldır, sadece null ve undefined kontrolü yap
        return value != null;
      })
    );

    console.log('Cleaned API Request Params:', cleanParams);

    const response = await api.get('/jobs', { 
      params: cleanParams 
    });
    
    console.log('API Response:', response.data);
    return response.data.jobs || [];
  } catch (error) {
    console.error('İş arama hatası:', error);
    throw error;
  }
};

// İş detaylarını getir
export const getJobDetails = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error('İş detayı getirme hatası:', error);
    throw error;
  }
};

// İlana başvur
export const applyToJob = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(`/jobs/${id}/apply`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('İş başvuru hatası:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Başvuru yapılırken bir hata oluştu');
  }
};

// Benzer ilanları getir
export const getRelatedJobs = async (id) => {
  const response = await api.get(`/jobs/related/${id}`);
  return response.data;
};

// İş detayını getir (getJob -> getJobDetails olarak değişti)
export const getJob = getJobDetails;

// İlana başvur (applyJob -> applyToJob olarak değişti)
export const applyJob = applyToJob;

// İş tiplerini getir
export const getWorkTypes = async () => {
  try {
    const response = await api.get('/jobs/work-types');
    return response.data;
  } catch (error) {
    console.error('İş tipleri getirme hatası:', error);
    throw error;
  }
};

// Deneyim seviyelerini getir
export const getExperienceLevels = async () => {
  try {
    const response = await api.get('/jobs/experience-levels');
    return response.data;
  } catch (error) {
    console.error('Deneyim seviyeleri getirme hatası:', error);
    throw error;
  }
};

// Şehirleri getir
export const getCities = async () => {
  try {
    const response = await api.get('/jobs/cities');
    return response.data;
  } catch (error) {
    console.error('Şehir listesi getirme hatası:', error);
    throw error;
  }
}; 