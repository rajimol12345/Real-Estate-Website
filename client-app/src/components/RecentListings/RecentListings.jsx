import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';
import FavoriteButton from '../common/FavoriteButton';
import { propertyService, paymentService } from '../../services/api';
import PaymentModal from '../PaymentModal/PaymentModal';
import AuthModal from '../AuthModal/AuthModal';
import { getImageUrl } from '../../utils/helpers';
import './RecentListings.css';

const RecentListings = ({ filters }) => {
    const { t } = useTranslation();
    const { getLocalized } = useContext(LanguageContext);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await propertyService.getAll({ ...filters });
                const properties = response.data.properties || response.data;
                const propertiesArray = Array.isArray(properties) ? properties : [];
                const mappedData = propertiesArray.map(item => ({
                    id: item._id,
                    image: getImageUrl(item.media?.featuredImage || item.imageURL, 'listing'),
                    price: item.price ? `$${item.price.toLocaleString()}` : 'POA',
                    location: item.location,
                    title: getLocalized(item.title),
                    status: item.status,
                    type: item.status === 'For Rent' ? 'rent' : 'sale',
                    beds: item.beds || '0',
                    baths: item.baths || '0',
                    garage: item.garage || '0',
                    sqft: item.sqft || '0',
                    rooms: item.rooms || '0',
                    isBooked: item.isBooked
                }));
                setListings(mappedData.slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching listings:", error);
                setLoading(false);
            }
        };

        fetchListings();
    }, [filters, getLocalized]);

    const handlePaymentClick = (listing) => {
        if (listing.isBooked) return;

        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            setIsAuthModalOpen(true);
            return;
        }

        setSelectedListing(listing);
        setIsPaymentModalOpen(true);
    };

    const handlePaymentSuccess = (propertyId) => {
        setListings(prev => prev.map(l => l.id === propertyId ? { ...l, isBooked: true } : l));
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{t('common.loading')}</span>
            </div>
        </div>
    );

    return (
        <section className="recent-listings-fidelity-section">
            <div className="container-fluid px-5">
                <div className="section-title text-center">
                    <h2>{t('listings.recent_listing') || 'Recent Listing'}</h2>
                    <div className="yellow-separator"></div>
                </div>
                <div className="row">
                    {listings.map((listing) => (
                        <div className="col-lg-4 col-md-6 listing-col-fid" key={listing.id}>
                            <div className={`listing-card-fid-v2 ${listing.type}`}>
                                <div className="listing-image-box">
                                    <img
                                        src={listing.image}
                                        alt={listing.location}
                                        onError={(e) => { e.target.src = '/assets/images/listing/1.jpg' }}
                                    />

                                    {/* Top Left Heart Icon */}
                                    <FavoriteButton propertyId={listing.id} className="listing-top-left-fav" />

                                    <div className={`listing-status-tag-v2 ${listing.type}`}>
                                        {listing.status === 'For Sale' ? 'For Sale' : 'For Rent'}
                                    </div>

                                    <div className={`listing-price-v2 ${listing.type}`}>
                                        {listing.price}{listing.status === 'For Rent' ? ` / mo` : ''}
                                    </div>

                                    {/* Bottom Right Document Icon Circle */}
                                    <div className="floating-action-circle">
                                        <i className="fa-regular fa-file-lines"></i>
                                    </div>
                                </div>

                                <div className="listing-body-v2">
                                    <h4 className="listing-title-v2">
                                        <Link to={`/listing-details/${listing.id}`}>
                                            {listing.title}
                                        </Link>
                                    </h4>

                                    <div className="listing-stats-row-v2">
                                        <div className="stat-box-v2">
                                            <i className="fa-solid fa-arrows-left-right"></i>
                                            <span>{listing.sqft} Sq Ft</span>
                                        </div>
                                        <div className="stat-box-v2">
                                            <i className="fa-solid fa-bed"></i>
                                            <span>{listing.beds} bedrooms</span>
                                        </div>
                                    </div>

                                    <div className="listing-actions-v2" style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                                        <Link to={`/listing-details/${listing.id}`} className="btn-details-v2" style={{
                                            flex: '1',
                                            textAlign: 'center',
                                            padding: '8px',
                                            background: '#f8f9fa',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            textDecoration: 'none',
                                            color: '#333',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            Details
                                        </Link>
                                        <button
                                            onClick={() => handlePaymentClick(listing)}
                                            disabled={listing.isBooked}
                                            className="btn-book-v2"
                                            style={{
                                                flex: '1',
                                                padding: '8px',
                                                background: listing.isBooked ? '#7f8c8d' : 'var(--primary-color)',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: listing.isBooked ? 'not-allowed' : 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseOver={(e) => {
                                                if (!listing.isBooked) e.currentTarget.style.backgroundColor = '#0095cc';
                                            }}
                                            onMouseOut={(e) => {
                                                if (!listing.isBooked) e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                                            }}
                                        >
                                            {listing.isBooked ? 'Booked' : 'Book Now'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedListing && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    property={{
                        id: selectedListing.id,
                        title: selectedListing.title,
                        price: selectedListing.price.replace(/[^0-9.-]+/g, "")
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="login"
            />
        </section>
    );
};

export default RecentListings;