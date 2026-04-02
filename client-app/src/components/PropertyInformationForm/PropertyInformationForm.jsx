import React, { useState } from 'react';
import './PropertyInformationForm.css';

const PropertyInformationForm = ({ formData, onChange, onToggle, onNextStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep();
  };

  const propertyTypes = ['Any', 'House', 'Apartment', 'Condo', 'Villa', 'Land'];
  const locations = ['Any', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  const bedsOptions = ['Any', '1', '2', '3', '4', '5+'];
  const bathsOptions = ['Any', '1', '2', '3', '4', '5+'];
  const sqftOptions = ['Any', '500-1000', '1000-1500', '1500-2000', '2000+'];
  const priceOptions = ['Any', '100000-200000', '200000-300000', '300000-400000', '400000+'];

  return (
    <div className="property-information-form">
      <div className="card-header-fid">
        <h4 className="card-title">Property <span>Informations</span></h4>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="toggle-group">
            <span className={`toggle-label ${formData.forSale ? 'active' : ''}`}>For Sale</span>
            <label className="switch">
              <input type="checkbox" checked={!formData.forSale} onChange={onToggle} />
              <span className="slider round"></span>
            </label>
            <span className={`toggle-label ${!formData.forSale ? 'active' : ''}`}>For Rent</span>
          </div>

          <div className="form-group">
            <label htmlFor="propertyTitle">Property Title</label>
            <input
              type="text"
              className="form-control"
              id="propertyTitle"
              name="propertyTitle"
              value={formData.propertyTitle}
              onChange={onChange}
              placeholder="Enter title here"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="propertyDescription">Property Description</label>
            <textarea
              className="form-control"
              id="propertyDescription"
              name="propertyDescription"
              rows="5"
              value={formData.propertyDescription}
              onChange={onChange}
              placeholder="Enter description here"
              required
            ></textarea>
          </div>

          <div className="form-row-2">
            <div>
              <label htmlFor="propertyType">Property Type</label>
              <select
                className="form-control"
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={onChange}
              >
                {propertyTypes.map((type) => (
                  <option key={type} value={type.toLowerCase().replace(' ', '')}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="propertyLocation">Property Location</label>
              <select
                className="form-control"
                id="propertyLocation"
                name="propertyLocation"
                value={formData.propertyLocation}
                onChange={onChange}
              >
                {locations.map((location) => (
                  <option key={location} value={location.toLowerCase().replace(' ', '')}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-3">
            <div>
              <label htmlFor="beds">Beds</label>
              <select
                className="form-control"
                id="beds"
                name="beds"
                value={formData.beds}
                onChange={onChange}
              >
                {bedsOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="baths">Baths</label>
              <select
                className="form-control"
                id="baths"
                name="baths"
                value={formData.baths}
                onChange={onChange}
              >
                {bathsOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sqft">Sq.ft</label>
              <select
                className="form-control"
                id="sqft"
                name="sqft"
                value={formData.sqft}
                onChange={onChange}
              >
                {sqftOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace('+', '')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row-2">
            <div>
              <label htmlFor="minPrice">Min Price</label>
              <select
                className="form-control"
                id="minPrice"
                name="minPrice"
                value={formData.minPrice}
                onChange={onChange}
              >
                {priceOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace('+', '')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="maxPrice">Max Price</label>
              <select
                className="form-control"
                id="maxPrice"
                name="maxPrice"
                value={formData.maxPrice}
                onChange={onChange}
              >
                {priceOptions.map((option) => (
                  <option key={option} value={option.toLowerCase().replace('+', '')}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="next-btn">Next Step</button>
        </form>
      </div>
    </div>
  );
};

export default PropertyInformationForm;