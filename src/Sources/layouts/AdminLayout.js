import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../Style/AdminLayout.css"; // 👈 إضافة ملف CSS

function AdminLayout() {
  const location = useLocation();
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <h2 className="admin-title">⚙️ الإدارة</h2>
        <Link to="materials" className={`admin-link ${location.pathname.includes("materials") ? "active-materials" : ""}`}>
          العناصر
        </Link>
        <Link to="benefits" className={`admin-link ${location.pathname.includes("benefits") ? "active-benefits" : ""}`}>
          الفوائد
        </Link>
      </div>
  
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
  
  }

export default AdminLayout;
