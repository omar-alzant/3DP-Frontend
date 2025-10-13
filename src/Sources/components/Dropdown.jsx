import React, { useState, useEffect, useRef } from "react";
import "../Style/DropDown.css"; // we’ll define this below

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "اختر من القائمة",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState("down");
  const dropdownRef = useRef(null);

  // Detect open direction (up/down)
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDirection("up");
      } else {
        setDirection("down");
      }
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="dropdown-container">
      {label && <label className="dropdown-label">{label}</label>}

      <button
        className={`dropdown-button ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value || placeholder}
      </button>

      {isOpen && (
        <div
          className={`dropdown-menu ${
            direction === "up" ? "dropdown-up" : "dropdown-down"
          }`}
        >
          {options.map((opt) => (
            <div
              key={opt.value || opt}
              className={`dropdown-item ${
                (opt.value || opt) === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(opt.value || opt);
                setIsOpen(false);
              }}
            >
              {opt.label || opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
