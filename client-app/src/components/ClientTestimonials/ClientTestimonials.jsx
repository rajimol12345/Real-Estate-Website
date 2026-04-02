import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import { useTranslation } from 'react-i18next';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './ClientTestimonials.css';

import clientImage from '../../assets/images/client.png';

const ClientTestimonials = () => {
    const { t } = useTranslation();

    const testimonials = [
        {
            image: clientImage,
            nameKey: 'testimonials.client1_name',
            textKey: 'testimonials.client1_text'
        },
        {
            image: clientImage,
            nameKey: 'testimonials.client2_name',
            textKey: 'testimonials.client2_text'
        }
    ];

    return (
        <section className="row m0 pt70 testimonial_carousel">
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 text-center">
                        <h2 className="section_title">{t('testimonials.title')}</h2>
                    </div>
                </div>
                <div className="row">
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={5000}
                        showArrows={false}
                        emulateTouch={true}
                    >
                        {testimonials.map((testimonial, index) => (
                            <div className="item" key={index}>
                                <div className="clientsImage">
                                    <img src={testimonial.image} alt={t(testimonial.nameKey)} />
                                </div>
                                <div className="clientDetails">
                                    {t(testimonial.nameKey)}
                                </div>
                                <span className="arrow_down"><i className="fa fa-arrow-down"></i></span>
                                <div className="testimonial_texts">
                                    <div className="inner">
                                        {t(testimonial.textKey)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default ClientTestimonials;