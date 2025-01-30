import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const user = params.get('user');

    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', decodeURIComponent(user));
      navigate('/');
    } else {
      enqueueSnackbar(t('Google login failed'), { variant: 'error' });
      navigate('/login');
    }
  }, [location, navigate, enqueueSnackbar, t]);

  return null;
};

export default AuthCallback; 