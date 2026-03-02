import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { getImageUrl, generateFavicon } from '../utils/imageUtils';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [publicProfile, setPublicProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicProfile = async () => {
    try {
      const { data } = await authService.getPublicProfile();
      if (data.success) {
        setPublicProfile(data.data);
      }
    } catch (err) {
      console.error("Error fetching public profile", err);
    }
  };

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await authService.getMe();
        if (data.success) {
          setUser(data.data);
          localStorage.setItem('user', JSON.stringify(data.data));
        }
      } catch (err) {
        console.error("Error fetching user", err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
    fetchPublicProfile();
  }, []);

  useEffect(() => {
    const activeProfile = user || publicProfile;
    if (activeProfile) {
      document.title = activeProfile.company || 'EstateHub';
      if (activeProfile.companyLogo) {
        const logoUrl = getImageUrl(activeProfile.companyLogo);
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        // Generate the favicon with the dark box background
        generateFavicon(logoUrl)
          .then(dataUrl => {
            link.href = dataUrl;
          })
          .catch(err => {
            console.error("Failed to generate favicon", err);
            link.href = logoUrl; // Fallback to raw image if canvas fails
          });
      }
    } else {
      document.title = 'EstateHub';
      let link = document.querySelector("link[rel~='icon']");
      if (link) link.href = '/vite.svg'; // Default Vite icon
    }
  }, [user, publicProfile]);

  const login = async (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    await fetchUser();
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, publicProfile, setPublicProfile, loading, login, logout, fetchUser, fetchPublicProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
