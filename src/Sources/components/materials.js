import React, { useState } from "react";
import PrinterTypes from "../ResourcesFiles/PrinterTypes";
import '../Style/materials.css'

// Your data (can also be imported from a JSON file)

function MaterialsSection() {
  const [selectedType, setSelectedType] = useState("Filament");

  // Filter materials based on selected type
  const filteredMaterials = PrinterTypes.filter(item => item.type.toLowerCase() === selectedType.toLowerCase());

  return (
    <div>
      {/* Buttons to toggle types */}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setSelectedType("filemant")}>Filament</button>
        <button onClick={() => setSelectedType("Resin")}>Resin</button>
      </div>

      {/* Show selected section */}
      <h2>{selectedType} Materials</h2>
      <div className="material-list">
        {filteredMaterials.map((item, index) => (
          <div key={index} className="material-card">
            <img src={item.img} alt={item.name} />
            <h4>{item.name}</h4>
            <p>{item.Details || "No details yet."}</p>
            <p>Price: ${item.Price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialsSection;
