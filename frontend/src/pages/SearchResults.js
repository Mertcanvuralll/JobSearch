import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Chip,
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  InputLabel,
  InputAdornment,
  TextField,
} from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JobCard from '../components/JobCard';
import { searchJobs } from '../services/jobService';
import { useResponsiveStyles } from '../styles/responsive';
import api from '../services/api';
import {
  Sort as SortIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  LocationOn,
  Work,
  Timer,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalStyles } from '../styles/globalStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 64, // Navbar yüksekliği
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
  },
  container: {
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(4),
    },
  },
  filtersContainer: {
    position: 'sticky',
    top: '84px', // Navbar'dan sonraki mesafeyi artır
    maxHeight: 'calc(100vh - 100px)',
    overflowY: 'auto',
    [theme.breakpoints.down('sm')]: {
      position: 'static',
      maxHeight: 'none',
    },
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    },
  },
  searchBar: {
    marginBottom: theme.spacing(3),
  },
  jobList: {
    flex: 1,
  },
  filterPaper: {
    padding: theme.spacing(3), // Paper içi padding'i artır
    borderRadius: 8,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  filterSection: {
    marginBottom: theme.spacing(4), // Filtre bölümleri arası boşluğu artır
  },
  filterTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: theme.spacing(3), // Başlık ile filtreler arası boşluğu artır
    marginTop: theme.spacing(2), // Sıralama ile başlık arası boşluk ekle
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    '& .MuiSvgIcon-root': {
      fontSize: 20,
    },
  },
  filterLabel: {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2), // Label ile input arası boşluğu artır
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  searchField: {
    marginBottom: theme.spacing(3), // Arama alanı altındaki boşluğu artır
    '& .MuiInputBase-input': {
      fontSize: '0.9rem',
      padding: '10px 14px', // Input içi padding'i artır
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
    },
  },
  sortSelect: {
    marginBottom: theme.spacing(3), // Sıralama ile diğer filtreler arası boşluğu artır
    '& .MuiSelect-select': {
      fontSize: '0.9rem',
      padding: '10px 14px', // Select içi padding'i artır
    },
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(3),
  },
  chip: {
    height: 24,
    fontSize: '0.8rem',
  },
  checkboxGroup: {
    '& .MuiFormControlLabel-root': {
      marginBottom: theme.spacing(0.5),
    },
    '& .MuiFormControlLabel-label': {
      fontSize: '0.9rem',
    },
  },
  jobCard: {
    marginBottom: theme.spacing(2),
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
  },
  noResults: {
    padding: theme.spacing(3),
    textAlign: 'center',
    '& .MuiTypography-root': {
      fontSize: '0.95rem',
      color: theme.palette.text.secondary,
    },
  },
  filterItem: {
    marginBottom: theme.spacing(2.5), // Form elemanları arası boşluğu artır
    '& .MuiInputLabel-root': {
      fontSize: '0.9rem',
    },
    '& .MuiSelect-root': {
      fontSize: '0.9rem',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
    },
  },
  filterLoading: {
    position: 'absolute',
    right: theme.spacing(4),
    top: '50%',
    transform: 'translateY(-50%)',
  },
}));

