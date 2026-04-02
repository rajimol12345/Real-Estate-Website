import React from 'react';
import './PropertiesFilter.css';

const PropertiesFilter = ({ onSearch }) => {
  const [formData, setFormData] = React.useState({
    type: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(formData);
  };

  return (
    <div className="properties-filter-horizontal">
      <div className="filter-label-box">
        <h3>find your <span>House</span></h3>
      </div>
      <div className="filter-form-box">
        <form className="horizontal-filter-form" onSubmit={handleSubmit}>
          <div className="filter-row">
            <div className="form-group">
              <label htmlFor="type">Property type</label>
              <select id="type" className="form-control" value={formData.type} onChange={handleChange}>
                <option value="">any</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <select id="location" className="form-control" value={formData.location} onChange={handleChange}>
                <option value="">any</option>
                <option value="Portland">Portland</option>
                <option value="Chicago">Chicago</option>
                <option value="Boston">Boston</option>
                <option value="Denver">Denver</option>
                <option value="Los Angeles">Los Angeles</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="beds">Beds</label>
              <select id="beds" className="form-control" value={formData.beds} onChange={handleChange}>
                <option value="">any</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="baths">Baths</label>
              <select id="baths" className="form-control" value={formData.baths} onChange={handleChange}>
                <option value="">any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sqft">Sq ft</label>
              <select id="sqft" className="form-control" value={formData.sqft} onChange={handleChange}>
                <option value="">any</option>
                {[500, 1000, 2000, 3000, 4000, 5000].map(val => (
                  <option key={val} value={val}>{val}+</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="minPrice">min price</label>
              <select id="minPrice" className="form-control" value={formData.minPrice} onChange={handleChange}>
                <option value="">any</option>
                {[1000, 5000, 10000, 50000, 100000].map(val => (
                  <option key={val} value={val}>${val.toLocaleString()}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxPrice">max price</label>
              <select id="maxPrice" className="form-control" value={formData.maxPrice} onChange={handleChange}>
                <option value="">any</option>
                {[50000, 100000, 500000, 1000000, 5000000].map(val => (
                  <option key={val} value={val}>${val.toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-button-row">
            <button type="submit" className="btn-search-horizontal">Search</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertiesFilter;
