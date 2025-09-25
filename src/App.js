import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './Sources/context/AuthContext';
import { BrowserRouter } from "react-router-dom";

export default function App() {
  useEffect(() => {
    const token = window.sessionStorage.getItem("token")
    const email = sessionStorage.getItem("email")?.replace(/^"|"$/g, '');
    if(!token && email) { handleLogout()}
  }, []);

  const handleLogout = async () => {
    try {
        const email = sessionStorage.getItem("email")?.replace(/^"|"$/g, '');
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${process.env.REACT_APP_API_URL}/supabase/logout`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'            },
            // If you need to send cookies/session info, include credentials
            body: JSON.stringify({ email, token}), // ✅ stringify
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logout failed');
      }
      else{
        localStorage.clear();
        sessionStorage.clear(); 
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        <AppRoutes />
      {/* </AuthProvider> */}
    </BrowserRouter>

  );
}
