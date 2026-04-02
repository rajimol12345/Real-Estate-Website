import React from 'react';
import './SellOrRent.css';

const SellOrRent = () => {
    return (
        <section className="sell-or-rent-section">
            <div className="container">
                <div className="cta-content">
                    <div className="cta-text">
                        <h2>Sell <span>or</span> Rent</h2>
                        <p>Your Property</p>
                    </div>
                    <div className="cta-button">
                        <a href="/contact" className="btn-cta">CLICK HERE</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellOrRent;
