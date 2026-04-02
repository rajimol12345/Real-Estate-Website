import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PageCover from '../components/PageCover/PageCover';
import { propertyService, messageService } from '../services/api';
import { LanguageContext } from '../context/LanguageContext';
import { getImageUrl } from '../utils/helpers';
import './Contact.css';
import pageCoverBg from '../assets/images/slider/8.jpg';

const Contact = () => {
    const { getLocalized } = useContext(LanguageContext);
    const [similarListings, setSimilarListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', website: '', message: '' });
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                const response = await propertyService.getAll();
                const listings = response.data.properties || response.data;
                const listingsArray = Array.isArray(listings) ? listings : [];
                setSimilarListings(listingsArray.slice(0, 3));
            } catch (error) {
                console.error("Error fetching similar listings:", error);
            } finally {
                setLoadingListings(false);
            }
        };
        fetchSimilar();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        try {
            await messageService.send(formData);
            setSendSuccess(true);
            setFormData({ name: '', email: '', website: '', message: '' });
            setTimeout(() => setSendSuccess(false), 5000);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="contact-page-fidelity">
            <PageCover title="Contact Us" homeLink="/" currentCrumb="contact us" backgroundImage={pageCoverBg} />

            <section className="contact-content-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 main-column">
                            {/* Map Section */}
                            <div className="map-container-fidelity">
                                <iframe
                                    title="office-map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059669866!2d-74.25986763403565!3d40.69714940348705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy">
                                </iframe>
                                <div className="map-floating-buttons">
                                    <button className="map-btn"><i className="fa-solid fa-phone"></i></button>
                                    <button className="map-btn"><i className="fa-solid fa-envelope"></i></button>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="leave-comment-section-fidelity">
                                <h3 className="section-subtitle-fidelity">Leave a Comment</h3>
                                {sendSuccess && <div className="alert alert-success mt-2">Your message has been sent successfully!</div>}
                                <form className="fidelity-contact-form" onSubmit={handleSubmit}>
                                    <div className="form-left-col">
                                        <div className="input-group-fidelity">
                                            <div className="icon-circle-fid">
                                                <i className="fa-regular fa-user"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group-fidelity">
                                            <div className="icon-circle-fid">
                                                <i className="fa-regular fa-envelope"></i>
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="e-mail"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="input-group-fidelity">
                                            <div className="icon-circle-fid">
                                                <i className="fa-solid fa-link"></i>
                                            </div>
                                            <input
                                                type="text"
                                                name="website"
                                                placeholder="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-right-col">
                                        <div className="textarea-wrapper-fid">
                                            <textarea
                                                name="message"
                                                placeholder="Message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn-send-fidelity-block"
                                            disabled={isSending}
                                        >
                                            {isSending ? 'SENDING...' : 'SEND MESSAGE'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-md-4 sidebar-column">
                            {/* Similar Listings Widget */}
                            <div className="sidebar-widget-fidelity">
                                <h4 className="widget-title">Similar Listings</h4>
                                <div className="similar-listings-list">
                                    {loadingListings ? (
                                        <p>Loading...</p>
                                    ) : (
                                        similarListings.map((prop, idx) => {
                                            const title = getLocalized(prop.title);
                                            return (
                                                <div className="similar-item" key={prop._id || idx}>
                                                    <div className="similar-thumb">
                                                        <img src={getImageUrl(prop.media?.featuredImage || prop.imageURL)} alt={title} />
                                                    </div>
                                                    <div className="similar-info">
                                                        <Link to={`/listing-details/${prop._id}`}>{title}</Link>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            {/* Tags Widget */}
                            <div className="sidebar-widget-fidelity">
                                <h4 className="widget-title">Tags</h4>
                                <div className="tags-cloud">
                                    {['photography', 'logo', 'house', 'wp', 'photography', 'photography', 'travelling', 'sports', 'business', 'racing'].map((tag, i) => (
                                        <span key={i} className="tag-item">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Text Widget */}
                            <div className="sidebar-widget-fidelity">
                                <h4 className="widget-title">Text Widget</h4>
                                <div className="text-widget-content">
                                    <p>This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum</p>
                                    <p>auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
