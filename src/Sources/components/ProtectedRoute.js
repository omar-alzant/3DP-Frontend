import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { email, loading } = useAuth();

  if (loading) return <p>Loading...</p>;  
  if (!email) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
