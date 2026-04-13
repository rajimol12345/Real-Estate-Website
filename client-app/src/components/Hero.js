import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './Hero.css';

// Import slider images
import slide1 from '../assets/images/slider/1.jpg';
import slide2 from '../assets/images/slider/2.jpg';
import slide3 from '../assets/images/slider/3.jpg';
import slide4 from '../assets/images/slider/4.jpg';
import slide5 from '../assets/images/slider/5.jpg';
import slide6 from '../assets/images/slider/6.jpg';
import slide7 from '../assets/images/slider/7.jpg';
import slide8 from '../assets/images/slider/8.jpg';

const Hero = ({ onFilter }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [formData, setFormData] = useState({
        type: 'any',
        location: 'any',
        beds: 'any',
        baths: 'any',
        sqft: 'any',
        minPrice: 'any',
        maxPrice: 'any',
        keyword: ''
    });

    const slides = [
        { id: 1, image: slide1, address: "5/33 Joynton Avenue, Zetland, ASC 1255", price: "$244.000" },
        { id: 2, image: slide2, address: "4/82 Chicago, Warners Bay, NSW 2282", price: "$359.000" },
        { id: 3, image: slide3, address: "1/57 New York Avenue, Warners Bay, NSW 2282", price: "$359.000" },
        { id: 4, image: slide4, address: "4/82 Chicago, Warners Bay, NSW 2282", price: "$359.000" },
        { id: 5, image: slide5, address: "5/33 Joynton Avenue, Zetland, ASC 1255", price: "$244.000" },
        { id: 6, image: slide6, address: "1/57 New York Avenue, Warners Bay, NSW 2282", price: "$359.000" },
        { id: 7, image: slide7, address: "4/82 Chicago, Warners Bay, NSW 2282", price: "$359.000" },
        { id: 8, image: slide8, address: "1/57 New York Avenue, Warners Bay, NSW 2282", price: "$359.000" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        // Real-time update
        if (onFilter) onFilter(newFormData);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        
        // Construct query string
        const params = new URLSearchParams();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== 'any' && value !== '') {
                params.append(key, value);
            }
        });
        
        // Navigate to properties page with filters
        navigate(`/properties?${params.toString()}`);
    };

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <section className="hero">
            <div className="hero-carousel-wrapper">
                <Carousel
                    selectedItem={currentSlide}
                    onChange={(index) => setCurrentSlide(index)}
                    showArrows={false}
                    showStatus={false}
                    showThumbs={false}
                    infiniteLoop={true}
                    autoPlay={true}
                    interval={5000}
                    stopOnHover={false}
                    animationHandler="fade"
                    transitionTime={1000}
                    swipeable={false}
                >
                    {slides.map((slide) => (
                        <div key={slide.id} className="hero-slide">
                            <img src={slide.image} alt={`EstatePro Slide ${slide.id}`} />
                        </div>
                    ))}
                </Carousel>
            </div>

            <div className="container hero-container">
                <div className="hero-content-wrap">
                    {/* High Fidelity Property Info Bar */}
                    <div className="hero-info-bar-fidelity">
                        <div className="header-info-bar-left">
                            <span className="hero-info-address">{slides[currentSlide].address}</span>
                        </div>
                        <div className="hero-info-bar-right">
                            <a href="#!" className="hero-btn-details-fid">
                                <i className="fa-regular fa-file-lines"></i> {t('hero.details')}
                            </a>
                            <div className="hero-price-tag-fid">{slides[currentSlide].price}</div>
                            <div className="hero-slider-nav-fid">
                                <button className="hero-nav-btn-fid prev" onClick={prevSlide}>
                                    <i className="fa-solid fa-angle-left"></i>
                                </button>
                                <button className="hero-nav-btn-fid next" onClick={nextSlide}>
                                    <i className="fa-solid fa-angle-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* High Fidelity Search Box */}
                    <div className="hero-search-box-fidelity">
                        <div className="search-title-box">
                            <div className="title-inner">
                                <span className="find-text">{t('hero.find_your')} <span className="yellow-line-hero"></span></span>
                                <h2>{t('hero.house')}</h2>
                            </div>
                        </div>

                        <div className="search-fields-container">
                            <form onSubmit={handleSearch} className="horizontal-form-hero">
                                <div className="fields-grid-hero">
                                    <div className="field-col">
                                        <label>{t('search.keyword')}</label>
                                        <input
                                            type="text"
                                            name="keyword"
                                            placeholder={t('search.keyword_placeholder') || "Search title, desc..."}
                                            value={formData.keyword}
                                            onChange={handleInputChange}
                                            className="hero-keyword-input"
                                        />
                                    </div>
                                    <div className="field-col">
                                        <label>{t('search.property_type')}</label>
                                        <select name="type" value={formData.type} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            <option value="House">House</option>
                                            <option value="Apartment">Apartment</option>
                                            <option value="Villa">Villa</option>
                                            <option value="Commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('search.location')}</label>
                                        <select name="location" value={formData.location} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            <option value="Portland">Portland</option>
                                            <option value="Chicago">Chicago</option>
                                            <option value="Boston">Boston</option>
                                            <option value="Denver">Denver</option>
                                            <option value="Los Angeles">Los Angeles</option>
                                            <option value="Naples">Naples</option>
                                            <option value="Manhattan">Manhattan</option>
                                            <option value="Austin">Austin</option>
                                            <option value="Miami Beach">Miami Beach</option>
                                            <option value="San Francisco">San Francisco</option>
                                            <option value="Seattle">Seattle</option>
                                            <option value="Beverly Hills">Beverly Hills</option>
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('search.beds')}</label>
                                        <select name="beds" value={formData.beds} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            {[1, 2, 3, 4, 5, 6].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('hero.baths')}</label>
                                        <select name="baths" value={formData.baths} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('hero.sqft')}</label>
                                        <select name="sqft" value={formData.sqft} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            <option value="500">500+</option>
                                            <option value="1000">1000+</option>
                                            <option value="2000">2000+</option>
                                            <option value="3000">3000+</option>
                                            <option value="4000">4000+</option>
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('hero.min_price')}</label>
                                        <select name="minPrice" value={formData.minPrice} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            {[1000, 5000, 10000, 50000, 100000].map(val => (
                                                <option key={val} value={val}>${val.toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-col">
                                        <label>{t('hero.max_price')}</label>
                                        <select name="maxPrice" value={formData.maxPrice} onChange={handleInputChange}>
                                            <option value="any">{t('search.any')}</option>
                                            {[50000, 100000, 500000, 1000000, 5000000].map(val => (
                                                <option key={val} value={val}>${val.toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="field-col btn-col">
                                        <button type="submit" className="btn-hero-search">{t('search.search_btn')}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
