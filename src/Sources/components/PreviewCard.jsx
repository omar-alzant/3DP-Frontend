import React from "react";
import "../Style/PreviewCard.css";

export default function PreviewCard({ title, description, image, onSeeMore, children  }) {
  return (
    <div className="preview-card">
      {/* Title + Description */}
        <h2 className="preview-card-title">{title}</h2>
        <hr></hr>
      <div className="preview-card-content">
        <h3 className="preview-card-description">{description}</h3>
      </div>

      {/* Image */}
      {image && (
        <div className="preview-card-image">
          <img src={image} alt={title} className="preview-img"/>
        </div>
      )}

      {children && (
        <div className="preview-card-extra">
          {children}
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
