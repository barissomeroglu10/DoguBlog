import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = AuthService.addAuthStateListener(async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const userDetails = await AuthService.getCurrentUserData();
          setUserData(userDetails);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data');
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const result = await AuthService.register(userData);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      const result = await AuthService.login(email, password);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await AuthService.loginWithGoogle();
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      const result = await AuthService.logout();
      setCurrentUser(null);
      setUserData(null);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setError(null);
      const result = await AuthService.resetPassword(email);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update profile function
  const updateProfile = async (updates) => {
    try {
      setError(null);
      const result = await AuthService.updateUserProfile(updates);
      
      // Refresh user data
      const updatedUserData = await AuthService.getCurrentUserData();
      setUserData(updatedUserData);
      
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Update password function
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      const result = await AuthService.updateUserPassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    currentUser,
    userData,
    loading,
    error,
    
    // Methods
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile,
    updatePassword,
    isAuthenticated,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 