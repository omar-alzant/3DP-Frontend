import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [email, setemail] = useState(null);
  const [IsAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('token') || "");
  const navigate = useNavigate();
  const location = useLocation();

  const saveToken = (newToken) => {
    setToken(newToken);
    sessionStorage.setItem('token', newToken);
  };

  // ✅ Centralized register
  // AuthContext.jsx
  const registerUser = async (email, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/supabase/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok || data.error) throw new Error(data.error || "Registration failed");
  
      // Optionally navigate user after success
      navigate('/login');
  
      return { success: true, message: "Check your email to confirm your account!" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };  

  // ✅ Centralized forgot password
  const resetPasswordRequest = async (email) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset request failed");
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ✅ Centralized update password
  const updatePassword = async (token, newPassword) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password update failed");
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    setIsAdmin(Boolean(storedEmail));
    setemail(storedEmail || null);

const publicRoutes = [
  '/', 
  '/shop',
  '/login', 
  '/register', 
  '/forgot-password', 
  '/update-password'
];

    // if (!storedEmail && !publicRoutes.includes(location.pathname)) {
    if (!publicRoutes.includes(location.pathname)) {
      navigate('/'); // ✅ only redirect if on a protected page
    }

    setLoading(false);
  }, [navigate, location]);

  return (
    <AuthContext.Provider
    value={{
      email,
      loading,
      setemail,
      IsAdmin,
      setIsAdmin,
      token,
      saveToken,
      registerUser, // ✅ now exposed to components
      resetPasswordRequest,
      updatePassword
    }}
  >
    {children}
  </AuthContext.Provider>
  
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
