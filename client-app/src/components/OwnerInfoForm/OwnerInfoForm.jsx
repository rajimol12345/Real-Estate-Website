import React from 'react';
import './OwnerInfoForm.css';

const OwnerInfoForm = ({ formData, onChange, onSubmit, onPrevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Call parent submit function
  };

  return (
    <div className="owner-info-form">
      <h4 className="card-title">Owner <span>Info</span></h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ownerName">Owner Name</label>
          <input
            type="text"
            className="form-control"
            id="ownerName"
            name="ownerName"
            value={formData?.ownerName || ''}
            onChange={onChange}
            placeholder="Enter owner's full name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerEmail">Owner Email</label>
          <input
            type="email"
            className="form-control"
            id="ownerEmail"
            name="ownerEmail"
            value={formData?.ownerEmail || ''}
            onChange={onChange}
            placeholder="Enter owner's email address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerPhone">Owner Phone</label>
          <input
            type="text"
            className="form-control"
            id="ownerPhone"
            name="ownerPhone"
            value={formData?.ownerPhone || ''}
            onChange={onChange}
            placeholder="Enter owner's phone number"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ownerComments">Comments / Notes</label>
          <textarea
            className="form-control"
            id="ownerComments"
            name="ownerComments"
            rows="5"
            value={formData?.ownerComments || ''}
            onChange={onChange}
            placeholder="Any additional comments"
          ></textarea>
        </div>

        <div className="form-actions d-flex justify-content-between mt-4">
          <button type="button" className="prev-btn" onClick={onPrevStep}>Previous Step</button>
          <button type="submit" className="next-btn">Submit Property</button>
        </div>
      </form>
    </div>
  );
};

export default OwnerInfoForm;