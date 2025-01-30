import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Select,
  MenuItem,
  Container,
  useMediaQuery,
  IconButton,
  Menu,
  Avatar,
  Divider,
  Box,
  FormControl,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { Link as RouterLink } from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: 'none',
    height: '64px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
  },
  logo: {
    fontSize: '1.25rem',
    marginRight: theme.spacing(2),
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0),
    minHeight: '64px',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    '& .MuiTypography-root': {
      fontSize: '24px',
      fontWeight: 600,
      color: '#7E57C2',
    },
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
  },
  languageSelect: {
    minWidth: 100,
    marginRight: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      height: '48px',
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#7E57C2',
      },
    },
    '& .MuiSelect-select': {
      fontSize: '0.9rem',
      padding: '6px 32px 6px 12px',
    },
  },
  avatar: {
    width: 35,
    height: 35,
    cursor: 'pointer',
    border: '2px solid #7E57C2',
  },
  userMenu: {
    marginTop: theme.spacing(4),
  },
  menuDivider: {
    margin: theme.spacing(1, 0),
  },
  mobileMenu: {
    '& .MuiPaper-root': {
      width: '100%',
      maxWidth: 300,
      marginTop: theme.spacing(4),
    },
  },
  authButtons: {
    display: 'flex',
    gap: theme.spacing(2),
  },
  authButton: {
    textTransform: 'none',
    whiteSpace: 'nowrap',
    height: '48px',
    fontSize: '16px',
    fontWeight: 500,
    padding: '0 32px',
    borderRadius: '4px',
    backgroundColor: '#7E57C2',
    color: '#fff',
    minWidth: '160px',
    '&:hover': {
      backgroundColor: '#6A45B9',
    },
  },
  smallAvatar: {
    width: 28,
    height: 28,
    border: `2px solid ${theme.palette.primary.main}`,
  },
  centerSection: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  userButton: {
    textTransform: 'none',
    whiteSpace: 'nowrap',
    height: '48px',
    fontSize: '16px',
    padding: '0 28px',
    borderRadius: '4px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    minWidth: '160px',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  button: {
    padding: '6px 16px',
    fontSize: '0.9rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  userAvatar: {
    width: 40,
    height: 40,
    marginRight: theme.spacing(1),
    border: `2px solid ${theme.palette.primary.main}`,
  },
  userName: {
    marginRight: theme.spacing(1),
    fontWeight: 500,
    color: theme.palette.text.primary,
    fontSize: '1rem',
  },
  userMenu: {
    marginTop: theme.spacing(1),
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' }
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const loading = false;

  const handleLanguageChange = (event) => {
    const langCode = event.target.value;
    i18n.changeLanguage(langCode);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    handleUserMenuClose();
  };

  const renderAuthButton = () => {
    if (loading) {
      return <CircularProgress size={24} color="inherit" />;
    }

    if (user) {
      return (
        <>
          <div 
            className={classes.userSection}
            onClick={handleUserMenuClick}
          >
            <Avatar 
              src={user.photo && (
                user.photo.startsWith('http') 
                  ? user.photo // Google fotoğrafı ise direkt kullan
                  : `${process.env.REACT_APP_API_URL}${user.photo}` // Yüklenen fotoğraf ise
              )}
              alt={user.name}
              className={classes.userAvatar}
            >
              {!user.photo && user.name.charAt(0)}
            </Avatar>
            <Typography 
              variant="body1" 
              className={classes.userName}
              color="textPrimary"
            >
              {user.name}
            </Typography>
          </div>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            className={classes.userMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            getContentAnchorEl={null}
          >
            <MenuItem onClick={handleLogout}>
              {t('Çıkış Yap')}
            </MenuItem>
          </Menu>
        </>
      );
    }

    return (
      <Button
        component={RouterLink}
        to="/login"
        className={classes.authButton}
      >
        {t('Login/Register')}
      </Button>
    );
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Container maxWidth="lg">
        <Toolbar className={classes.toolbar}>
          <div className={classes.leftSection}>
            <Typography 
              variant="h6" 
              color="primary"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              JobSearch
            </Typography>
          </div>

          <div className={classes.rightSection}>
            <FormControl className={classes.languageSelect}>
              <Select
                value={i18n.language || 'tr'}
                onChange={handleLanguageChange}
                variant="outlined"
                fullWidth
              >
                {languages.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isMobile && renderAuthButton()}
            
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
          </div>

          {isMobile && (
            <Menu
              anchorEl={mobileMenuAnchor}
              keepMounted
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
              className={classes.mobileMenu}
            >
              {isHomePage && (
                <>
                  <MenuItem>
                    <Select
                      value={i18n.language || 'tr'}
                      onChange={handleLanguageChange}
                      variant="outlined"
                      fullWidth
                    >
                      {languages.map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </MenuItem>
                  <Divider component="div" />
                </>
              )}
              {user ? (
                <>
                  <MenuItem key="profile" onClick={() => navigate('/profile')}>
                    {t('Profile')}
                  </MenuItem>
                  <Divider component="div" />
                  <MenuItem key="logout" onClick={handleLogout}>
                    {t('Logout')}
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={() => navigate('/login')}>
                    {t('Login')}
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/register')}>
                    {t('Register')}
                  </MenuItem>
                </>
              )}
            </Menu>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 