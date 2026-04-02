import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageContext } from '../context/LanguageContext';
import PageCover from '../components/PageCover/PageCover';
import ListingCard from '../components/ListingCard/ListingCard';
import api, { propertyService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './Favorites.css';

import pageCoverBg from '../assets/images/slider/3.jpg';

const Favorites = () => {
    const { t } = useTranslation();
    const { getLocalized } = useContext(LanguageContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchFavorites = async () => {
        if (!userInfo) {
            setLoading(false);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const res = await api.get('/favorites', config);
            setFavorites(res.data);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (!userInfo) {
        return (
            <div className="favorites-page">
                <PageCover title="My Favorites" homeLink="/" currentCrumb="Favorites" backgroundImage={pageCoverBg} />
                <div className="container py-5 text-center">
                    <div className="login-prompt-box">
                        <i className="fa-solid fa-lock mb-3" style={{ fontSize: '48px', color: '#00aeef' }}></i>
                        <h3>Please Log In</h3>
                        <p>You need to be logged in to view your favorite properties.</p>
                        <a href="/" className="btn-primary-fid mt-3">Back to Home</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-page">
            <PageCover 
                title={t('nav.favorites') || "My Favorites"} 
                homeLink="/" 
                currentCrumb="Favorites" 
                backgroundImage={pageCoverBg} 
            />

            <section className="favorites-section py-5">
                <div className="container">
                    <div className="section-title text-center mb-5">
                        <h2>Saved <span>Properties</span></h2>
                        <div className="yellow-separator"></div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : (
                        <div className="row">
                            {favorites.length > 0 ? (
                                favorites.map(fav => (
                                    <div className="col-lg-4 col-md-6 mb-4 fade-in" key={fav._id}>
                                        <ListingCard 
                                            id={fav.property._id}
                                            image={getImageUrl(fav.property.imageURL)}
                                            type={fav.property.status === 'For Sale' ? 'sale' : 'rent'}
                                            price={`$${fav.property.price?.toLocaleString()}`}
                                            title={getLocalized(fav.property.title)}
                                            location={fav.property.location}
                                            sqft={fav.property.sqft}
                                            beds={fav.property.beds}
                                        />
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center py-5 empty-favorites">
                                    <div className="empty-icon">
                                        <i className="fa-regular fa-heart"></i>
                                    </div>
                                    <h4>Your favorites list is empty</h4>
                                    <p>Start exploring properties and click the heart icon to save them here!</p>
                                    <a href="/properties" className="btn-browse-fid">Browse Properties</a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Favorites;
