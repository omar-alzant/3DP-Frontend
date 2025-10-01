import React from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';


export default function MainLayout({ children }) {
  return (
    <div className="app-shell">
      <span className='header-banner'> This Website is under development, some features may not work as expected.</span>
      <Navbar />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  );
}
