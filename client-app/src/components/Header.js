import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { propertyService, agentService, blogService } from '../services/api';
import { LanguageContext } from '../context/LanguageContext';
import { CurrencyContext } from '../context/CurrencyContext';
import AuthModal from './AuthModal/AuthModal';
import './Header.css';

const LANGUAGES = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'bn', label: 'BN', name: 'Bengali' },
    { code: 'de', label: 'DE', name: 'German' },
    { code: 'nl', label: 'NL', name: 'Dutch' },
];

// const CURRENCIES = ... moved to Context

const Header = () => {
    const { t, i18n } = useTranslation();
    const { switchLanguage } = useContext(LanguageContext);
    const { currency: currentCurrency, setCurrency: setCurrentCurrency, CURRENCIES } = useContext(CurrencyContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [langOpen, setLangOpen] = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [sampleIds, setSampleIds] = useState({
        propertyId: null,
        agentId: null,
        blogId: null
    });
    const langRef = useRef(null);
    const currencyRef = useRef(null);
    const location = useLocation();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    useEffect(() => {
        const fetchSampleIds = async () => {
            try {
                const [propsRes, agentsRes, blogsRes] = await Promise.all([
                    propertyService.getAll({ limit: 1 }),
                    agentService.getAll({ limit: 1 }),
                    blogService.getAll({ limit: 1 })
                ]);

                setSampleIds({
                    propertyId: propsRes.data.properties?.[0]?._id || null,
                    agentId: agentsRes.data?.[0]?._id || null,
                    blogId: blogsRes.data?.[0]?._id || null
                });
            } catch (err) {
                console.error("Error fetching sample IDs for header links", err);
            }
        };
        fetchSampleIds();
    }, []);

    const handleLanguageChange = (code) => {
        switchLanguage(code);
        setLangOpen(false);
    };

    const handleCurrencyChange = (currency) => {
        setCurrentCurrency(currency);
        setCurrencyOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const openAuthModal = (mode) => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.reload();
    };

    // Sticky scroll
    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleOutside = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) {
                setLangOpen(false);
            }
            if (currencyRef.current && !currencyRef.current.contains(e.target)) {
                setCurrencyOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <header className={`header ${isSticky ? 'sticky' : ''}`}>
                {/* High Fidelity Top Bar */}
                <div className="top-bar-fidelity">
                    <div className="container-fluid d-flex justify-content-between p-0">
                        <div className="top-bar-left-fid">
                            <div className="top-social-cell"><a href="https://plus.google.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-google-plus-g"></i></a></div>
                            <div className="top-social-cell"><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a></div>
                            <div className="top-social-cell"><a href="https://pinterest.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-pinterest-p"></i></a></div>
                            <div className="top-social-cell"><a href="https://dribbble.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-dribbble"></i></a></div>
                            <div className="top-social-cell"><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a></div>
                            <div className="top-social-cell"><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></div>
                        </div>

                        <div className="top-bar-right-fid">
                            {userInfo ? (
                                <>
                                    <div className="top-item-cell">
                                        <Link to="/my-account">
                                            <span className="top-icon-circle"><i className="fa-solid fa-circle-user"></i></span>
                                            {userInfo.name}
                                        </Link>
                                    </div>
                                    <div className="top-item-cell">
                                        <Link to="/favorites">
                                            <span className="top-icon-circle"><i className="fa-solid fa-heart"></i></span>
                                            {t('nav.favorites') || 'Favorites'}
                                        </Link>
                                    </div>
                                    <div className="top-item-cell">
                                        <button onClick={handleLogout}>
                                            <span className="top-icon-circle"><i className="fa-solid fa-right-from-bracket"></i></span>
                                            {t('nav.logout') || 'Logout'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="top-item-cell">
                                        <button onClick={() => openAuthModal('login')}>
                                            <span className="top-icon-circle"><i className="fa-solid fa-user"></i></span>
                                            {t('topbar.login') || 'Login'}
                                        </button>
                                    </div>
                                    <div className="top-item-cell">
                                        <button onClick={() => openAuthModal('register')}>
                                            <span className="top-icon-circle"><i className="fa-solid fa-pen"></i></span>
                                            {t('topbar.register') || 'Register'}
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="top-item-cell dropdown-hover" ref={currencyRef}>
                                <div className="top-dropdown-trigger" onClick={() => setCurrencyOpen(!currencyOpen)}>
                                    <span className="top-icon-circle">{currentCurrency.symbol}</span>
                                    {t('topbar.currency') || 'Currency'}
                                </div>
                                {currencyOpen && (
                                    <div className="top-mini-dropdown">
                                        {CURRENCIES.map((curr, idx) => (
                                            <a
                                                key={idx}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleCurrencyChange(curr); }}
                                            >
                                                {curr.symbol} - {curr.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="top-item-cell dropdown-hover" ref={langRef}>
                                <div className="top-dropdown-trigger" onClick={() => setLangOpen(!langOpen)}>
                                    <span className="top-icon-circle solid-blue">{currentLang.label}</span>
                                    {t('topbar.language') || 'Language'}
                                </div>
                                {langOpen && (
                                    <div className="top-mini-dropdown">
                                        {LANGUAGES.map(lang => (
                                            <a
                                                key={lang.code}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleLanguageChange(lang.code); }}
                                            >
                                                {lang.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-header">
                    <div className="container-fluid header-container-fid">
                        <div className="header-left-side">
                            <div className="logo-fidelity">
                                <Link to="/" onClick={closeMenu}>
                                    <div className="logo-icon-fid">
                                        <svg width="45" height="35" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M25 5L5 20V35H12V22L25 12L38 22V35H45V20L25 5Z" stroke="#00aeef" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="logo-text-fid">
                                        <h1>estate<span>PRO</span></h1>
                                        <span className="logo-subtitle-fid">real estate theme</span>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <button className="mobile-menu-toggle" onClick={toggleMenu}>
                            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
                        </button>

                        <nav className={`nav-fidelity ${isMenuOpen ? 'open' : ''}`}>
                            <ul className="nav-list-fid">
                                <li className="nav-item-fid">
                                    <Link to="/" className={`nav-link-fid ${isActive('/')}`} onClick={closeMenu}>
                                        {t('nav.home') || 'HOME'}
                                    </Link>
                                </li>
                                <li className="nav-item-fid has-dropdown">
                                    <Link to="/properties" className={`nav-link-fid ${isActive('/properties')}`} onClick={closeMenu}>
                                        {t('nav.properties') || 'PROPERTIES'}
                                    </Link>
                                    <ul className="dropdown-menu-fid">
                                        <li>
                                            <Link to="/listing-grid" onClick={closeMenu}>
                                                {t('nav.listing_grid') || 'LISTING GRID'}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/listing-list" onClick={closeMenu}>
                                                {t('nav.listing_list') || 'LISTING LIST'}
                                            </Link>
                                        </li>
                                        {sampleIds.propertyId && (
                                            <li>
                                                <Link to={`/listing-details/${sampleIds.propertyId}`} onClick={closeMenu}>
                                                    {t('nav.listing_details') || 'LISTING DETAILS'}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                                <li className="nav-item-fid">
                                    <Link to="/gallery" className={`nav-link-fid ${isActive('/gallery')}`} onClick={closeMenu}>
                                        {t('nav.gallery') || 'GALLERY'}
                                    </Link>
                                </li>
                                <li className={`nav-item-fid ${sampleIds.agentId ? 'has-dropdown' : ''}`}>
                                    <Link to="/agents" className={`nav-link-fid ${isActive('/agents')}`} onClick={closeMenu}>
                                        {t('nav.agents') || 'AGENTS'}
                                    </Link>
                                    {sampleIds.agentId && (
                                        <ul className="dropdown-menu-fid">
                                            <li>
                                                <Link to={`/agent/${sampleIds.agentId}`} onClick={closeMenu}>
                                                    {t('nav.agent_details') || 'AGENTS DETAILS'}
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                                <li className="nav-item-fid has-dropdown">
                                    <Link to="/blog" className={`nav-link-fid ${isActive('/blog')}`} onClick={closeMenu}>
                                        {t('nav.blog') || 'BLOG'}
                                    </Link>
                                    <ul className="dropdown-menu-fid">
                                        <li>
                                            <Link to="/blog2col" onClick={closeMenu}>
                                                {t('nav.blog_2col') || 'BLOG 2 COLUMN'}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/blog3col" onClick={closeMenu}>
                                                {t('nav.blog_3col') || 'BLOG 3 COLUMN'}
                                            </Link>
                                        </li>
                                        {sampleIds.blogId && (
                                            <li>
                                                <Link to={`/single-post/${sampleIds.blogId}`} onClick={closeMenu}>
                                                    {t('nav.single_post') || 'SINGLE POST'}
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                                <li className="nav-item-fid">
                                    <Link to="/contact" className={`nav-link-fid ${isActive('/contact')}`} onClick={closeMenu}>
                                        {t('nav.contact') || 'CONTACT'}
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Header;
