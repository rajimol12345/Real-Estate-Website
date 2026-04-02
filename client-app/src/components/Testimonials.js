import React, { useState, useEffect } from 'react';
import './Testimonials.css';

// Import images
import client1 from '../assets/images/agents/1.jpg';
import client2 from '../assets/images/agents/2.jpg';
import client3 from '../assets/images/agents/3.jpg';
import client4 from '../assets/images/agents/4.jpg';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "John Smith",
            position: "CEO at Evanto",
            image: client1,
            text: "This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit."
        },
        {
            id: 2,
            name: "Emily Blunt",
            position: "Designer at Pixel",
            image: client2,
            text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution."
        },
        {
            id: 3,
            name: "Michael Chen",
            position: "Manager at Tech",
            image: client3,
            text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
        },
        {
            id: 4,
            name: "Sarah Jenkins",
            position: "Director at Blue",
            image: client4,
            text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable."
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <section className="testimonials-fidelity-section">
            <div className="container-fluid px-5">
                <div className="section-title text-center">
                    <h2>Client Testimonials</h2>
                    <div className="yellow-separator"></div>
                </div>

                <div className="testimonial-carousel-box">
                    <div className="testimonial-dots-box">
                        {testimonials.map((_, index) => (
                            <span
                                key={index}
                                className={`testimonial-dot-fid ${activeIndex === index ? 'active' : ''}`}
                                onClick={() => handleDotClick(index)}
                            ></span>
                        ))}
                    </div>

                    <div className="testimonial-content-fidelity">
                        <div className="testimonial-photo-wrapper">
                            <img src={testimonials[activeIndex].image} alt={testimonials[activeIndex].name} />
                        </div>

                        <div className="client-badge-fid">
                            {testimonials[activeIndex].name}, {testimonials[activeIndex].position}
                        </div>

                        <div className="testimonial-arrow-pointer">
                            <i className="fa-solid fa-angle-down"></i>
                        </div>

                        <div className="testimonial-bubble-fid">
                            <p>"{testimonials[activeIndex].text}"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
