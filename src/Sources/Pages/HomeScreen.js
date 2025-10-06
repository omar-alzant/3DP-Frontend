import PreviewCard from "../components/PreviewCard";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from '../../logo.svg';
import '../Style/Home.css'; 
import React, { useEffect, useState, useRef } from "react";
import ShopDet from '../components/ShopDet';

export default function HomeScreen() {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);
  const scrollRef = useRef(null);
  const [expandedBenefits, setExpandedBenefits] = useState(true); // 👈 new state
  const HomeDet = [
    {title: "نقدم خدمة الطباعة ثلاثية الابعاد", description: "من خلال رفع تصميمك وارساله"}
  ]
  const benefitsEvent = () => {
    setExpandedBenefits(!expandedBenefits);
  }

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
            <h2> حول افكارك الى حقيقة من خلال التواصل
             <a className="home-link" href="https://wa.me/96176118290">
               معنا  
              </a> 
               
            </h2>
            <Logo className="logo-home-screen"/>
        </div>
        <div>
            <PreviewCard
                title="خدمة الطباعة"
                description="نقدم خدمات الطباعة ثلاثية الأبعاد والقص بالليزر باستخدام أحدث التقنيات.
يمكننا تنفيذ تصاميمك بخيوط PETG, PLA, TPU, PA, ABS أو بمواد Resin عالية الدقة،
كما نوفر أيضاً خدمات الـ CNC و الليزر CO₂ لقصّ ونقش المواد المختلفة."
                image="Images/service3D.jpg"
                onSeeMore={() => navigate("/Upload")}
            />

            <PreviewCard
                title="إنفاذ مشاريع جامعية ومؤسساتية"
                description="نتعهد المشاريع الهندسية سواء مدنية او الكترونية, من خلال فريق من المهندسين وخبراء الطباعة ثلاثية الابعاد."
                image="Images/eng3D.jpg"
                onSeeMore={() => navigate("/ourJobs")}
            />

            <PreviewCard
                title="التسوق"
                description="تأمين مكنات الطباعة وتوابعها, كما أننا نؤمن مكنة الليزر, ونوفر لك فريق لمتابعة لتشغيل."
                onSeeMore={() => navigate("/shop")}
            >
               <ShopDet nbrOfView="4" short={true}/>
            </PreviewCard>
            
        </div>
        <div className="home-screen-part3">  
          <div className="home-screen-benefits-title">
            <h2> فوائد </h2>
            <button 
              className="expand-btn" 
              onClick={benefitsEvent}
            >
              {expandedBenefits ? "⬆" : "⬇"}
            </button>
          </div>
            <div className="benefits" ref={scrollRef}>
                {expandedBenefits &&
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
