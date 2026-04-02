import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './NewHeader.css'; // Custom CSS for NewHeader

// Placeholder for logo and hero background image
import estateproLogo from '../../assets/icons/estatepro-logo.png'; // Assuming this is the correct path for your logo
import pageCoverBg from '../../assets/images/slider/1.jpg'; // For hero section placeholder

const NewHeader = () => {
    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`estatepro-header fixed-top ${isSticky ? 'scrolled' : ''}`}>
            {/* Top Bar */}
            <div className="top-bar py-2">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="contact-info">
                        <span className="me-3"><i className="fas fa-phone-alt me-1"></i> +1 234 567 890</span>
                        <span><i className="fas fa-envelope me-1"></i> mail@example.com</span>
                    </div>
                    <div className="social-icons">
                        <a href="#" className="text-white me-2"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-white me-2"><i className="fab fa-twitter"></i></a>
                        <a href="#" className="text-white me-2"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>

            {/* Main Header / Navbar */}
            <nav className="main-navbar navbar navbar-expand-lg py-3">
                <div className="container">
                    <NavLink className="navbar-brand d-flex align-items-baseline" to="/">
                        <span className="logo-estate">estate</span><span className="logo-pro">PRO</span>
                    </NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" aria-current="page" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" to="/properties" id="propertiesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Properties
                                </NavLink>
                                <ul className="dropdown-menu mega-menu" aria-labelledby="propertiesDropdown">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <li><h6 className="dropdown-header">Property Types</h6></li>
                                            <li><NavLink className="dropdown-item" to="#">Apartments</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Villas</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Houses</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Land</NavLink></li>
                                        </div>
                                        <div className="col-lg-4">
                                            <li><h6 className="dropdown-header">Locations</h6></li>
                                            <li><NavLink className="dropdown-item" to="#">New York</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Los Angeles</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Chicago</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Miami</NavLink></li>
                                        </div>
                                        <div className="col-lg-4">
                                            <li><h6 className="dropdown-header">Features</h6></li>
                                            <li><NavLink className="dropdown-item" to="#">With Pool</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Waterfront</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">New Construction</NavLink></li>
                                            <li><NavLink className="dropdown-item" to="#">Luxury Homes</NavLink></li>
                                        </div>
                                    </div>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/agents">Agents</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" to="/pages" id="pagesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pages
                                </NavLink>
                                <ul className="dropdown-menu" aria-labelledby="pagesDropdown">
                                    <li><NavLink className="dropdown-item" to="/about">About Us</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/blog2">Blog Grid</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/single-post">Blog Details</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/contact">Contact Us</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/blog">Blog</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                        <NavLink to="/submit-property" className="btn btn-primary-green ms-lg-3">Submit Property</NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NewHeader;
