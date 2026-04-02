import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LanguageContext } from '../context/LanguageContext';
import { CurrencyContext } from '../context/CurrencyContext';
import PageCover from '../components/PageCover/PageCover';
import { propertyService, agentService, paymentService, communicationService } from '../services/api';
import PaymentModal from '../components/PaymentModal/PaymentModal';
import AuthModal from '../components/AuthModal/AuthModal';
import { getImageUrl } from '../utils/helpers';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './ListingDetails.css';
import pageCoverBg from '../assets/images/slider/8.jpg';

const ListingDetails = () => {
    const { id } = useParams();
    const { getLocalized } = useContext(LanguageContext);
    const { formatPrice } = useContext(CurrencyContext);
    const [property, setProperty] = useState(null);
    const [agents, setAgents] = useState([]);
    const [recentProperties, setRecentProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBooked, setIsBooked] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);

    // Inquiry Form State
    const [msgFormData, setMsgFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [callbackFormData, setCallbackFormData] = useState({
        name: '',
        phone: '',
        preferredTime: 'Morning (9AM - 12PM)'
    });
    const [callbackSending, setCallbackSending] = useState(false);
    const [callbackSuccess, setCallbackSuccess] = useState(false);

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the main property first - this is critical
                const propRes = await propertyService.getById(id);
                const propData = propRes.data;
                setProperty(propData);
                setIsBooked(propData.isBooked || false);

                // Pre-fill message
                setMsgFormData(prev => ({
                    ...prev,
                    message: `Hi, I am interested in ${getLocalized(propData.title)} (${propData.location}). Please let me know the details.`
                }));
            } catch (error) {
                console.error("Error fetching property:", error);
            }

            try {
                const agentsRes = await agentService.getAll();
                const agentsData = agentsRes.data.agents || agentsRes.data;
                setAgents(Array.isArray(agentsData) ? agentsData : []);
            } catch (error) {
                console.error("Error fetching agents:", error);
            }

            try {
                const recentRes = await propertyService.getAll();
                const propertiesData = recentRes.data.properties || recentRes.data;
                setRecentProperties(Array.isArray(propertiesData) ? propertiesData.filter(p => p._id !== id) : []);
            } catch (error) {
                console.error("Error fetching recent properties:", error);
            }

            setLoading(false);
        };
        fetchData();
        setActiveImageIndex(0); // Reset for new property
    }, [id]);

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

    const handleMsgInputChange = (e) => {
        setMsgFormData({ ...msgFormData, [e.target.name]: e.target.value });
    };

    const handleMsgSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await communicationService.submitInquiry({
                ...msgFormData,
                propertyId: id
            });
            setSendSuccess(true);
            setMsgFormData({
                name: '',
                phone: '',
                email: '',
                message: `Hi, I am interested in ${propertyTitle} (${property.location}). Please let me know the details.`
            });
            setTimeout(() => setSendSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending inquiry:", error);
            alert("Failed to send inquiry. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const handleCallbackSubmit = async (e) => {
        e.preventDefault();
        setCallbackSending(true);
        try {
            await communicationService.requestCallback({
                ...callbackFormData,
                propertyId: id
            });
            setCallbackSuccess(true);
            setCallbackFormData({ name: '', phone: '', preferredTime: 'Morning (9AM - 12PM)' });
            setTimeout(() => {
                setCallbackSuccess(false);
                setIsCallbackModalOpen(false);
            }, 3000);
        } catch (error) {
            console.error("Error requesting callback:", error);
            alert("Failed to submit callback request.");
        } finally {
            setCallbackSending(false);
        }
    };

    const handleWhatsAppClick = () => {
        const text = `Hi, I'm interested in viewing your property: "${propertyTitle}" in ${property.location} (Property ID: ${id}). Is it still available?`;
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/1234567890?text=${encodedText}`, '_blank');
    };

    if (loading) return <div className="loading-container">Loading...</div>;
    if (!property) return <div className="error-container">Property not found.</div>;

    const propertyTitle = getLocalized(property.title);
    const propertyDescription = getLocalized(property.description);
    const propertyAmenities = property.amenities && property.amenities.length > 0 ? property.amenities : [
        'Ceiling Fan', 'Dishwasher', 'Disposal', 'Fireplace',
        'Washer/Dryer', 'Oven/Range', 'Refrigerator', 'Microwave'
    ];

    // Prepare gallery images
    let galleryImages = [];
    if (property.media?.galleryImages && property.media.galleryImages.length > 0) {
        galleryImages = property.media.galleryImages;
    } else if (property.images && property.images.length > 0) {
        galleryImages = property.images;
    } else {
        galleryImages = [property.imageURL].filter(Boolean);
    }

    // Use first agent as default if no agent is linked to property
    const displayAgent = agents[0] || {
        name: 'EstatePro Agent',
        photo: '1.jpg',
        phone: '123-456-7890',
        email: 'info@estatepro.com'
    };

    return (
        <div className="listing-details-page-pro">
            <PageCover
                title={propertyTitle}
                homeLink="/"
                currentCrumb="listing"
                backgroundImage={pageCoverBg}
            />

            <section className="property-main-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            {/* Modern Gallery - Large Image Only */}
                            <div className="modern-gallery-mosaic">
                                <div className="mg-large mg-item full-width">
                                    <span className="pro-status-badge">For {property.type === 'sale' ? 'Sale' : 'Rent'}</span>
                                    <img src={getImageUrl(galleryImages[0])} alt={propertyTitle} />

                                    <div className="pro-info-bar">
                                        <div className="pro-price-badge">
                                            {formatPrice(property.price)}
                                        </div>
                                        <div className="pro-title-location">
                                            <h4>{propertyTitle}</h4>
                                            <p><i className="fa-solid fa-location-dot"></i> {property.location}</p>
                                        </div>
                                        <div className="pro-booking-action">
                                            <button
                                                className={`btn-pro-book ${isBooked ? 'booked' : ''}`}
                                                onClick={handlePaymentClick}
                                                disabled={isBooked}
                                            >
                                                {isBooked ? 'Reserved' : 'Book Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pro Quick Stats */}
                            <div className="pro-quick-stats">
                                <div className="stat-box-pro">
                                    <i className="fa-solid fa-arrows-alt"></i> {property.sqft} Sq Ft
                                </div>
                                <div className="stat-box-pro">
                                    <i className="fa-solid fa-bed"></i> {property.beds} Bedrooms
                                </div>
                                <div className="stat-box-pro">
                                    <i className="fa-solid fa-bath"></i> {property.baths} Bathrooms
                                </div>
                            </div>

                            {/* Pro Description */}
                            <div className="pro-content-section">
                                <p>{propertyDescription || "This property is a high-end luxury home with premium finishes and state-of-the-art facilities."}</p>
                            </div>

                            {/* Pro Additional Features (Amenities Grid) */}
                            <div className="pro-content-section">
                                <h3 className="pro-section-title">Additional Features</h3>
                                <div className="pro-features-grid">
                                    {propertyAmenities.map((feat, i) => (
                                        <div key={i} className="pro-feature-item">
                                            <i className="fa-solid fa-circle-check"></i> {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pro Map Section */}
                            <div className="pro-content-section">
                                <h3 className="pro-section-title">Property Location</h3>
                                <div className="pro-map-container">
                                    <iframe
                                        title="Property Location"
                                        width="100%"
                                        height="450"
                                        frameBorder="0"
                                        src={`https://maps.google.com/maps?q=${property.latitude || property.location},${property.longitude || ''}&z=14&output=embed`}
                                    ></iframe>
                                </div>
                            </div>

                            {/* Pro Gallery Carousel Section */}
                            <div className="pro-content-section">
                                <h3 className="pro-section-title">Property Gallery</h3>
                                <div className="pro-carousel-container">
                                    <Carousel
                                        showArrows={true}
                                        showStatus={false}
                                        showThumbs={true}
                                        infiniteLoop={true}
                                        useKeyboardArrows={true}
                                        autoPlay={false}
                                        stopOnHover={true}
                                        swipeable={true}
                                        dynamicHeight={false}
                                        emulateTouch={true}
                                    >
                                        {galleryImages.map((img, idx) => (
                                            <div key={idx} className="carousel-image-item">
                                                <img src={getImageUrl(img)} alt={`Gallery ${idx + 1}`} />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            {/* Pro Sidebar Widgets */}
                            <div className="pro-sidebar">
                                <div className="pro-widget listed-by-widget">
                                    <h4 className="widget-title">Listed by:</h4>
                                    <div className="pro-agent-card">
                                        <div className="agent-image">
                                            <img src={getImageUrl(displayAgent.photo, 'agents')} alt={displayAgent.name} />
                                        </div>
                                        <div className="agent-info">
                                            <h5>{displayAgent.name}</h5>
                                            <div className="agent-social-side">
                                                <a href="#" onClick={(e) => { e.preventDefault(); handleWhatsAppClick(); }} title="WhatsApp Info">
                                                    <i className="fa-brands fa-whatsapp"></i>
                                                </a>
                                                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                                                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                                                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                                <a href={`mailto:${displayAgent.email}`}><i className="fa-solid fa-envelope"></i></a>
                                            </div>
                                        </div>
                                        <div className="agent-contact-icon">
                                            <i className="fa-solid fa-phone"></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="pro-widget inquiry-widget">
                                    <h4 className="widget-title">Property Inquiry</h4>
                                    <form onSubmit={handleMsgSubmit} className="sidebar-inquiry-form">
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Your Name*"
                                                value={msgFormData.name}
                                                onChange={handleMsgInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="Phone Number*"
                                                value={msgFormData.phone}
                                                onChange={handleMsgInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Your Email"
                                                value={msgFormData.email}
                                                onChange={handleMsgInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <textarea
                                                name="message"
                                                placeholder="Message*"
                                                rows="4"
                                                value={msgFormData.message}
                                                onChange={handleMsgInputChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button type="submit" className="btn-send-inquiry" disabled={sending}>
                                            {sending ? 'Sending...' : 'Send Message'}
                                        </button>
                                        {sendSuccess && (
                                            <div className="msg-success-alert">Inquiry sent successfully!</div>
                                        )}
                                    </form>
                                </div>

                                <div className="pro-widget action-buttons-widget">
                                    <button className="btn-sidebar-action callback-btn" onClick={() => setIsCallbackModalOpen(true)}>
                                        <i className="fa-solid fa-phone-volume"></i> Request Callback
                                    </button>
                                    <button className="btn-sidebar-action whatsapp-btn" onClick={handleWhatsAppClick}>
                                        <i className="fa-brands fa-whatsapp"></i> Chat on WhatsApp
                                    </button>
                                </div>

                                <div className="pro-widget">
                                    <h4 className="widget-title">Similar Listings</h4>
                                    <div className="pro-similar-list">
                                        {recentProperties.slice(0, 3).map(rp => (
                                            <div className="pro-similar-item" key={rp._id}>
                                                <img src={getImageUrl(rp.imageURL)} alt={getLocalized(rp.title)} />
                                                <Link to={`/listing-details/${rp._id}`}>{getLocalized(rp.title)}</Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pro-widget">
                                    <h4 className="widget-title">Tags</h4>
                                    <div className="pro-tag-cloud">
                                        {['photography', 'logo', 'house', 'wp', 'travelling', 'sports', 'business', 'racing'].map((tag, i) => (
                                            <span key={i} className="pro-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pro-widget">
                                    <h4 className="widget-title">Text Widget</h4>
                                    <div className="pro-text-widget">
                                        <p>This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum</p>
                                        <p>auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                property={{ id, title: propertyTitle, price: property.price }}
                onPaymentSuccess={handlePaymentSuccess}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="login"
            />

            {/* Callback Modal */}
            {isCallbackModalOpen && (
                <div className="callback-modal-overlay" onClick={() => setIsCallbackModalOpen(false)}>
                    <div className="callback-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-callback" onClick={() => setIsCallbackModalOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <div className="callback-header">
                            <h3><i className="fa-solid fa-phone-volume"></i> Request Callback</h3>
                            <p>Enter your details and we'll call you back at your convenience.</p>
                        </div>
                        {callbackSuccess ? (
                            <div className="callback-success-msg">
                                <i className="fa-solid fa-circle-check"></i>
                                <h4>Request Submitted!</h4>
                                <p>We'll be in touch soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleCallbackSubmit} className="callback-form">
                                <div className="form-group-cb">
                                    <label>Full Name*</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={callbackFormData.name}
                                        onChange={(e) => setCallbackFormData({ ...callbackFormData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group-cb">
                                    <label>Phone Number*</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g., +1 234 567 890"
                                        value={callbackFormData.phone}
                                        onChange={(e) => setCallbackFormData({ ...callbackFormData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group-cb">
                                    <label>Preferred Time*</label>
                                    <select
                                        value={callbackFormData.preferredTime}
                                        onChange={(e) => setCallbackFormData({ ...callbackFormData, preferredTime: e.target.value })}
                                    >
                                        <option>Morning (9AM - 12PM)</option>
                                        <option>Afternoon (12PM - 4PM)</option>
                                        <option>Evening (4PM - 7PM)</option>
                                        <option>Anytime</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-submit-callback" disabled={callbackSending}>
                                    {callbackSending ? 'Submitting...' : 'Call Me Back'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListingDetails;

