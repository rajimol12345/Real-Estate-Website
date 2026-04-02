import React from 'react';
import './SubmitPropertySidebar.css';

const SubmitPropertySidebar = ({ activeStep }) => {
  const steps = [
    { label: "Property Informations", id: "property-info" },
    { label: "Add Photo Gallery", id: "photo-gallery" },
    { label: "Amenities", id: "amenities" },
    { label: "Google Map Location", id: "google-map" },
    { label: "Additional Details", id: "additional-details" },
    { label: "Owner Info", id: "owner-info" },
  ];

  return (
    <div className="submit-property-sidebar">
      <ul>
        {steps.map((step, index) => (
          <li key={index} className={activeStep === index + 1 ? 'active' : ''}>
            <a href={`#${step.id}`} className="step-link">
              <span className="step-circle"></span>
              {step.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubmitPropertySidebar;