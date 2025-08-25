import React from 'react';
import Navbar from '../components/navbar';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </>
  );
}