const SearchResults = () => {
  const classes = useResponsiveStyles();
  const location = useLocation();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    city: '',
    town: '',
    workTypes: [],
    experience: []
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [towns, setTowns] = useState([]);
  const [loadingTowns, setLoadingTowns] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const globalClasses = useGlobalStyles();

  // URL'den arama parametrelerini al ve filtreleri güncelle
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchPosition = params.get('position');
    const searchCity = params.get('city');
    
    console.log('URL Params:', { searchPosition, searchCity });

    if (searchPosition !== filters.title || searchCity !== filters.city) {
      setFilters(prev => ({
        ...prev,
        title: searchPosition || '',
        city: searchCity || '',
        workTypes: [],
        experience: []
      }));
    }
  }, [location.search]); // filters.title ve filters.city dependency'lerini kaldırdık

  // Filtrelere göre iş ilanlarını getir
  useEffect(() => {
    let isActive = true; // Component unmount kontrolü için

    const fetchJobs = async () => {
      console.log('Fetching jobs with filters:', filters);
      setLoading(true);
      try {
        const isEmptySearch = !filters.title && 
                             !filters.city && 
                             filters.workTypes.length === 0 && 
                             filters.experience.length === 0;

        console.log('Is Empty Search:', isEmptySearch);

        const searchParams = {
          title: filters.title || '',
          city: filters.city || '',
          workTypes: filters.workTypes,
          experience: filters.experience,
          sort: sortBy,
          limit: isEmptySearch ? 50 : undefined
        };

        console.log('Search Params:', searchParams);

        const results = await searchJobs(searchParams);
        
        // Component hala mount edilmiş ise sonuçları güncelle
        if (isActive) {
          if (Array.isArray(results)) {
            setJobs(results);
          } else {
            console.warn('Results is not an array:', results);
            setJobs([]);
          }
        }
      } catch (error) {
        console.error('İş ilanları yüklenirken hata:', error);
        if (isActive) {
          setJobs([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    // Cleanup function
    return () => {
      isActive = false;
    };
  }, [filters, sortBy]); // Sadece filters ve sortBy değiştiğinde çalışsın

  // Aktif filtreleri güncelle
  useEffect(() => {
    const newActiveFilters = [];
    if (filters.title) {
      newActiveFilters.push({ key: 'title', label: filters.title });
    }
    if (filters.city) {
      newActiveFilters.push({ key: 'city', label: filters.city });
    }
    filters.workTypes.forEach(type => {
      newActiveFilters.push({ key: 'workType', label: type });
    });
    filters.experience.forEach(exp => {
      newActiveFilters.push({ key: 'experience', label: exp });
    });
    setActiveFilters(newActiveFilters);
  }, [filters]);

  // Filtre seçeneklerini yükle
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [workTypesRes, experienceLevelsRes] = await Promise.all([
          api.get('/jobs/work-types'),
          api.get('/jobs/experience-levels')
        ]);
        setWorkTypes(workTypesRes.data);
        setExperienceLevels(experienceLevelsRes.data);
      } catch (error) {
        console.error('Filtre seçenekleri yüklenirken hata:', error);
      } finally {
        setLoadingFilters(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Ülke listesi yerine şehir listesi yükleme
  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true);
        const response = await api.get('/jobs/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Şehir listesi yüklenirken hata:', error);
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, []);

  // İlçeleri yükle
  useEffect(() => {
    const loadTowns = async () => {
      if (!selectedCity) {
        setTowns([]);
        setLoadingTowns(false);
        return;
      }

      try {
        setLoadingTowns(true);
        const response = await api.get(`/jobs/towns?city=${selectedCity}`);
        setTowns(response.data);
      } catch (error) {
        console.error('İlçeler yüklenirken hata:', error);
      } finally {
        setLoadingTowns(false);
      }
    };

    loadTowns();
  }, [selectedCity]);

  // Filtre değişikliklerini yönet
  const handleFilterChange = (type, value) => {
    console.log('Filter change:', type, value);
    
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [type]: Array.isArray(prev[type]) 
          ? (prev[type].includes(value) 
            ? prev[type].filter(item => item !== value) 
            : [...prev[type], value])
          : value
      };
      console.log('New filters:', newFilters);
      return newFilters;
    });
  };

  // Şehir değişikliğini yönet
  const handleCityChange = (city) => {
    console.log('City change:', city);
    setSelectedCity(city);
    setFilters(prev => ({
      ...prev,
      city,
      town: '' // Şehir değiştiğinde ilçeyi sıfırla
    }));
  };

  // Arama alanı için state'ler
  const [searchText, setSearchText] = useState(filters.title || '');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Arama alanı için debounce fonksiyonu
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    
    // Önceki timeout'u temizle
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // 1 saniye boyunca yazma durduğunda arama yap
    const timeoutId = setTimeout(() => {
      handleFilterChange('title', value);
    }, 1000);

    setSearchTimeout(timeoutId);
  };

  // Enter tuşuna basıldığında hemen arama yap
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      handleFilterChange('title', searchText);
    }
  };

  // Sıralama seçenekleri
  const sortOptions = [
    { value: 'newest', label: t('Newest First') },
    { value: 'oldest', label: t('Oldest First') },
    { value: 'relevant', label: t('Most Relevant') },
  ];

  return (
    <div className={globalClasses.pageContainer}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Filtreler */}
          <Grid item xs={12} md={3}>
            <div className={classes.filtersContainer}>
              <Paper className={classes.filterPaper}>
                {/* Sıralama */}
                <FormControl fullWidth variant="outlined" className={classes.sortSelect}>
                  <InputLabel>{t('Sort By')}</InputLabel>
                  <Select
                    value={sortBy || ''}
                    onChange={(e) => setSortBy(e.target.value)}
                    label={t('Sort By')}
                    startAdornment={
                      <InputAdornment position="start">
                        <SortIcon />
                      </InputAdornment>
                    }
                  >
                    {sortOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className={classes.filterTitle}>
                  <FilterIcon />
                  <Typography variant="h6">{t('Filters')}</Typography>
                </div>

                {/* Arama Filtresi */}
                <div className={classes.filterSection}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    placeholder={t('Search job titles')}
                    className={classes.searchField}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Lokasyon Filtresi */}
                <div className={classes.filterSection}>
                  <div className={classes.filterLabel}>
                    <LocationOn />
                    <Typography variant="subtitle1">{t('Location')}</Typography>
                  </div>
                  
                  {/* Ülke Seçimi */}
                  <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small" 
                    className={classes.filterItem}
                  >
                    <InputLabel>{t('Country')}</InputLabel>
                    <Select
                      value="Türkiye"
                      disabled={true}
                      label={t('Country')}
                    >
                      <MenuItem value="Türkiye">Türkiye</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Şehir Seçimi */}
                  <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small" 
                    className={classes.filterItem}
                  >
                    <InputLabel>{t('City')}</InputLabel>
                    <Select
                      value={filters.city || ''}
                      onChange={(e) => handleCityChange(e.target.value)}
                      disabled={loadingCities}
                      label={t('City')}
                    >
                      <MenuItem value="">
                        <em>{t('All Cities')}</em>
                      </MenuItem>
                      {cities.map(city => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingCities && (
                      <CircularProgress 
                        size={20} 
                        className={classes.filterLoading}
                      />
                    )}
                  </FormControl>

                  {/* İlçe Seçimi */}
                  <FormControl 
                    fullWidth 
                    variant="outlined" 
                    size="small" 
                    className={classes.filterItem}
                    disabled={!selectedCity || loadingTowns}
                  >
                    <InputLabel>{t('Town')}</InputLabel>
                    <Select
                      value={filters.town || ''}
                      onChange={(e) => handleFilterChange('town', e.target.value)}
                      label={t('Town')}
                    >
                      <MenuItem value="">
                        <em>{t('All Towns')}</em>
                      </MenuItem>
                      {towns.map(town => (
                        <MenuItem key={town} value={town}>
                          {town}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingTowns && (
                      <CircularProgress 
                        size={20} 
                        className={classes.filterLoading}
                      />
                    )}
                  </FormControl>
                </div>

                {/* Çalışma Tipi Filtresi */}
                <div className={classes.filterSection}>
                  <div className={classes.filterLabel}>
                    <Work />
                    <Typography variant="subtitle1">{t('Work Type')}</Typography>
                  </div>
                  <FormGroup className={classes.checkboxGroup}>
                    {loadingFilters ? (
                      <CircularProgress size={20} />
                    ) : (
                      workTypes.map((type) => (
                        <FormControlLabel
                          key={type}
                          control={
                            <Checkbox
                              checked={filters.workTypes.includes(type)}
                              onChange={() => handleFilterChange('workTypes', type)}
                              color="primary"
                            />
                          }
                          label={type}
                        />
                      ))
                    )}
                  </FormGroup>
                </div>

                {/* Deneyim Filtresi */}
                <div className={classes.filterSection}>
                  <div className={classes.filterLabel}>
                    <Timer />
                    <Typography variant="subtitle1">{t('Experience')}</Typography>
                  </div>
                  <FormGroup className={classes.checkboxGroup}>
                    {loadingFilters ? (
                      <CircularProgress size={20} />
                    ) : (
                      experienceLevels.map((exp) => (
                        <FormControlLabel
                          key={exp}
                          control={
                            <Checkbox
                              checked={filters.experience.includes(exp)}
                              onChange={() => handleFilterChange('experience', exp)}
                              color="primary"
                            />
                          }
                          label={exp}
                        />
                      ))
                    )}
                  </FormGroup>
                </div>
              </Paper>
            </div>
          </Grid>

          {/* İş İlanları Listesi */}
          <Grid item xs={12} md={9}>
            {loading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : jobs.length === 0 ? (
              <Paper className={classes.noResults}>
                <Typography variant="h6">
                  {t('No jobs found matching your criteria')}
                </Typography>
              </Paper>
            ) : (
              <div className={classes.jobList}>
                {jobs.map((job) => (
                  <Paper key={job._id} className={classes.jobCard}>
                    <JobCard job={job} />
                  </Paper>
                ))}
              </div>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default SearchResults; 