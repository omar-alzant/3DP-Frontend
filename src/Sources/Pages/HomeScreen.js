import PreviewCard from "../components/PreviewCard";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from '../../logo.svg';
import '../Style/Home.css'; 
import React, { useEffect, useState, useRef } from "react";

export default function HomeScreen() {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {  
    const fetchBenefits = async () => {
      console.log("fetching benefits...");
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`
    );
        const data = await res.json();
        setBenefits(data);
        console.log(data);
        localStorage.setItem("benefits", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching benefits:", err);
      }
    };
    
    // ✅ Load from storage or fetch
    const stored = localStorage.getItem("benefits");
    if (stored) {
      setBenefits(JSON.parse(stored));
    } else {
      fetchBenefits();
    }
}, []);

  return (
    <div className="home-screen-container">
        <div className="home-screen-part1">
            <h2> حول افكارك الى حقيقة من خلال التواصل معنا</h2>
            <Logo className="logo-home-screen"/>
        </div>
        <div>
            <PreviewCard
                title="3D Printing Service"
                description="Upload your STL files and we’ll deliver your printed models fast."
                image="/Images/3d-printing.jpg"
                onSeeMore={() => navigate("/Upload")}
            />

            <PreviewCard
                title="Custom 3D Designs"
                description="Get professional help to create or modify 3D models."
                image="/Images/3d-design.jpg"
                onSeeMore={() => navigate("/OpenAIGenerator")}
            />

            <PreviewCard
                title="Shop"
                description="Browse our catalog of ready-made 3D products."
                image="/Images/shop.jpg"
                onSeeMore={() => navigate("/shop")}
            />
        </div>
        <div className="home-screen-part3">  
            <h2> فوائد </h2>
            <div className="benefits" ref={scrollRef}>
                {
                benefits?.map((b, i) => (
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
            {/* </div> */}
            </div>  
        </div>
    </div>
  );
}
