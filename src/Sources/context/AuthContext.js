import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [email, setemail] = useState(null);
  const [IsAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('token') || "");

  const navigate = useNavigate();
  const saveToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem('token', newToken);
  };

  useEffect(() => {
    // Retrieve user from sessionStorage
    const storedEmail = sessionStorage.getItem("email");
    setIsAdmin(sessionStorage.getItem("email"));

  
    if (storedEmail) {
      try {
        setemail(storedEmail); // parse JSON string to object
      } catch (error) {
        console.error("Failed to parse user from sessionStorage", error);
        setemail(null);
      }
    } else {
      setemail(null);
      navigate('/login'); 
    }

    setLoading(false); // done loading after this
  }, []);

  return (
    <AuthContext.Provider value={{ email, loading, setemail, IsAdmin, setIsAdmin, token, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
