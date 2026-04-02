import React from 'react';
import PageCover from '../components/PageCover/PageCover';
import Agents from '../components/Agents'; // Reusing the high-fidelity carousel
import './About.css';
import pageCoverBg from '../assets/images/slider/1.jpg';
import aboutMainImg from '../assets/images/listing/1.jpg';

const About = () => {
    return (
        <div className="about-page">
            <PageCover
                title="About Us"
                homeLink="/"
                currentCrumb="About Us"
                backgroundImage={pageCoverBg}
            />

            <section className="about-main-section">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="about-image-box">
                                <img src={aboutMainImg} alt="About EstatePro" className="img-fluid" />
                                <div className="experience-badge">
                                    <span>25+</span>
                                    <p>Years of <br />Experience</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="about-text-content">
                                <span className="sub-title">Welcome to EstatePro</span>
                                <h2>Modern Estate Agent <span>Service</span></h2>
                                <p>This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.</p>
                                <p>Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit.</p>

                                <ul className="about-features">
                                    <li><i className="fa-solid fa-check"></i> High Quality Property Services</li>
                                    <li><i className="fa-solid fa-check"></i> Expert Real Estate Agents</li>
                                    <li><i className="fa-solid fa-check"></i> Comprehensive Market Analysis</li>
                                    <li><i className="fa-solid fa-check"></i> Personalized Client Support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-stats-section">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 col-6">
                            <div className="stat-box">
                                <i className="fa-solid fa-house-circle-check"></i>
                                <h3>850</h3>
                                <p>Properties Sold</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="stat-box">
                                <i className="fa-solid fa-users"></i>
                                <h3>120</h3>
                                <p>Expert Agents</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="stat-box">
                                <i className="fa-solid fa-face-smile"></i>
                                <h3>950</h3>
                                <p>Satisfied Clients</p>
                            </div>
                        </div>
                        <div className="col-md-3 col-6">
                            <div className="stat-box">
                                <i className="fa-solid fa-award"></i>
                                <h3>15</h3>
                                <p>Awards Won</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reusing the high-fidelity Agents carousel for the "Our Team" feel */}
            <Agents />
        </div>
    );
};

export default About;
