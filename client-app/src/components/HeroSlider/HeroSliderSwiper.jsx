/**
 * HeroSliderSwiper.jsx
 * Alternative React component using Swiper.js instead of react-slick
 * Swiper is more modern, lighter, and has better touch support
 * 
 * Installation:
 * npm install swiper react-hook-form
 */

import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { useForm, Controller } from 'react-hook-form';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import '../../assets/css/hero-slider.css';

const HeroSliderSwiper = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      propertyType: '',
      location: '',
      beds: '',
      baths: '',
      sqft: '',
      minPrice: '',
      maxPrice: ''
    }
  });

  /**
   * Slider data structure
   * Replace with data from API/CMS
   */
  const slides = [
    {
      id: 1,
      image: '/images/slider/slide-1.jpg',
      price: '$250,000',
      title: 'Beautiful 3BR Home',
      link: '/listing-details/1'
    },
    {
      id: 2,
      image: '/images/slider/slide-2.jpg',
      price: '$350,000',
      title: 'Modern Apartment',
      link: '/listing-details/2'
    },
    {
      id: 3,
      image: '/images/slider/slide-3.jpg',
      price: '$450,000',
      title: 'Luxury Townhouse',
      link: '/listing-details/3'
    },
    {
      id: 4,
      image: '/images/slider/slide-4.jpg',
      price: '$550,000',
      title: 'Executive Condo',
      link: '/listing-details/4'
    },
    {
      id: 5,
      image: '/images/slider/slide-5.jpg',
      price: '$650,000',
      title: 'Estate Property',
      link: '/listing-details/5'
    }
  ];

  // Form submission handler
  const onSubmit = (data) => {
    console.log('Search filters:', data);
    const params = new URLSearchParams(
      Object.fromEntries(Object.entries(data).filter(([_, v]) => v))
    );
    window.location.href = `/listing-grid?${params.toString()}`;
  };

  // Custom navigation handlers
  const handlePrevious = () => {
    swiperInstance?.slidePrev();
  };

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  return (
    <div className="slider-container">
      {/* Swiper Slider */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        onSwiper={setSwiperInstance}
        effect="slide"
        speed={600}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        loopAdditionalSlides={1}
        slidesPerView={1}
        className="hero-swiper-slider"
        aria-label="Property carousel"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <SlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Controls */}
      <div className="custom-swiper-navigation">
        <ul className="flex-direction-nav">
          <li>
            <button
              className="flex-prev"
              onClick={handlePrevious}
              aria-label="Previous slide"
              type="button"
              title="Previous property"
            >
              <i className="fa fa-chevron-left"></i>
            </button>
          </li>
          <li className="flex-nav-prev">
            <button
              className="flex-next"
              onClick={handleNext}
              aria-label="Next slide"
              type="button"
              title="Next property"
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </div>

      {/* Property Search Form */}
      <PropertySearchFormSwiper control={control} onSubmit={handleSubmit(onSubmit)} />
    </div>
  );
};

/**
 * SlideContent Component
 * Individual slide with caption overlay
 */
const SlideContent = ({ slide }) => {
  return (
    <div className="slider-slide-wrapper">
      <img
        src={slide.image}
        alt={slide.title}
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/placeholder.jpg'; // Fallback image
        }}
      />
      <div className="captions">
        <div className="container">
          <div className="row">
            <span className="sale-price" title={`Price: ${slide.price}`}>
              {slide.price}
            </span>
            <a
              href={slide.link}
              className="view-details"
              title={`View details for ${slide.title}`}
            >
              <i className="fa fa-link"></i> View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PropertySearchFormSwiper Component
 * Search form with form validation
 */
const PropertySearchFormSwiper = ({ control, onSubmit }) => {
  return (
    <section id="search" className="homepage_search">
      <div className="searchForm">
        <div className="formTitle">
          find your<span>House</span>
        </div>

        <form className="form_elements" onSubmit={onSubmit} noValidate>
          {/* Property Type */}
          <FormSelect
            label="Property Type"
            name="propertyType"
            control={control}
            className="propertyType"
            options={[
              { value: '', label: 'Any' },
              { value: 'apartment', label: 'Apartment' },
              { value: 'house', label: 'House' },
              { value: 'townhouse', label: 'Townhouse' },
              { value: 'condo', label: 'Condo' },
              { value: 'villa', label: 'Villa' }
            ]}
          />

          {/* Location */}
          <FormSelect
            label="Location"
            name="location"
            control={control}
            className="propertyLocation"
            options={[
              { value: '', label: 'Any' },
              { value: 'newyork', label: 'New York' },
              { value: 'losangeles', label: 'Los Angeles' },
              { value: 'chicago', label: 'Chicago' },
              { value: 'houston', label: 'Houston' },
              { value: 'phoenix', label: 'Phoenix' },
              { value: 'philadelphia', label: 'Philadelphia' },
              { value: 'sanantonio', label: 'San Antonio' }
            ]}
          />

          {/* Beds */}
          <FormSelect
            label="Beds"
            name="beds"
            control={control}
            className="beds"
            options={[
              { value: '', label: 'Any' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4+' }
            ]}
          />

          {/* Baths */}
          <FormSelect
            label="Baths"
            name="baths"
            control={control}
            className="baths"
            options={[
              { value: '', label: 'Any' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3+' }
            ]}
          />

          {/* Sq Ft */}
          <FormSelect
            label="Sq Ft"
            name="sqft"
            control={control}
            className="sqft"
            options={[
              { value: '', label: 'Any' },
              { value: '1000', label: '1000+' },
              { value: '2000', label: '2000+' },
              { value: '3000', label: '3000+' },
              { value: '5000', label: '5000+' }
            ]}
          />

          {/* Min Price */}
          <FormSelect
            label="Min Price"
            name="minPrice"
            control={control}
            className="minPrice"
            options={[
              { value: '', label: 'Any' },
              { value: '100000', label: '$100,000' },
              { value: '250000', label: '$250,000' },
              { value: '500000', label: '$500,000' },
              { value: '750000', label: '$750,000' },
              { value: '1000000', label: '$1,000,000' }
            ]}
          />

          {/* Max Price */}
          <FormSelect
            label="Max Price"
            name="maxPrice"
            control={control}
            className="maxPrice"
            options={[
              { value: '', label: 'Any' },
              { value: '300000', label: '$300,000' },
              { value: '500000', label: '$500,000' },
              { value: '750000', label: '$750,000' },
              { value: '1000000', label: '$1,000,000' },
              { value: '2000000', label: '$2,000,000' }
            ]}
          />

          {/* Submit Button */}
          <div className="form_element">
            <button type="submit" className="btn btn-search" aria-label="Search properties">
              <i className="fa fa-search"></i> Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

/**
 * Reusable FormSelect Component
 * Reduces code duplication for select fields
 */
const FormSelect = ({ label, name, control, className, options }) => {
  return (
    <div className="form_element">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            {...field}
            id={name}
            className={`bootstrap-select ${className}`}
            aria-label={label}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
};

export default HeroSliderSwiper;
