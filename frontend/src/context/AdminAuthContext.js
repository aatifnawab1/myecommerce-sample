import React, { createContext, useContext, useState, useEffect } from 'react';
import adminAPI from '../services/adminAPI';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const adminData = localStorage.getItem('admin_data');
    
    if (token && adminData) {
      setAdmin(JSON.parse(adminData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await adminAPI.login(username, password);
      const adminData = { id: response.id, username: response.username };
      setAdmin(adminData);
      localStorage.setItem('admin_data', JSON.stringify(adminData));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    adminAPI.logout();
    setAdmin(null);
    localStorage.removeItem('admin_data');
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};
