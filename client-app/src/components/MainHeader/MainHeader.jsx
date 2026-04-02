import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './MainHeader.css';
import logo from '../../assets/images/icons/logo.png'; // Adjust path for client-app

const MainHeader = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };

  return (
    <nav className="main-navbar">
      <div className="container">
        <div className="header-inner">
          <NavLink to="/" className="logo-container">
            <div className="logo-text">
              <span className="logo-estate">estate</span>
              <span className="logo-pro">PRO</span>
            </div>
            <span className="logo-subtitle">real estate theme</span>
          </NavLink>
          <div className="nav-links">
            <ul>
              <li><NavLink to="/" exact="true" activeclassname="active">HOME</NavLink></li>
              <li><NavLink to="/properties" activeclassname="active">PROPERTIES</NavLink></li>
              <li><NavLink to="/gallery" activeclassname="active">GALLERY</NavLink></li>
              <li><NavLink to="/agents" activeclassname="active">AGENTS</NavLink></li>
              <li><NavLink to="/blog" activeclassname="active">BLOG</NavLink></li>
              <li><NavLink to="/contact" activeclassname="active">CONTACT</NavLink></li>
            </ul>
          </div>
          <div className="hamburger-menu" onClick={toggleMobileNav}>
            <i className="fas fa-bars"></i>
          </div>
        </div>

        {mobileNavOpen && <div className="mobile-nav-overlay" onClick={closeMobileNav}></div>}
        <div className={`mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
          <div className="close-btn" onClick={closeMobileNav}>
            <i className="fas fa-times"></i>
          </div>
          <ul>
            <li><NavLink to="/" exact="true" activeclassname="active" onClick={closeMobileNav}>HOME</NavLink></li>
            <li><NavLink to="/properties" activeclassname="active" onClick={closeMobileNav}>PROPERTIES</NavLink></li>
            <li><NavLink to="/gallery" activeclassname="active" onClick={closeMobileNav}>GALLERY</NavLink></li>
            <li><NavLink to="/agents" activeclassname="active" onClick={closeMobileNav}>AGENTS</NavLink></li>
            <li><NavLink to="/blog" activeclassname="active" onClick={closeMobileNav}>BLOG</NavLink></li>
            <li><NavLink to="/contact" activeclassname="active" onClick={closeMobileNav}>CONTACT</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;
