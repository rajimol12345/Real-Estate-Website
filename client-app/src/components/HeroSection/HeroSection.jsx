import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
    return (
        <section id="slider" className="hero-section">
            <div className="captions">
                <div className="container">
                    <div className="inner-cap">
                        5/33 Joynton Avenue, Zetland, ASC 1255 
                        <strong style={{ fontSize: '22px', marginLeft: '10px' }}>$244,000</strong>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;