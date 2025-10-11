import React, { useEffect, useState } from "react";
import "../Style/materials.css";

function MaterialGrid({ FileExist, onMaterialSelect, isMobile, prevSelectedId }) {
  const [selectedId, setSelectedId] = useState(prevSelectedId || null);
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem("materials");
    return saved ? JSON.parse(saved) : null;
  });

  const token = sessionStorage.getItem("token");

  // Fetch materials if not already loaded
  useEffect(() => {
    if (!FileExist || (Array.isArray(materials) && materials.length > 0)) return;

    fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setMaterials(data);
          localStorage.setItem("materials", JSON.stringify(data));
        }
      })
      .catch((err) => console.error("Error fetching materials:", err));
  }, [FileExist, token]);

  // Select default or previous material when materials are ready
  useEffect(() => {
    if (!Array.isArray(materials) || materials.length === 0) return;
  
    // Find previously selected material
    const prevSelected = prevSelectedId
      ? materials.find((m) => m.id === prevSelectedId)
      : null;
  
    // ✅ Only update if the selectedId is actually different
    if (prevSelected && prevSelected.id !== selectedId) {
      setSelectedId(prevSelected.id);
      onMaterialSelect?.(prevSelected);
    } else if (!selectedId) {
      setSelectedId(materials[0].id);
      onMaterialSelect?.(materials[0]);
    }
    // ⚠️ Dependencies: only run when materials or prevSelectedId change
  }, [materials, prevSelectedId]);

  
    if (!FileExist || !Array.isArray(materials) || materials === null) return null;

  return (
    <div className="grid-container">
      {materials.map((item, idx) => (
        <div
          key={idx}
          onClick={() => {
            setSelectedId(item.id);
            onMaterialSelect(item);
          }}
          className={`card ${selectedId === item.id ? "selected" : ""}`}
        >
          {item.isNew && <div className="badge">NEW</div>}
          <div className="image-container">
            {item.color && (
              <img
                src={`data:image/png;base64,${item.color}`}
                alt={item.name}
                className="material-image"
              />
            )}
          </div>
          <h3 className="material-name">{item.name}</h3>
          <p className="material-price">
            Starting at (${item.basePrice + item.pricePerCm3})
          </p>
          {!isMobile && (
            <p className="material-price">{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default MaterialGrid;
