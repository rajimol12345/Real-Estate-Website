import React from 'react';
import PageCover from '../components/PageCover/PageCover';
import './OwnerInfo.css';
import pageCoverBg from '../assets/images/slider/1.jpg';
import agent1 from '../assets/images/agents/1.jpg';

const OwnerInfo = () => {
    return (
        <div className="owner-info-page">
            <PageCover title="Owner Information" homeLink="/" currentCrumb="Owner Profile" backgroundImage={pageCoverBg} />

            <section className="owner-section">
                <div className="container">
                    <div className="owner-profile-card">
                        <div className="row align-items-center">
                            <div className="col-md-3 text-center">
                                <div className="owner-avatar-large">
                                    <img src={agent1} alt="Owner" />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="owner-data-content">
                                    <h2 className="owner-name">David Walter</h2>
                                    <p className="owner-title">Property Owner / Investor</p>
                                    <div className="owner-contact-details">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <p><i className="fa-solid fa-phone"></i> +1 234 567 8900</p>
                                            </div>
                                            <div className="col-md-4">
                                                <p><i className="fa-solid fa-envelope"></i> david.walter@example.com</p>
                                            </div>
                                            <div className="col-md-4">
                                                <p><i className="fa-solid fa-location-dot"></i> New York, NY</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="owner-bio">David is a veteran property owner with over 20 years of experience in the luxury real estate market. He specializes in high-end residential properties and commercial investments across the tri-state area.</p>
                                    <div className="owner-socials">
                                        <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                                        <a href="#"><i className="fa-brands fa-twitter"></i></a>
                                        <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="owner-listings mt-5">
                        <h3 className="section-subtitle">Property <span>Listings by David</span></h3>
                        <div className="row mt-4">
                            {/* Placeholder for owner's properties - could reuse ListingCard here */}
                            <p className="text-muted ml-3">Currently displaying 0 active listings.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OwnerInfo;
