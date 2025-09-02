import React, { useEffect, useState } from "react";
import '../Style/materials.css';

function MaterialGrid({ FileExist, onMaterialSelect }) {
  const [selectedId, setSelectedId] = useState(null);
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('materials');
    return saved ? JSON.parse(saved) : null; // ✅ parse JSON
  });
  
  const token = sessionStorage.getItem('token');
  
  useEffect(() => {
    // ✅ if file doesn’t exist OR we already have materials → do nothing
    if (!FileExist || (Array.isArray(materials))) return;
  
    fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data?.length) {
          setSelectedId(data[0].id);
          setMaterials(data);
          localStorage.setItem('materials', JSON.stringify(data)); // ✅ save it
        }
      })
      .catch(err => console.error('Error fetching materials:', err));
  }, [FileExist, token, materials]);
    

  if (!FileExist || !Array.isArray(materials) || materials === null) return null;

  return (
    <div className="grid-container">
      {(Array.isArray(materials) && materials !== null ) && (materials?.map((item, idx) => (
        <div 
        onClick={() => {
          setSelectedId(item.id);
          // console.log(item.id)
          onMaterialSelect(item);
        }}
        className={`card ${selectedId === item.id ? 'selected' : ''}`}
         key={idx}>
          {item.isNew && <div className="badge">NEW</div>}
          <div className="image-container">
            {item.color ? (<img src={`data:image/png;base64,${item.color}`} alt={item.name} className="material-image" />) : ""}
          </div>
          <h3 className="material-name">{item.name}</h3>
          <p className="material-price">Starting at ( ${item.basePrice  + item.pricePerCm3} )</p>
          <p className="material-price">{item.description}</p>
        </div>
      )))}
    </div>
  );
}

export default MaterialGrid;
