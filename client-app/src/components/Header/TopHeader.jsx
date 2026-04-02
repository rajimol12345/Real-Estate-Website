import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../../context/LanguageContext';
import './TopHeader.css';

const LANGUAGES = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'bn', label: 'BN', name: 'Bengali' },
    { code: 'de', label: 'DE', name: 'German' },
    { code: 'nl', label: 'NL', name: 'Dutch' },
];

const TopHeader = () => {
    const { switchLanguage } = useContext(LanguageContext);
    const { t, i18n } = useTranslation();
    const [langOpen, setLangOpen] = useState(false);
    const [currOpen, setCurrOpen] = useState(false);
    const langRef = useRef(null);
    const currRef = useRef(null);

    const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

    const handleLanguageChange = (code) => {
        switchLanguage(code);
        setLangOpen(false);
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleOutside = (e) => {
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
            if (currRef.current && !currRef.current.contains(e.target)) setCurrOpen(false);
        };
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    return (
        <header className="row m0">
            <div className="row m0 topHeader">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 social_menu">
                            <ul className="list-inline">
                                <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                <li><a href="#"><i className="fa fa-pinterest"></i></a></li>
                                <li><a href="#"><i className="fa fa-dribbble"></i></a></li>
                                <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                                <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                            </ul>
                        </div>
                        <div className="col-sm-6 top_menu">
                            <ul className="list-inline">
                                <li><a href="#"><i className="fa fa-user"></i> {t('topbar.login')}</a></li>
                                <li><a href="#"><i className="fa fa-pencil"></i> {t('topbar.register')}</a></li>

                                {/* Currency Dropdown */}
                                <li ref={currRef}>
                                    <div className={`input-group-btn currencyFilters filterGroup ${currOpen ? 'open' : ''}`}>
                                        <button
                                            type="button"
                                            className="btn btn-default dropdown-toggle"
                                            onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); }}
                                        >
                                            <span id="filterValue">&#36;</span> {t('topbar.currency')}
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right" role="menu">
                                            <li><a href="#"><span className="value">&#36;</span> usd</a></li>
                                            <li><a href="#"><span className="value">&#163;</span> pound</a></li>
                                            <li><a href="#"><span className="value">&#165;</span> yen</a></li>
                                            <li><a href="#"><span className="value">&#8364;</span> euro</a></li>
                                        </ul>
                                    </div>
                                </li>

                                {/* Language Dropdown */}
                                <li ref={langRef}>
                                    <div className={`input-group-btn languageFilters filterGroup ${langOpen ? 'open' : ''}`}>
                                        <button
                                            type="button"
                                            className="btn btn-default dropdown-toggle lang-switcher-btn"
                                            onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); }}
                                        >
                                            <span className="lang-flag-code">{currentLang.label}</span>
                                            {t('topbar.language')}
                                            <i className="fa fa-caret-down" style={{ marginLeft: '4px' }}></i>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-right lang-dropdown" role="menu">
                                            {LANGUAGES.map(lang => (
                                                <li
                                                    key={lang.code}
                                                    className={i18n.language === lang.code ? 'active-lang' : ''}
                                                >
                                                    <a
                                                        href="#"
                                                        onClick={(e) => { e.preventDefault(); handleLanguageChange(lang.code); }}
                                                    >
                                                        <span className="lang-code-badge">{lang.label}</span>
                                                        {lang.name}
                                                        {i18n.language === lang.code && (
                                                            <i className="fa fa-check lang-check-icon"></i>
                                                        )}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
