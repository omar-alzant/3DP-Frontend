// src/components/Navbar.js
import React, { useEffect, useState, useRef } from "react";
import LogoutButton from './Logout';
import { NavLink } from "react-router-dom";
// import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../context/CartContext'; // 👈 import cart context
import '../Style/navbar.css';
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";


function Logo({ rotationSpeed = 0.004, color = "white" }) {
  const { scene } = useGLTF("/logo.gltf");
  const ref = useRef();

  // Rotate every frame
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed; // rotate around Y axis
      // ref.current.rotation.x += 0.01; // X axis
      // ref.current.rotation.z += 0.01; // Z axis
    }
  });
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.color.set(color);
    }
  });

  return <primitive ref={ref} object={scene} scale={1} />;
}

const Navbar = () => {
  let decoded = "";
  let isAdmin = false;
  const [benefits, setBenefits] = useState([]);
  const [expanded, setExpanded] = useState(false); // 👈 new state
  const [Expand, setExpand] = useState(true); // 👈 new state
  const [token] = useState(sessionStorage.getItem("token") || ""); // 👈 new state
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        setBenefits(data);
        localStorage.setItem("benefits", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching benefits:", err);
      }
    };
  
    const stored = localStorage.getItem("benefits");
    if (stored) setBenefits(JSON.parse(stored));
    else if (token) fetchBenefits();
  }, [token]); // ✅ no ESLint warning now
  
  if(token){
    decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;    
  }


  const { cart } = useCart();       // 👈 get cart items
  const totalItems = cart.length;   // if you want quantities: cart.reduce((sum,i)=>sum+i.quantity,0)
  const collapseNavBar = () => { setExpand(false)} 
  return (
  <nav className="nav-container">
    {
      Expand &&
      <>
        <div className="navbar">
          <div>
            <Canvas style={{ height: "90px"}} camera={{ position: [5, 5, 10] }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[10, 2, 2]} />
              <Logo />
              <OrbitControls />
            </Canvas>
          </div>
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active-link" : ""}
            onClick={collapseNavBar}
           >
              الرئيسية
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/upload" 
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={collapseNavBar}

            >
              رفع ملف
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/OpenAIGenerator" 
              className={({ isActive }) => isActive ? "active-link" : ""}
              onClick={collapseNavBar}

            >
              إنشاء تصاميم
            </NavLink>
          </li>

          {isAdmin && (
            <li>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => isActive ? "active-link" : ""}
                onClick={collapseNavBar}

              >
                الإدارة
              </NavLink>
            </li>
          )}

          <li>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              onClick={collapseNavBar}
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


        <div className="benefits" >
          {(Array.isArray(benefits) && expanded) && 
          (
            <div className="benefits-section" ref={scrollRef}>
            {/* <button className="slider-btn left" onClick={prevBenefit}>⬅</button> */}
            {benefits.map((b, i) => (
              b.display && 
              <div key={i} className="benefit-card">
                {b.Image ?
                  <img src={b.Image} alt={b.Title} className="benefit-image" />
                  :
                  <img src={"/favicon.jpg"} alt={b.Title} className="benefit-image" />
                }
                <h3 className="benefit-title">{b.Title}</h3>
                <p className="benefit-text">{b.Details}</p>
              </div>
            ))}
              {/* <button className="slider-btn right" onClick={nextBenefit}>➡</button> */}
            </div>
          )}
        </div>  
      </>
    }
    <button className="btn-expand" onClick={() => {setExpand(!Expand)}}>
      ☰
    </button>
</nav>
  );
};

export default Navbar;
