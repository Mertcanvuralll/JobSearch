import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import { searchJobs } from '../services/jobService';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import JobList from '../components/JobList';
import { LocationOn } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hero: {
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: '#fff',
    padding: theme.spacing(8, 0),
    position: 'relative',
    overflow: 'hidden',
    marginTop: '64px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url(/hero-pattern.svg) repeat',
      opacity: 0.1,
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(6, 0),
    },
  },
  heroContent: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: 700,
    margin: '0 auto',
    zIndex: 1,
  },
  heroTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    fontSize: '2.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
    },
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    marginBottom: theme.spacing(4),
    opacity: 0.9,
  },
  searchBarContainer: {
    maxWidth: 600,
    margin: '0 auto',
    padding: theme.spacing(0, 2),
  },
  featuredSection: {
    padding: theme.spacing(4, 0),
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: theme.spacing(3),
    maxWidth: '100%',
    margin: '0 auto',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    },
  },
  featuredCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  companyLogo: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    marginBottom: theme.spacing(2),
  },
  jobTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: theme.spacing(1),
  },
  companyName: {
    color: theme.palette.text.secondary,
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    color: theme.palette.text.secondary,
    fontSize: '0.85rem',
    marginTop: 'auto',
    '& .MuiSvgIcon-root': {
      fontSize: '1rem',
    },
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: 600,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  jobCard: {
    height: '100%',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: theme.shadows[8],
    },
  },
  loadingContainer: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  viewMoreButton: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(1.5, 4),
    fontSize: '1rem',
    fontWeight: 500,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'transparent',
    border: `2px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(126, 87, 194, 0.2)',
    },
  },
  viewMoreContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(-2),
  },
  statsSection: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(4, 0),
    color: '#fff',
  },
  statItem: {
    textAlign: 'center',
    '& h3': {
      fontSize: '2rem',
      fontWeight: 600,
      marginBottom: theme.spacing(1),
    },
    '& p': {
      fontSize: '1rem',
      opacity: 0.9,
    },
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [userCity, setUserCity] = useState(null);
  
  const stats = {
    totalJobs: '1000+',
    companies: '500+',
    candidates: '10000+',
    placements: '750+'
  };

  const navigate = useNavigate();

  // Kullanıcının konumunu al
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        // Önce localStorage'da kayıtlı şehir var mı kontrol et
        const savedCity = localStorage.getItem('userCity');
        if (savedCity) {
          setUserCity(savedCity);
          return;
        }

        // Tarayıcının geolocation API'sini kullan
        if ("geolocation" in navigator) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          // Koordinatları şehir bilgisine çevir
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          // Şehir bilgisini al ve kaydet
          const city = data.address.city || data.address.town || data.address.state;
          if (city) {
            localStorage.setItem('userCity', city);
            setUserCity(city);
          }
        }
      } catch (error) {
        console.error('Konum alınamadı:', error);
      }
    };

    getUserLocation();
  }, []);

  // İlanları getir ve sırala
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const response = await searchJobs({ limit: 10, sort: '-createdAt' }); // Daha fazla ilan al
        
        // İlanları kullanıcının şehrine göre sırala
        let sortedJobs = [...response];
        if (userCity) {
          sortedJobs.sort((a, b) => {
            const aInCity = a.location.city.toLowerCase() === userCity.toLowerCase();
            const bInCity = b.location.city.toLowerCase() === userCity.toLowerCase();
            
            if (aInCity && !bInCity) return -1;
            if (!aInCity && bInCity) return 1;
            return 0;
          });
        }

        setJobs(sortedJobs);
      } catch (error) {
        console.error('İlanlar yüklenirken hata:', error);
        setError('İlanlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [userCity]); // userCity değiştiğinde ilanları yeniden sırala

  const handleSearch = ({ position, city }) => {
    // URL'de Türkçe karakterleri düzgün göstermek için encodeURIComponent kullanıyoruz
    const searchQuery = `?position=${encodeURIComponent(position || '')}&city=${encodeURIComponent(city || '')}`;
    navigate(`/search${searchQuery}`);
  };

  return (
    <div className={classes.root}>
      {/* Hero Section */}
      <Box className={classes.hero}>
        <Container maxWidth="lg">
          <div className={classes.heroContent}>
            <Typography
              variant="h1"
              component="h1"
              className={classes.heroTitle}
            >
              {t('Find Your Dream Job')}
            </Typography>
            <Typography
              variant="h6"
              component="p"
              className={classes.heroSubtitle}
            >
              {t('Search among thousands of job listings')}
            </Typography>
            <Box className={classes.searchBarContainer}>
              <SearchBar onSearch={handleSearch} />
            </Box>
          </div>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box className={classes.statsSection}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <div className={classes.statItem}>
                <h3>{stats.totalJobs}</h3>
                <p>{t('Active Jobs')}</p>
              </div>
            </Grid>
            <Grid item xs={6} md={3}>
              <div className={classes.statItem}>
                <h3>{stats.companies}</h3>
                <p>{t('Companies')}</p>
              </div>
            </Grid>
            <Grid item xs={6} md={3}>
              <div className={classes.statItem}>
                <h3>{stats.candidates}</h3>
                <p>{t('Candidates')}</p>
              </div>
            </Grid>
            <Grid item xs={6} md={3}>
              <div className={classes.statItem}>
                <h3>{stats.placements}</h3>
                <p>{t('Placements')}</p>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Öne Çıkan İlanlar */}
      <Container maxWidth="lg">
        <Typography variant="h5" className={classes.sectionTitle}>
          {t('Featured Job Postings')}
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <div className={classes.featuredGrid}>
              {jobs.slice(0, 5).map((job) => (
                <Paper 
                  key={job._id} 
                  className={classes.featuredCard}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                >
                  <img
                    src={job.company.logo || '/default-company-logo.png'}
                    alt={job.company.name}
                    className={classes.companyLogo}
                  />
                  <Typography className={classes.jobTitle}>
                    {job.title}
                  </Typography>
                  <Typography className={classes.companyName}>
                    {job.company.name}
                  </Typography>
                  <Typography className={classes.location}>
                    <LocationOn />
                    {job.location.city}
                  </Typography>
                </Paper>
              ))}
            </div>

            {/* Daha Fazla İlan Butonu */}
            <div className={classes.viewMoreContainer}>
              <Button
                variant="outlined"
                className={classes.viewMoreButton}
                onClick={() => navigate('/search')}
              >
                {t('View More Jobs')}
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  );
};

export default HomePage; 