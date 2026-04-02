import React from 'react';
import { Link } from 'react-router-dom';
import PaymentModal from '../PaymentModal/PaymentModal';
import AuthModal from '../AuthModal/AuthModal';
import { CurrencyContext } from '../../context/CurrencyContext';
import './ListingListItem.css';

const ListingListItem = ({ id, image, type, price, location, sqft, beds, baths, description, isBooked: initialIsBooked }) => {
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
        <div className="listing-list-item-pro">
            <div className="list-image-box">
                <img src={image} alt={location} />
                <div className="overlay-details">
                    <Link to={`/listing-details/${id}`}><i className="fa-solid fa-link"></i></Link>
                </div>
            </div>
            <div className="list-content-box">
                <div className="badges-row">
                    <div className={`badge-type ${type}`}>For {type === 'sale' ? 'Sale' : 'Rent'}</div>
                    <div className="badge-price">{formatPrice(price)}</div>
                </div>
                <h4 className="property-title">
                    <Link to={`/listing-details/${id}`}>{location}</Link>
                </h4>
                <div className="property-stats-pro">
                    <div className="stat-pro">
                        <i className="fa-solid fa-arrows-alt"></i> {sqft} Sq Ft
                    </div>
                    <div className="stat-pro">
                        <i className="fa-solid fa-bed"></i> {beds} bedrooms
                    </div>
                </div>
                <div className="list-card-actions" style={{ marginTop: '10px' }}>
                    <button
                        className={`btn-book-now-list ${isBooked ? 'booked' : ''}`}
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
                property={{ id, title: location, price }}
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

export default ListingListItem;