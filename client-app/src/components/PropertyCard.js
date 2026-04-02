import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
    return (
        <div className="property-card">
            <div className="property-image-wrapper">
                <img src={property.image} alt={property.title} />
                <span className={`status-tag ${property.status === 'For Rent' ? 'rent' : 'sale'}`}>
                    {property.status}
                </span>
                <span className="price-tag">${property.price}</span>
                <div className="overlay">
                    <button className="overlay-btn detail-btn">
                        Details <i className="fa-regular fa-file-lines"></i>
                    </button>
                    <button className="overlay-btn map-btn">
                        <i className="fa-solid fa-location-dot"></i>
                    </button>
                </div>
            </div>
            <div className="property-content">
                <h3>{property.title}</h3>
                <p className="property-address">{property.address}</p>
                <div className="property-stats">
                    <div className="stat-item">
                        <i className="fa-solid fa-bed"></i>
                        <span>{property.beds} Beds</span>
                    </div>
                    <div className="stat-item">
                        <i className="fa-solid fa-bath"></i>
                        <span>{property.baths} Baths</span>
                    </div>
                    <div className="stat-item">
                        <i className="fa-regular fa-square"></i>
                        <span>{property.sqft} Sq Ft</span>
                    </div>
                </div>
                <div className="property-actions" style={{ marginTop: '15px' }}>
                    <button
                        className="btn-book"
                        disabled={property.isBooked}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: property.isBooked ? '#7f8c8d' : 'var(--primary-color)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: property.isBooked ? 'not-allowed' : 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            if (!property.isBooked) e.currentTarget.style.backgroundColor = '#0095cc';
                        }}
                        onMouseOut={(e) => {
                            if (!property.isBooked) e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                        }}
                        onClick={() => {
                            if (!property.isBooked) alert('Redirecting to payment for: ' + property.title);
                        }}
                    >
                        {property.isBooked ? 'Booked' : 'Book Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
