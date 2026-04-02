import React, { useState } from 'react';
import './PartnersLogos.css';

// Import local partner logos
import partner1 from '../../assets/images/partners/1.png';
import partner2 from '../../assets/images/partners/2.png';
import partner3 from '../../assets/images/partners/3.png';
import partner4 from '../../assets/images/partners/4.png';

const PartnersLogos = () => {
    const logos = [partner1, partner2, partner3, partner4];
    // Duplicate logos to ensure enough items for the carousel
    const allLogos = [...logos, ...logos];
    const [currentIndex, setCurrentIndex] = useState(0);
    const visibleCount = 4;

    const nextSlide = () => {
        if (currentIndex < allLogos.length - visibleCount) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // Loop back
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(Math.max(0, allLogos.length - visibleCount)); // Loop to end
        }
    };

    return (
        <section className="partners-fidelity-section">
            <div className="container">
                <div className="section-title text-center">
                    <h2>Our Partners</h2>
                    <div className="yellow-separator"></div>
                </div>

                <div className="carousel-controls text-center">
                    <div className="btn-group-fid">
                        <button onClick={prevSlide} className="carousel-btn">
                            <i className="fa-solid fa-angle-left"></i>
                        </button>
                        <button onClick={nextSlide} className="carousel-btn">
                            <i className="fa-solid fa-angle-right"></i>
                        </button>
                    </div>
                </div>

                <div className="partners-carousel-wrapper">
                    <div
                        className="partners-carousel-inner"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                            width: `${(allLogos.length / visibleCount) * 100}%`
                        }}
                    >
                        {allLogos.map((logo, index) => (
                            <div
                                className="partner-carousel-item"
                                key={index}
                                style={{ width: `${100 / allLogos.length}%` }}
                            >
                                <div className="partner-logo-box-fidelity">
                                    <img src={logo} alt={`Partner ${index + 1}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnersLogos;
