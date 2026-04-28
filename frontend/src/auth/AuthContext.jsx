import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const STORAGE_KEY = 'xen_admin_token';

const AuthContext = createContext(null);

// Axios interceptor: inject Bearer token if present, unwrap 401 to trigger logout
axios.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith(BACKEND_URL)) {
    const token = localStorage.getItem(STORAGE_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('checking'); // checking | authenticated | anonymous

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setStatus('anonymous');
      setUser(null);
      return;
    }
    try {
      const { data } = await axios.get(`${API}/auth/me`);
      setUser(data);
      setStatus('authenticated');
    } catch (e) {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      setStatus('anonymous');
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem(STORAGE_KEY, data.access_token);
    setUser(data.user);
    setStatus('authenticated');
    return data.user;
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (e) {
      // ignore logout errors; clear locally anyway
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setStatus('anonymous');
  };

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refresh: checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
