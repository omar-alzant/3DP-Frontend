// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import LogoutButton from './Logout';
import { NavLink } from "react-router-dom";
// import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../context/CartContext'; // 👈 import cart context
import '../Style/navbar.css';

const Navbar = () => {
  const token  = sessionStorage.getItem("token");
  let decoded = "";
  let isAdmin = false;
  const [benefits, setBenefits] = useState([]);
  const [current, setCurrent] = useState(0); // الفائدة الحالية
  const [expanded, setExpanded] = useState(false); // 👈 new state

  useEffect(() => {
    // Check if data already exists in localStorage
    const storedBenefits = localStorage.getItem("benefits");
    if (storedBenefits) {
      // Parse and set state from localStorage
      setBenefits(JSON.parse(storedBenefits));
    } else {
      // Fetch from API if not in localStorage
      fetch("http://localhost:3001/benefits")
        .then((res) => res.json())
        .then((data) => {
          setBenefits(data);
          localStorage.setItem("benefits", JSON.stringify(data)); // Save to localStorage
        })
        .catch((err) => console.error("Error fetching benefits:", err));
    }
  }, []);
  const nextBenefit = () => {
    setCurrent((prev) => (prev + 1) % benefits.length);
  };

  const prevBenefit = () => {
    setCurrent((prev) => (prev - 1 + benefits.length) % benefits.length);
  };
  if(token){
    decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;    
  }
  
  const { cart } = useCart();       // 👈 get cart items
  const totalItems = cart.length;   // if you want quantities: cart.reduce((sum,i)=>sum+i.quantity,0)

  return (
  <nav className="nav-container">
    <div className="navbar">
      <div className="nav-links">
        <h2 className="logo">3D Studio</h2>
      </div>

    <ul className="nav-links">
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          الرئيسية
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/upload" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          رفع ملف
        </NavLink>
      </li>

      <li>
        <NavLink 
          to="/OpenAIGenerator" 
          className={({ isActive }) => isActive ? "active-link" : ""}
        >
          إنشاء تصاميم
        </NavLink>
      </li>

      {isAdmin && (
        <li>
          <NavLink 
            to="/admin" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            الإدارة
          </NavLink>
        </li>
      )}

      <li>
        <NavLink 
          to="/cart" 
          className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
          style={{ position: 'relative' }}
        >
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          الصندوق
        </NavLink>
      </li>

      <li>
        <LogoutButton />
      </li>

      <li>
        <button 
          className="expand-btn" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "إخفاء الفوائد ⬆" : "عرض الفوائد ⬇"}
        </button>
      </li>
    </ul>
  </div>

    <div className="benefits">
      {(benefits !== null && expanded) && 
      (
        <div className="benefits-section">
        <button className="slider-btn left" onClick={prevBenefit}>⬅</button>
        {benefits.map((b, i) => (
          <div key={i} className="benefit-card">
            <img src={`${b.Image}`} alt={b.Title} className="benefit-image" />
            <h3 className="benefit-title">{b.Title}</h3>
            <p className="benefit-text">{b.Details}</p>
          </div>
        ))}
          <button className="slider-btn right" onClick={nextBenefit}>➡</button>
        </div>
      )}
    </div>  
</nav>
  );
};

export default Navbar;
