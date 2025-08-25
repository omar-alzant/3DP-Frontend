import React, { useState } from "react";
import '../Style/QuantityInput.css'


export default function QuantityInput({ initial = 1, min = 1, onChange }) {
  const [value, setValue] = useState(initial);

  const handleDecrease = () => {
    if (value > min) {
      setValue(value - 1);
      if (onChange) onChange(value - 1);
      
    }
  };
  
  const handleIncrease = () => {
    setValue(value + 1);
    if (onChange) onChange(value + 1);
  };

  return (
    <div className="quantity-container">
      <button className="quantity-btn" onClick={handleDecrease}>-</button>
      <span className="quantity-value">{value}</span>
      <button className="quantity-btn" onClick={handleIncrease}>+</button>
    </div>
  );
}
