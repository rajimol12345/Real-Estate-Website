import React from 'react';
import './HeroSection.css';
import heroBg from '../../assets/images/hero-bg.jpg';

const HeroSection = () => {
    return (
        <section id="slider" className="row" style={{ backgroundImage: `url(${heroBg})` }}>
            <div className="captions">
                <div className="container">
                    <div className="row m0">
                        5/33 Joynton Avenue, Zetland, ASC 1255
                        <span>$244.000</span>
                        <a href="listing-details.html"><i className="fa fa-file-text-o"></i>details</a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
