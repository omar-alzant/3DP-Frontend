import React, { useState } from "react";
import "../Style/Benefits.css"; // 👈 نربط ملف CSS

function AdminPage() {
  const [Title, setTitle] = useState("");
  const [Image, setImage] = useState("");
  const [setImageBase64] = useState("");
  const [Details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/benefits`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      },
      
      body: JSON.stringify({ Title, Image, Details }),
    });
    
    if (res.ok) {
      // get old benefits (if any)
      const data = await res.json(); // <-- this is your inserted row(s)

      const benefits = JSON.parse(localStorage.getItem("benefits")) || [];
      const updated = [...benefits, data]; // data is a single object
      localStorage.setItem("benefits", JSON.stringify(updated));
    
      alert("تمت الإضافة ✅");
      setTitle(""); 
      setImage(""); 
      setDetails(""); 
      setImageBase64("");
      }
    };

  const handleImageChange = (e) => {
    e.preventDefault(); // stops page refresh
    
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result; // e.g. data:image/png;base64,AAAA
        const base64Only = typeof dataUrl === 'string' ? dataUrl.split(',')[1] : '';
        setImageBase64(base64Only)
        setImage(dataUrl)
    };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="benefit-container">
      <h2 className="benefit-title">إضافة فائدة</h2>
      <form onSubmit={handleSubmit} className="benefit-form">
        <input 
          type="text" 
          placeholder="العنوان" value={Title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="label">
         أرفق صورة📤
         <div className="imageContainer">

            <input 
                id="imageUpload"         
                type="file"
                hidden={true} 
                accept="image/*" 
                onChange={handleImageChange}
            />
            {Image && (
                <img src={Image} alt="preview" className="previewImage" />
            )}
        </div>
        </label>
        <textarea 
          placeholder="النص" value={Details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <button type="submit">إضافة</button>
      </form>
    </div>
  );
}

export default AdminPage;
