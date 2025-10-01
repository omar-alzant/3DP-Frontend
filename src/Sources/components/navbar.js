import React, { useEffect, useState, useRef } from "react";
import LogoutButton from './Logout';
import { NavLink } from "react-router-dom";
import { useCart } from '../context/CartContext'; // 👈 import cart context
import { jwtDecode } from 'jwt-decode';
import '../Style/navbar.css';
import { useFrame } from "@react-three/fiber";
import { ReactComponent as Logo } from '../../logo.svg';
import { ReactComponent as LogoMini } from '../../logo-mini.svg';
// import { OrbitControls, useGLTF } from "@react-three/drei";
// import { Canvas } from "@react-three/fiber";


// function Logo({ rotationSpeed = 0.004, color = "white" }) {
//   const { scene } = useGLTF("/logo.gltf");
//   const ref = useRef();

//   // Rotate every frame
//   useFrame(() => {
//     if (ref.current) {
//       ref.current.rotation.y += rotationSpeed; // rotate around Y axis
//       // ref.current.rotation.x += 0.01; // X axis
//       // ref.current.rotation.z += 0.01; // Z axis
//     }
//   });
//   scene.traverse((child) => {
//     if (child.isMesh) {
//       child.material.color.set(color);
//     }
//   });

//   return <primitive ref={ref} object={scene} scale={1} />;
// }

const Navbar = () => {
  let decoded = "";
  let isAdmin = false;
  const [expandedBenefits, setExpandedBenefits] = useState(false); // 👈 new state
  const [Expand, setExpand] = useState(true); // 👈 new state
  const [token] = useState(sessionStorage.getItem("token") || ""); // 👈 new state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [stuck, setStuck] = useState(true); // 👈 sticky state
  const footerRef = useRef(document.querySelector("footer"));

  useEffect(() => {  
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1200);
    };
  
    window.addEventListener("resize", handleResize);

    // ✅ Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [token]);
  
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setStuck(false); // footer visible → release navbar
        } else {
          setStuck(true); // footer hidden → keep navbar sticky
        }
      },
      { root: null, threshold: 0.75 }
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  if(token){
    decoded = jwtDecode(token);
    isAdmin = decoded.isAdmin;    
  }

  const benefitsEvent = () => {
    setExpandedBenefits(!expandedBenefits);
  }

  const { cart } = useCart();       // 👈 get cart items
  const totalItems = cart.length;   // if you want quantities: cart.reduce((sum,i)=>sum+i.quantity,0)
  const collapseNavBar = () => {     
    if (isMobile) {
      setExpand(false)
    }
  } 
  return (
    <nav className={`nav-container ${stuck ? "sticky" : "not-sticky"}`}>
    {
      Expand &&
      <>
        <div className="navbar">
          {/* <div>
            <Canvas style={{ height: "90px"}} camera={{ position: [5, 5, 10] }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[10, 2, 2]} />
              <Logo />
              <OrbitControls />
            </Canvas>
          </div> */}
          {/* <div> */}

          {/* </div> */}
        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              // onClick={collapseNavBar}
           >
              الرئيسية
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/shop" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              // onClick={collapseNavBar}
           >
              المتجر 
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/upload" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              // onClick={collapseNavBar}

            >
              رفع ملف
            </NavLink>
          </li>

          <li>
            <NavLink 
              to="/OpenAIGenerator" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              // onClick={collapseNavBar}

            >
              إنشاء تصاميم
            </NavLink>
          </li>

          {isAdmin && (
            <li>
              <NavLink 
                to="/admin" 
                className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
                // onClick={collapseNavBar}

              >
                الإدارة
              </NavLink>
            </li>
          )}

          <li>
            <NavLink 
              to="/cart" 
              className={({ isActive }) => isActive ? "active-link nav-link" : "nav-link"}
              // onClick={collapseNavBar}
              style={{ position: 'relative' }}
            >
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              الصندوق
            </NavLink>
          </li>

          <li>
            <LogoutButton />
          </li> 
        </ul>
        {!isMobile && <Logo className="logo-svg" />}
        </div>
      
      </>
    }
    <div className="btn-expand-nav">
      <button className="btn-expand" onClick={() => {setExpand(!Expand)}}>
        <LogoMini className="logo-svg" />
      </button>
    </div>
</nav>
  );
};

export default Navbar;
