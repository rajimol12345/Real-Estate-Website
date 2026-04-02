import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../common/FavoriteButton';
import PaymentModal from '../PaymentModal/PaymentModal';
import AuthModal from '../AuthModal/AuthModal';
import { CurrencyContext } from '../../context/CurrencyContext';
import './ListingCard.css';

const ListingCard = ({ id, image, type, price, title, location, sqft, beds, isBooked: initialIsBooked }) => {
    const { formatPrice } = React.useContext(CurrencyContext);
    const [isBooked, setIsBooked] = React.useState(initialIsBooked);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

    const handlePaymentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
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
        <div className="property-card listing-grid-card">
            <Link to={`/listing-details/${id}`} className="card-link-wrapper">
                <div className="image-container">
                    <img src={image} alt={location} />
                    <div className={`tag ${type}`}>
                        For {type === 'sale' ? 'Sale' : 'Rent'}
                    </div>
                    <FavoriteButton propertyId={id} className="listing-card-fav" onClick={(e) => e.stopPropagation()} />
                    <div className="price-tag">
                        {formatPrice(price)}
                    </div>
                    <div className="details-icon">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>
                </div>
                <div className="content">
                    <h4 className="title-localized">{title}</h4>
                    <p className="address"><i className="fa-solid fa-location-dot"></i> {location}</p>
                    <div className="stats">
                        <span>
                            <i className="fa-solid fa-arrows-up-down-left-right"></i> {sqft} Sq Ft
                        </span>
                        <span>
                            <i className="fa-solid fa-bed"></i> {beds} bedrooms
                        </span>
                    </div>
                    <div className="listing-card-actions" style={{ marginTop: '15px' }}>
                        <button
                            className={`btn-book-now ${isBooked ? 'booked' : ''}`}
                            onClick={handlePaymentClick}
                            disabled={isBooked}
                        >
                            {isBooked ? 'Booked' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </Link>

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

export default ListingCard;