import React from 'react';
import './GoogleMapLocationForm.css';

const GoogleMapLocationForm = ({ formData, onChange, onNextStep, onPrevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep();
  };

  return (
    <div className="google-map-location-form">
      <h4 className="card-title">Google Map <span>Location</span></h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="propertyAddress">Property Address</label>
          <input
            type="text"
            className="form-control"
            id="propertyAddress"
            name="propertyAddress"
            value={formData.propertyAddress}
            onChange={onChange}
            placeholder="Enter address here"
          />
        </div>
        <div className="form-row-2">
          <div>
            <label htmlFor="latitude">Latitude</label>
            <input
              type="text"
              className="form-control"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={onChange}
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label htmlFor="longitude">Longitude</label>
            <input
              type="text"
              className="form-control"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={onChange}
              placeholder="Enter longitude"
            />
          </div>
        </div>
        {/* Placeholder for actual map integration */}
        <div className="map-placeholder">
          <p>Map integration goes here</p>
        </div>

        <div className="form-actions d-flex justify-content-between mt-4">
          <button type="button" className="prev-btn" onClick={onPrevStep}>Previous Step</button>
          <button type="submit" className="next-btn">Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default GoogleMapLocationForm;