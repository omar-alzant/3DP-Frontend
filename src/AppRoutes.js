import React from 'react';
import { Navigate } from "react-router-dom";
import { Routes, Route } from 'react-router-dom';
import MainLayout from './Sources/layouts/MainLayout';
import AuthLayout from './Sources/layouts/AuthLayout';

import Home from './Sources/Pages/Home';
import Upload from './Sources/Pages/Upload';
// import ThreeDViewer from './Sources/Pages/ThreeDViewer';
import OpenAI from './Sources/Pages/MeshyGenerator';
import Login from './Sources/Pages/Login';
import Register from './Sources/Pages/Register';
import ForgotPassword from './Sources/Pages/ForgotPassword';
import UpdatePassword from './Sources/Pages/UpdatePassword';
import AdminMaterials from './Sources/Pages/AdminMaterials';
import AdminBenefits from './Sources/Pages/AdminBenefits';
import AdminLayout from './Sources/layouts/AdminLayout';

import CartPage from "./Sources/Pages/CartPage";
import { CartProvider } from "./Sources/context/CartContext";
import AdminHome from './Sources/Pages/AdminHome';
import Shop from './Sources/Pages/Shop';
import AdminShop from './Sources/Pages/AdminShop';

export default function AppRoutes() {

  return (
    <CartProvider>
      <Routes>
        {/* Auth Pages without Navbar */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
        <Route path="/update-password" element={<AuthLayout><UpdatePassword /></AuthLayout>} />

        {/* Main Pages with Navbar */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/viewer" element={<MainLayout><Upload /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><Shop /></MainLayout>} />
        <Route path="/Upload" element={<MainLayout><Upload /></MainLayout>} />
        <Route path="/OpenAIGenerator" element={<MainLayout><OpenAI /></MainLayout>} />
        
        <Route path="admin" element={<MainLayout><AdminLayout /></MainLayout>} >
          <Route index element={<Navigate to="materials" replace />} />
          <Route path="materials" element={<AdminMaterials />} />
          <Route path="benefits" element={<AdminBenefits />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="shop" element={<AdminShop />} />
        </Route>
        
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
      </Routes>
    </CartProvider>
  );
}
