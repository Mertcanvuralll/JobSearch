import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  IconButton,
  Avatar,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register, initiateGoogleLogin } from '../services/authService';
import GoogleIcon from '../components/icons/GoogleIcon';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { PhotoCamera, Close } from '@material-ui/icons';
import { CITIES } from '../constants';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(4),
    width: '100%',
    margin: '0 auto',
  },
  form: {
    width: '100%',
  },
  submit: {
    margin: theme.spacing(2, 0),
    padding: theme.spacing(1),
    width: '120px',
    textTransform: 'none',
  },
  googleButton: {
    marginBottom: theme.spacing(4),
    backgroundColor: '#fff',
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey[300]}`,
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
    width: '100%',
    textTransform: 'none',
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 2),
  },
  field: {
    marginBottom: theme.spacing(2),
  },
  gridContainer: {
    minHeight: '500px',
  },
  leftGrid: {
    borderRight: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
  },
  rightGrid: {
    padding: theme.spacing(3),
  },
  formTitle: {
    marginBottom: theme.spacing(3),
  },
  photoButton: {
    marginRight: theme.spacing(1),
  },
  photoPreview: {
    width: 60,
    height: 60,
    border: `2px solid ${theme.palette.primary.main}`,
  },
  removePhoto: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.palette.background.paper,
    padding: 4,
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    country: 'Türkiye',
    city: '',
    photo: null
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [error, setError] = useState({ login: '', register: '' });
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.email, loginData.password);
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      setError({ ...error, login: t('Invalid email or password') });
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    return minLength && hasNumber && hasSpecial;
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRegisterData({
        ...registerData,
        photo: file
      });
      
      // Önizleme URL'i oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Şifre kontrolü
    if (registerData.password !== registerData.passwordConfirm) {
      setError({
        ...error,
        register: 'Şifreler eşleşmiyor'
      });
      return;
    }

    try {
      // Debug için
      console.log('Gönderilecek veriler:', registerData);

      // FormData oluştur
      const formData = new FormData();
      
      // Zorunlu alanları kontrol et
      if (!registerData.email || !registerData.password) {
        setError({
          ...error,
          register: 'Email ve şifre zorunludur'
        });
        return;
      }

      // Tüm alanları FormData'ya ekle
      formData.append('email', registerData.email.trim());
      formData.append('password', registerData.password);
      formData.append('name', registerData.name.trim());
      formData.append('surname', registerData.surname.trim());
      formData.append('country', registerData.country);
      formData.append('city', registerData.city);
      formData.append('passwordConfirm', registerData.passwordConfirm);
      
      if (registerData.photo) {
        formData.append('photo', registerData.photo);
      }

      // Debug için FormData içeriğini kontrol et
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await register(formData);
      console.log('Register response:', response);
      
      const from = location.state?.from || '/';
      navigate(from);
    } catch (err) {
      console.error('Register error details:', err);
      setError({ 
        ...error, 
        register: err.message || err.response?.data?.message || 'Kayıt işlemi başarısız'
      });
    }
  };

  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  return (
    <Container component="main" maxWidth="lg" className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <Grid container className={classes.gridContainer}>
          {/* Login Form - Left Side */}
          <Grid item xs={12} md={6} className={classes.leftGrid}>
            <Typography variant="h5" className={classes.formTitle}>
              {t('Giriş Yap')}
            </Typography>
            
            <Button
              fullWidth
              variant="outlined"
              className={classes.googleButton}
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon />}
            >
              {t('GOOGLE ile Giriş Yap')}
            </Button>

            <form className={classes.form} onSubmit={handleLoginSubmit}>
              {error.login && (
                <Typography color="error" align="center" gutterBottom>
                  {error.login}
                </Typography>
              )}

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                id="login-email"
                label={t('Kullanıcı email')}
                name="email"
                autoComplete="email"
                value={loginData.email}
                onChange={handleLoginChange}
              />

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="password"
                label={t('Şifre')}
                type="password"
                id="login-password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginChange}
              />

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {t('GİRİŞ')}
                </Button>
              </Box>
            </form>
          </Grid>

          {/* Register Form - Right Side */}
          <Grid item xs={12} md={6} className={classes.rightGrid}>
            <Typography variant="h5" className={classes.formTitle}>
              {t('Üye Ol')}
            </Typography>

            <form className={classes.form} onSubmit={handleRegisterSubmit}>
              {error.register && (
                <Typography color="error" align="center" gutterBottom>
                  {error.register}
                </Typography>
              )}

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="name"
                label={t('Ad')}
                value={registerData.name}
                onChange={handleRegisterChange}
              />

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="surname"
                label={t('Soyad')}
                value={registerData.surname}
                onChange={handleRegisterChange}
              />

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="email"
                label={t('Kullanıcı email')}
                value={registerData.email}
                onChange={handleRegisterChange}
              />

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="password"
                label={t('Şifre')}
                type="password"
                value={registerData.password}
                onChange={handleRegisterChange}
              />

              <TextField
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="passwordConfirm"
                label={t('Tekrar')}
                type="password"
                value={registerData.passwordConfirm}
                onChange={handleRegisterChange}
              />

              <TextField
                select
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="country"
                label={t('Ülke')}
                value={registerData.country}
                onChange={handleRegisterChange}
              >
                <MenuItem value="Türkiye">Türkiye</MenuItem>
              </TextField>

              <TextField
                select
                variant="outlined"
                className={classes.field}
                required
                fullWidth
                name="city"
                label={t('Şehir')}
                value={registerData.city}
                onChange={handleRegisterChange}
              >
                {CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>

              <Box display="flex" alignItems="center" mb={2}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="photo-upload"
                  type="file"
                  onChange={handlePhotoChange}
                />
                <label htmlFor="photo-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    className={classes.photoButton}
                  >
                    {t('Fotoğraf Seç')}
                  </Button>
                </label>
                {photoPreview && (
                  <Box ml={2} position="relative">
                    <Avatar
                      src={photoPreview}
                      alt="Profil önizleme"
                      className={classes.photoPreview}
                    />
                    <IconButton
                      size="small"
                      className={classes.removePhoto}
                      onClick={() => {
                        setRegisterData({
                          ...registerData,
                          photo: null
                        });
                        setPhotoPreview(null);
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {t('KAYIT OL')}
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login; 