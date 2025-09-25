import React from "react";
import "../Style/PreviewCard.css";

export default function PreviewCard({ title, description, image, onSeeMore }) {
  return (
    <div className="preview-card">
      {/* Title + Description */}
        <h2 className="preview-card-title">{title}</h2>
      <div className="preview-card-content">
        <p className="preview-card-description">{description}</p>
      </div>

      {/* Image */}
      {image && (
        <div className="preview-card-image">
          <img src={image} alt={title} />
        </div>
      )}

      {/* Button */}
      <div className="preview-card-footer">
        <button onClick={onSeeMore} className="preview-card-button">
          See More
        </button>
      </div>
    </div>
  );
}
