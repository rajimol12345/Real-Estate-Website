import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './MainHeader.css';
import logo from '../../assets/images/logo.png';

const MainHeader = () => {
    const { t } = useTranslation();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    return (
        <nav className="navbar navbar-default navbar-static-top">
            <div className="container-fluid container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed" onClick={toggleMobileMenu}>
                        <i className="fa fa-bars"></i> Menu
                    </button>
                    <NavLink className="navbar-brand" to="/"><img src={logo} alt="Estate Pro" /></NavLink>
                </div>

                <div className={`collapse navbar-collapse ${showMobileMenu ? 'show' : ''}`} id="mainNavigation">
                    <ul className="nav navbar-nav navbar-right">
                        <li className="dropdown">
                            <NavLink to="/" className="dropdown-toggle" end>{t('nav.home')}</NavLink>
                            <ul className="dropdown-menu" role="menu">
                                <li><NavLink to="/" end>{t('nav.home')}</NavLink></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <NavLink to="/listing-grid" className="dropdown-toggle">{t('nav.properties')}</NavLink>
                            <ul className="dropdown-menu" role="menu">
                                <li><NavLink to="/listing-grid">{t('nav.listing_grid')}</NavLink></li>
                                <li><NavLink to="/listing-list">{t('nav.listing_list')}</NavLink></li>
                                <li><NavLink to="/listing-details">{t('nav.listing_details')}</NavLink></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <NavLink to="/agents" className="dropdown-toggle">{t('nav.agents')}</NavLink>
                            <ul className="dropdown-menu" role="menu">
                                <li><NavLink to="/agents">{t('nav.agents')}</NavLink></li>
                            </ul>
                        </li>
                        <li className="dropdown">
                            <NavLink to="/blog2col" className="dropdown-toggle">{t('nav.blog')}</NavLink>
                            <ul className="dropdown-menu" role="menu">
                                <li><NavLink to="/blog2col">{t('nav.blog_2col')}</NavLink></li>
                                <li><NavLink to="/blog3col">{t('nav.blog_3col')}</NavLink></li>
                                <li><NavLink to="/single-post">{t('nav.single_post')}</NavLink></li>
                            </ul>
                        </li>
                        <li><NavLink to="/contact">{t('nav.contact')}</NavLink></li>
                        <li><NavLink to="/about">{t('nav.about')}</NavLink></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default MainHeader;
