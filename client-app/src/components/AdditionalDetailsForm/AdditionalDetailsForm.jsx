import React from 'react';
import './AdditionalDetailsForm.css';

const AdditionalDetailsForm = ({ formData, onChange, onNextStep, onPrevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep();
  };

  return (
    <div className="additional-details-form">
      <h4 className="card-title">Additional <span>Details</span></h4>
      <form onSubmit={handleSubmit}>
        <div className="form-row-2">
          <div>
            <label htmlFor="beds">Beds</label>
            <input
              type="number"
              className="form-control"
              id="beds"
              name="beds"
              value={formData.beds === 'any' ? '' : formData.beds}
              onChange={onChange}
              placeholder="Number of beds"
            />
          </div>
          <div>
            <label htmlFor="baths">Baths</label>
            <input
              type="number"
              className="form-control"
              id="baths"
              name="baths"
              value={formData.baths === 'any' ? '' : formData.baths}
              onChange={onChange}
              placeholder="Number of baths"
            />
          </div>
        </div>
        <div className="form-row-2">
          <div>
            <label htmlFor="sqft">Sq Ft</label>
            <input
              type="number"
              className="form-control"
              id="sqft"
              name="sqft"
              value={formData.sqft === 'any' ? '' : formData.sqft}
              onChange={onChange}
              placeholder="Square Footage"
            />
          </div>
          <div>
            <label htmlFor="yearBuilt">Year Built</label>
            <input
              type="number"
              className="form-control"
              id="yearBuilt"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={onChange}
              placeholder="Year property was built"
            />
          </div>
        </div>

        <div className="form-actions d-flex justify-content-between mt-4">
          <button type="button" className="prev-btn" onClick={onPrevStep}>Previous Step</button>
          <button type="submit" className="next-btn">Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default AdditionalDetailsForm;