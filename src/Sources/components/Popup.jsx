import React from "react";
import { useNavigate } from "react-router-dom";
import "../Style/Popup.css"; // optional styling

export default function Popup({ message, onClose, navigationUrl }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(`/${navigationUrl}`); 
    onClose(); // close popup after navigation
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3 className="popup-message">{message}</h3>
        <div className="popup-actions">
          <button className="popup-btn login" onClick={handleLogin}>
            تسجيل الدخول
          </button>
          <button className="popup-btn cancel" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
