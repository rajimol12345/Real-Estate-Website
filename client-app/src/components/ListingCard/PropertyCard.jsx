import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { paymentService } from '../../services/api';
import PaymentModal from '../PaymentModal/PaymentModal';
import AuthModal from '../AuthModal/AuthModal';
import { LanguageContext } from '../../context/LanguageContext';
import { CurrencyContext } from '../../context/CurrencyContext';
import './PropertyCard.css';

const PropertyCard = ({ id, image, type, price, title, location, beds, baths, sqft, isBooked: initialIsBooked }) => {
  const { formatPrice } = React.useContext(CurrencyContext);
  const [isBooked, setIsBooked] = useState(initialIsBooked);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handlePaymentClick = () => {
    if (isBooked) return;

    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsBooked(true);
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <NavLink to={`/listing-details/${id}`}>
          <img src={image} alt={title} />
        </NavLink>
        <div className={`property-type-badge ${type}`}>
          For {type === 'sale' ? 'Sale' : 'Rent'}
        </div>
        <div className="property-price">{formatPrice(price)}</div>
      </div>
      <div className="property-content">
        <h3 className="property-title">
          <NavLink to={`/listing-details/${id}`}>{title}</NavLink>
        </h3>
        <p className="property-location"><i className="fas fa-map-marker-alt"></i> {location}</p>
        <div className="property-specs">
          <span><i className="fas fa-bed"></i> {beds} Beds</span>
          <span><i className="fas fa-bath"></i> {baths} Baths</span>
          <span><i className="fas fa-ruler-combined"></i> {sqft} Sq Ft</span>
        </div>
        <div className="property-card-actions">
          <NavLink to={`/listing-details/${id}`} className="btn btn-details">Details <i className="fas fa-angle-right"></i></NavLink>
          <button
            className={`btn btn-payment ${isBooked ? 'booked' : ''}`}
            onClick={handlePaymentClick}
            disabled={isBooked}
          >
            {isBooked ? 'Booked' : 'Book Now'}
          </button>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        property={{ id, title, price }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="login"
      />
    </div>
  );
};

export default PropertyCard;
