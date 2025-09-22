import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        {children}
      </div>
      <Footer />
    </>
  );
}
