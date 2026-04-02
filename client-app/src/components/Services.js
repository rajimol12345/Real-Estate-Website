import React from 'react';
import './Services.css';

const Services = () => {
    const servicesData = [
        {
            title: "Property Management",
            icon: "fa-solid fa-house",
            link: "#"
        },
        {
            title: "Free Market Analysis",
            icon: "fa-solid fa-chart-line",
            link: "#"
        },
        {
            title: "Sale Services",
            icon: "fa-solid fa-tags",
            link: "#"
        },
        {
            title: "Renting Services",
            icon: "fa-solid fa-hand-peace",
            link: "#"
        }
    ];

    return (
        <section className="services-fidelity-section">
            <div className="container-fluid px-5">
                <div className="section-title text-center">
                    <h2>Estate Pro Services</h2>
                    <div className="yellow-separator"></div>
                </div>
                <div className="services-grid-fid">
                    {servicesData.map((service, index) => (
                        <div key={index} className="service-card-fidelity">
                            <div className="service-card-top">
                                <h3>{service.title}</h3>
                                <div className="service-icon-circle">
                                    <i className={service.icon}></i>
                                </div>
                            </div>
                            <div className="service-card-footer">
                                <a href={service.link} className="read-more-fid">+ READ MORE</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
