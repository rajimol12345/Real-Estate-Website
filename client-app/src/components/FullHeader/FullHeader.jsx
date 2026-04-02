import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import './FullHeader.css'; // Assuming we'll create a dedicated CSS file for this component
import logo from '../../assets/images/logo.png'; // Path to the copied logo

const FullHeader = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`estatepro-header fixed-top ${scrolled ? 'scrolled' : ''}`}>
            {/* Top Bar */}
            <div className={`top-bar py-2 ${scrolled ? 'd-none' : ''}`}>
                <div className="container d-flex justify-content-end align-items-center">
                    <div className="d-flex align-items-center">
                        <a href="#" className="text-white me-3 text-decoration-none"><i className="fas fa-user me-1"></i> Login</a>
                        <a href="#" className="text-white me-3 text-decoration-none"><i className="fas fa-user-plus me-1"></i> Register</a>
                        <div className="dropdown me-3">
                            <a className="text-white dropdown-toggle text-decoration-none" href="#" role="button" id="currencyDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                USD
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="currencyDropdown">
                                <li><a className="dropdown-item" href="#">USD</a></li>
                                <li><a className="dropdown-item" href="#">Pound</a></li>
                                <li><a className="dropdown-item" href="#">Yen</a></li>
                                <li><a className="dropdown-item" href="#">Euro</a></li>
                            </ul>
                        </div>
                        <div className="dropdown">
                            <a className="text-white dropdown-toggle text-decoration-none" href="#" role="button" id="languageDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                English
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                                <li><a className="dropdown-item" href="#">English</a></li>
                                <li><a className="dropdown-item" href="#">Bengali</a></li>
                                <li><a className="dropdown-item" href="#">German</a></li>
                                <li><a className="dropdown-item" href="#">Dutch</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header / Navbar */}
            <nav className="main-navbar navbar navbar-expand-lg py-3">
                <div className="container">
                    <a className="navbar-brand" href="#">
                        <img src={logo} alt="EstatePro Logo" style={{ height: '40px' }} />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" activeclassname="active" to="/properties" id="propertiesDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Properties</NavLink>
                                <ul className="dropdown-menu" aria-labelledby="propertiesDropdown">
                                    <li><NavLink className="dropdown-item" to="/listing-grid">Listing Grid</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/listing-list">Listing List</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/listing-details">Listing Details</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/gallery">Gallery</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" activeclassname="active" to="#" id="usersDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Users</NavLink>
                                <ul className="dropdown-menu" aria-labelledby="usersDropdown">
                                    <li><NavLink className="dropdown-item" to="#">Existing User</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="#">Owner Info</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" activeclassname="active" to="/agents" id="agentsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Agents</NavLink>
                                <ul className="dropdown-menu" aria-labelledby="agentsDropdown">
                                    <li><NavLink className="dropdown-item" to="/agents">Agents</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/agent-details">Agents Details</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" activeclassname="active" to="/blog" id="blogDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">Blog</NavLink>
                                <ul className="dropdown-menu" aria-labelledby="blogDropdown">
                                    <li><NavLink className="dropdown-item" to="/blog2col">Blog 2 Column</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/blog3col">Blog 3 Column</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/single-post">Single Post</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" activeclassname="active" to="/contact">Contact</NavLink>
                            </li>
                        </ul>
                        <NavLink to="/submit-property" className="btn btn-primary-green ms-lg-3">Submit Property</NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default FullHeader;