import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Grid, Typography } from '@material-ui/core';
import { useLocation, useNavigate } from 'react-router-dom';
import JobList from './JobList';
import { searchJobs } from '../services/jobService';

const HomePage = () => {
  const [position, setPosition] = useState('');
  const [city, setCity] = useState('');
  const [jobs, setJobs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Tarayıcı konumunu al ve şehri otomatik doldur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        // Koordinatları şehir adına çevir ve state'i güncelle
      });
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    console.log('Searching with:', { position, city });
    
    const params = new URLSearchParams();
    if (position.trim()) {
      params.append('position', position.trim());
    }
    if (city.trim()) {
      params.append('city', city.trim());
    }

    console.log('Search URL:', `/search?${params.toString()}`);
    
    navigate({
      pathname: '/search',
      search: params.toString()
    });
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1">
            İş Fırsatlarını Keşfet
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Pozisyon"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Örn: Backend Developer"
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Şehir"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Örn: Ankara"
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  İş Bul
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
        <Grid item xs={12}>
          <JobList jobs={jobs} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage; 