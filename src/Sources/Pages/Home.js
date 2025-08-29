import '../Style/Home.css';
import React, { useEffect, useState } from "react";

function Home() {
  const [homeDet, sethomeDet] = useState([]);
  const [token] = useState(sessionStorage.getItem("token") || "");

  useEffect(() => {
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
    const stored = localStorage.getItem("homeDet");
    if (stored) sethomeDet(JSON.parse(stored));

    // التحديث من السيرفر لو في توكن
    if (token) fetchHomeDets();
  }, [token]);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>مرحباً بكم في مصنع الابتكار</h1>
        <p>نقدم خدمات متقدمة في الطباعة ثلاثية الأبعاد والنقش بالليزر.</p>
      </header>

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
  );
}

export default Home;
