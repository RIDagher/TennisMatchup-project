import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // Set token to both state and local storage
  const saveToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
  };

  // Clear token from both state and local storage
  const clearToken = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userDetails,
        setUserDetails,
        token,
        saveToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
