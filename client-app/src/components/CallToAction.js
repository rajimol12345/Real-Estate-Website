import React from 'react';
import './CallToAction.css';

// Import the house asset found in previous turns
import houseImg from '../assets/images/foot-brand.png';

const CallToAction = () => {
    return (
        <section className="cta-fidelity-section-blue">
            <div className="container-fluid px-5">
                <div className="cta-fidelity-content-wrapper">
                    <div className="cta-house-image-box">
                        <img src={houseImg} alt="House" className="cta-house-img" />
                    </div>
                    <div className="cta-text-content-box">
                        <div className="cta-title-group">
                            <h2 className="cta-main-title">Sell <span>or</span> <strong>Rent</strong></h2>
                            <div className="cta-yellow-line"></div>
                            <p className="cta-sub-title">Your Property</p>
                        </div>
                    </div>
                    <div className="cta-button-box">
                        <a href="/contact" className="btn-cta-outline-fid">CLICK HERE</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;
