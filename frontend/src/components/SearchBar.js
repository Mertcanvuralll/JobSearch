import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  CircularProgress,
  Paper,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';
import { POSITIONS, CITIES } from '../constants'; // Frontend'de de bir constants.js oluşturacağız
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    backgroundColor: '#fff',
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  gridContainer: {
    backgroundColor: '#fff',
  },
  autocomplete: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      '&:hover': {
        backgroundColor: '#fff',
      },
      '&.Mui-focused': {
        backgroundColor: '#fff',
      },
    },
  },
  searchButton: {
    height: '100%',
    minHeight: '56px', // TextField ile aynı yükseklikte olması için
  },
}));

const SearchBar = ({ onSearch }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  
  const [position, setPosition] = useState('');
  const [city, setCity] = useState('');
  const [filteredPositions, setFilteredPositions] = useState(POSITIONS);
  const [filteredCities, setFilteredCities] = useState(CITIES);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  // Pozisyonları filtrele - sadece baştan eşleşenleri göster
  const filterPositions = (searchText = '') => {
    const filtered = POSITIONS.filter(pos => 
      pos.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredPositions(filtered);
  };

  // Şehirleri filtrele - sadece baştan eşleşenleri göster
  const filterCities = (searchText = '') => {
    const filtered = CITIES.filter(city => 
      city.toLowerCase().startsWith(searchText.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Search triggered with:', { position, city });

    try {
      setLoading(true);
      
      // URL'i güncelle
      const searchQuery = new URLSearchParams();
      searchQuery.append('position', position || '');
      searchQuery.append('city', city || '');
      
      // Sadece URL'i güncelle, onSearch'i kaldır
      navigate(`/search?${searchQuery.toString()}`);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className={classes.searchContainer} elevation={1}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={12} md={5}>
            <Autocomplete
              freeSolo
              options={filteredPositions}
              value={position}
              onChange={(_, newValue) => setPosition(newValue)}
              onInputChange={(_, newInputValue) => {
                filterPositions(newInputValue);
              }}
              className={classes.autocomplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('Position')}
                  variant="outlined"
                  fullWidth
                  placeholder={t('Search positions')}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Autocomplete
              freeSolo
              options={filteredCities}
              value={city}
              onChange={(_, newValue) => setCity(newValue)}
              onInputChange={(_, newInputValue) => {
                filterCities(newInputValue);
              }}
              className={classes.autocomplete}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('City')}
                  variant="outlined"
                  fullWidth
                  placeholder={t('Select city')}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className={classes.searchButton}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : t('Search')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default SearchBar; 