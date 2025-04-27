import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const AuthContext = createContext();

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load role from session storage when app starts
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    if (storedRole) {
      setUserRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (role) => {
    setUserRole(role);
    setIsAuthenticated(true);
     // Optional: make sure it's stored
  };

  const logout = () => {
    setUserRole(null);
    setIsAuthenticated(false);
    sessionStorage.clear(); // Clear all session items
  };

  return (
    <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);
