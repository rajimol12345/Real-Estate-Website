import React, { useState } from 'react';
import './TopHeader.css';

const TopHeader = () => {
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);

    return (
        <div className="topHeader">
            <div className="container">
                <div className="social_menu">
                    <ul>
                        <li><a href="#"><i className="fab fa-google-plus-g"></i></a></li>
                        <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                        <li><a href="#"><i className="fab fa-dribbble"></i></a></li>
                        <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                        <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                    </ul>
                </div>
                <div className="top_menu">
                    <ul className="list-inline">
                        <li><a href="#"><i className="fa fa-sign-in-alt"></i> Login</a></li>
                        <li><a href="#"><i className="fa fa-user-plus"></i> Register</a></li>
                        <li className="dropdown" onClick={() => setCurrencyOpen(!currencyOpen)}>
                            <button className="dropdown-toggle" type="button">
                                <span>$</span> Currency
                            </button>
                            {currencyOpen && (
                                <ul className="dropdown-menu">
                                    <li><a href="#"><span>USD</span> - US Dollar</a></li>
                                    <li><a href="#"><span>EUR</span> - Euro</a></li>
                                    <li><a href="#"><span>GBP</span> - British Pound</a></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown" onClick={() => setLanguageOpen(!languageOpen)}>
                            <button className="dropdown-toggle" type="button">
                                <span>EN</span> Language
                            </button>
                            {languageOpen && (
                                <ul className="dropdown-menu">
                                    <li><a href="#">English</a></li>
                                    <li><a href="#">Spanish</a></li>
                                    <li><a href="#">French</a></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default TopHeader;
