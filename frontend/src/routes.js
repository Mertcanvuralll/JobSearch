import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import SearchResults from './pages/SearchResults';
import AuthCallback from './pages/AuthCallback';

const AppRoutes = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </GoogleOAuthProvider>
  );
};

export default AppRoutes; 