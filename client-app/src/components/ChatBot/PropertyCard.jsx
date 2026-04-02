import React from 'react';

const PropertyCard = ({ property }) => {
  return (
    <div className="p-card-inline">
      <img src={property.image} alt={property.title} />
      <div className="p-card-details">
        <h5 style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#111827' }}>{property.title}</h5>
        <div className="p-card-price">${property.price.toLocaleString()}</div>
        <button className="p-card-btn">VIEW DETAILS</button>
      </div>
    </div>
  );
};

export default PropertyCard;
