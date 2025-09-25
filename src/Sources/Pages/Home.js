import '../Style/Home.css';
import React, { useEffect, useState, useRef } from "react";

function Home() {
  const [homeDet, sethomeDet] = useState([]);
  const [token] = useState(sessionStorage.getItem("token") || "");
  const [benefits, setBenefits] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {

    const fetchBenefits = async () => {
      console.log("fetching benefits...");
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBenefits(data);
        console.log(data);
        localStorage.setItem("benefits", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching benefits:", err);
      }
    };

    const fetchHomeDets = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/Home`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch home details");
        const data = await res.json();
        sethomeDet(data);
        localStorage.setItem("homeDet", JSON.stringify(data));
      } catch (err) {
        console.error("Error fetching home Details:", err);
      }
    };

    // جلب البيانات من التخزين المحلي مباشرة
    const homeDet = localStorage.getItem("homeDet");
    if (homeDet) sethomeDet(JSON.parse(homeDet));
    // التحديث من السيرفر لو في توكن
    if (token) fetchHomeDets();

    const stored = localStorage.getItem("benefits");
    if (stored) {
      setBenefits(JSON.parse(stored));
    } else if (token) {
      fetchBenefits();
    }

  }, [token]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>مرحباً بكم في مصنع الابتكار</h1>
        <p>نقدم خدمات متقدمة في الطباعة ثلاثية الأبعاد والنقش بالليزر.</p>
      </header>
      <div className='home-part-1'>
        {Array.isArray(homeDet) && homeDet.length > 0 ? (
          homeDet.map((b, i) => (
            b.Display && 
            <section key={i} className="home-section">
              <img 
                src={b.Image || "/favicon.jpg"} 
                alt={b.Title} 
                className="benefit-image" 
              />
              <div>
                <h2>{b.Title}</h2>
                <p>{b.Detail}</p>
              </div>
            </section>
          ))
        ) : (
          <p>لا يوجد تفاصيل</p>
        )}
    </div>
    <div className='home-part-2'>
    { 
      (
        <div className="benefits" ref={scrollRef}>
          {/* <div className="benefits-section" > */}
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
      )}
    </div>
  </div>
);
}

export default Home;
