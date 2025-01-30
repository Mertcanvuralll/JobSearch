import api from './api';

const googleAuthConfig = {
  client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  redirect_uri: 'http://localhost:3030/auth/google/callback',
  scope: 'email profile',
  response_type: 'code',
  prompt: 'select_account'
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response || error);
    throw error.response?.data || {
      message: 'Giriş başarısız'
    };
  }
};

export const register = async (formData) => {
  try {
    // Debug için form verilerini kontrol et
    console.log('Sending form data:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const response = await api.post('/api/auth/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Register error:', error.response || error);
    throw error.response?.data || {
      message: 'Bir hata oluştu, lütfen tekrar deneyin'
    };
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const initiateGoogleLogin = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`;
}; 