/**
 * HeroSlider.jsx - with i18n support
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: require('../../assets/images/slider/slider-1.jpg'),
      address: "1/57 New York Avenue, Warners Bay, NSW 2282",
      price: "$359.000"
    },
    {
      id: 2,
      image: require('../../assets/images/slider/slider-2.jpg'),
      address: "4/82 Chicago, Warners Bay, NSW 2282",
      price: "$359.000"
    },
    {
      id: 3,
      image: require('../../assets/images/slider/slider-3.jpg'),
      address: "5/33 Joynton Avenue, Zetland, ASC 1255",
      price: "$244.000"
    }
  ];

  return (
    <div className="hero-slider-wrapper">
      <Carousel
        selectedItem={currentSlide}
        onChange={setCurrentSlide}
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={7000}
        transitionTime={600}
        showIndicators={false}
        dynamicHeight={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) => (
          <button type="button" onClick={onClickHandler} className="hero-carousel-arrow hero-carousel-arrow-prev" title={label} aria-label="Previous slide">
            <i className="fa fa-angle-left"></i>
          </button>
        )}
        renderArrowNext={(onClickHandler, hasNext, label) => (
          <button type="button" onClick={onClickHandler} className="hero-carousel-arrow hero-carousel-arrow-next" title={label} aria-label="Next slide">
            <i className="fa fa-angle-right"></i>
          </button>
        )}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="hero-slide">
            <img src={slide.image} alt={slide.address} className="hero-slide-image" />
            <div className="hero-slide-info-overlay">
              <div className="slide-info-content">
                <div className="slide-info-left">
                  <p className="slide-address">{slide.address}</p>
                </div>
                <div className="slide-info-right">
                  <a href="#details" className="slide-details-link">
                    <i className="fa fa-file-text-o"></i><SlideDetailsLabel />
                  </a>
                  <div className="slide-price-badge">{slide.price}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
      <SearchPanel />
    </div>
  );
};

// Small helper to get the translated word in the slide overlay
const SlideDetailsLabel = () => {
  const { t } = useTranslation();
  return <>{t('hero.details')}</>;
};

const SearchPanel = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    propertyType: 'any',
    location: 'any',
    beds: 'any',
    baths: 'any',
    sqft: 'any',
    minPrice: 'any',
    maxPrice: 'any'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', formData);
  };

  return (
    <div className="hero-search-panel">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-form-title">
          <div className="form-title-text">{t('hero.find_your')}</div>
          <div className="form-title-highlight">{t('hero.house')}</div>
        </div>
        <div className="search-fields-container">
          <div className="search-field">
            <label>{t('hero.property_type')}</label>
            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="apartment">apartment</option>
              <option value="house">house</option>
              <option value="townhouse">townhouse</option>
              <option value="condo">condo</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.location')}</label>
            <select name="location" value={formData.location} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="newyork">New York</option>
              <option value="chicago">Chicago</option>
              <option value="losangeles">Los Angeles</option>
              <option value="houston">Houston</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.beds')}</label>
            <select name="beds" value={formData.beds} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.baths')}</label>
            <select name="baths" value={formData.baths} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3+</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.sqft')}</label>
            <select name="sqft" value={formData.sqft} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="1000">1000+</option>
              <option value="2000">2000+</option>
              <option value="3000">3000+</option>
              <option value="5000">5000+</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.min_price')}</label>
            <select name="minPrice" value={formData.minPrice} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="100000">$100,000</option>
              <option value="250000">$250,000</option>
              <option value="500000">$500,000</option>
              <option value="750000">$750,000</option>
            </select>
          </div>
          <div className="search-field">
            <label>{t('hero.max_price')}</label>
            <select name="maxPrice" value={formData.maxPrice} onChange={handleChange} className="search-select">
              <option value="any">{t('hero.any')}</option>
              <option value="300000">$300,000</option>
              <option value="500000">$500,000</option>
              <option value="750000">$750,000</option>
              <option value="1000000">$1,000,000</option>
            </select>
          </div>
        </div>
        <button type="submit" className="search-button">{t('hero.search')}</button>
      </form>
    </div>
  );
};

export default HeroSlider;
