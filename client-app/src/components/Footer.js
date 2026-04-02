import React, { useState, useEffect } from 'react';
import { blogService } from '../services/api';
import './Footer.css';

const Footer = () => {
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await blogService.getAll();
                // Handle both paginated (object) and non-paginated (array) responses
                const blogsData = response.data.blogs || response.data;
                if (Array.isArray(blogsData)) {
                    setRecentPosts(blogsData.slice(0, 4));
                }
            } catch (error) {
                console.error("Error fetching recent posts for footer:", error);
            }
        };
        fetchPosts();
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer-fidelity-ref">
            <div className="container-fluid px-5">
                <div className="footer-columns-wrapper">
                    {/* Recent Posts Column */}
                    <div className="footer-column-box">
                        <div className="column-top-border"></div>
                        <h3 className="column-title">Recent Posts</h3>

                        <ul className="footer-recent-links">
                            {recentPosts.length > 0 ? (
                                recentPosts.map(post => (
                                    <li key={post._id}><a href={`/blog/${post._id}`}>{post.title}</a></li>
                                ))
                            ) : (
                                <>
                                    <li><a href="#">New Search Platform Update</a></li>
                                    <li><a href="#">Envato's Most Wanted - $5,000 for Ghost Themes</a></li>
                                    <li><a href="#">Update: WordPress Theme Submission Requirements</a></li>
                                    <li><a href="#">Envato Staff Vs Community Nike+ competition</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Brand Info Column */}
                    <div className="footer-column-box text-center">
                        <div className="column-top-border"></div>
                        <div className="footer-brand-logo-box">
                            <div className="footer-house-icon">
                                <svg width="50" height="40" viewBox="0 0 50 40" fill="none">
                                    <path d="M25 5L5 20V35H12V22L25 12L38 22V35H45V20L25 5Z" stroke="#fff" strokeWidth="2.5" />
                                </svg>
                            </div>
                            <div className="footer-brand-name">
                                estate<span>PRO</span>
                                <small>real estate theme</small>
                            </div>
                        </div>

                        <div className="footer-description-box">
                            <p>This is Photoshop's version of Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum,</p>
                            <div className="desc-spacer"></div>
                            <p>Nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum</p>
                        </div>
                    </div>

                    {/* Opening Hours Column */}
                    <div className="footer-column-box">
                        <div className="column-top-border"></div>
                        <h3 className="column-title">Opening Hours</h3>

                        <div className="opening-hours-content">
                            <div className="contact-info-block">
                                <p className="contact-label">Make a Call</p>
                                <div className="contact-value-box">
                                    90 1234 5678 9012
                                    <div className="pointer-top"></div>
                                </div>
                            </div>

                            <div className="contact-info-block">
                                <p className="contact-label">Send us an Email</p>
                                <div className="contact-value-box">
                                    estatepro@domain.com
                                    <div className="pointer-top"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Bar */}
            <div className="footer-bottom-bar-ref">
                <div className="container-fluid px-5">
                    <div className="bottom-bar-content">
                        <div className="copyright-box">
                            © 2015 Estate Pro, All Rights Reserved
                        </div>

                        <div className="back-to-top-box">
                            <button onClick={scrollToTop} className="btn-back-to-top">
                                <i className="fa-solid fa-angle-up"></i>
                            </button>
                        </div>

                        <div className="footer-social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-box"><i className="fa-brands fa-facebook-f"></i></a>
                            <a href="https://plus.google.com" target="_blank" rel="noopener noreferrer" className="social-box"><i className="fa-brands fa-google-plus-g"></i></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-box"><i className="fa-brands fa-twitter"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
