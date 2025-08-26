import React, { useEffect, useState } from "react";
import '../Style/materials.css';

function MaterialGrid({ FileExist, onMaterialSelect }) {
  const [printerTypes, setPrinterTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!FileExist) return;
  
    fetch(`${process.env.REACT_APP_API_URL}/admin/materials`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setSelectedId(data[0].id);
        setPrinterTypes(data);
      })
      .catch(err => console.error('Error fetching materials:', err));
  }, [FileExist, token]); // ✅ include token
  

  if (!FileExist || printerTypes.length === 0 || printerTypes === null) return null;

  return (
    <div className="grid-container">
      {(printerTypes.length !== 0 && printerTypes !== null ) && (printerTypes?.map((item, idx) => (
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
