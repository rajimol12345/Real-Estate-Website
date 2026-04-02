import React from 'react';
import './AmenitiesForm.css';

const AmenitiesForm = ({ formData, onAmenityChange, onNextStep, onPrevStep }) => {
  const amenitiesList = [
    'Air Conditioning', 'Balcony', 'Bedding', 'Cable TV', 'Coffee Pot',
    'Computer', 'Cot', 'Dishwasher', 'DVD Player', 'Fan', 'Fridge',
    'Grill', 'Hairdryer', 'Heating', 'Hi-Fi', 'Internet', 'Iron',
    'Microwave', 'Outdoor Shower', 'Oven', 'Parking', 'Patio',
    'Toaster', 'Towels', 'TV', 'Washing Machine', 'Blender', 'Vacuum Cleaner'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep();
  };

  return (
    <div className="amenities-form">
      <h4 className="card-title">Amenities</h4>
      <form onSubmit={handleSubmit}>
        <div className="amenities-grid">
          {amenitiesList.map((amenity, index) => (
            <div className="amenity-item" key={index}>
              <label className="checkbox-container">
                {amenity}
                <input
                  type="checkbox"
                  name={amenity}
                  checked={formData.amenities?.includes(amenity) || false}
                  onChange={() => onAmenityChange(amenity)}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          ))}
        </div>

        <div className="form-actions d-flex justify-content-between mt-4">
          <button type="button" className="prev-btn" onClick={onPrevStep}>Previous Step</button>
          <button type="submit" className="next-btn">Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default AmenitiesForm;