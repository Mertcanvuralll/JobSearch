import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import Routes from './routes';
import Navbar from './components/Navbar';
import './i18n'; // i18n'i import et
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider 
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
          preventDuplicate
        >
          <Router>
            <Navbar />
            <Routes />
          </Router>
        </SnackbarProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App; 