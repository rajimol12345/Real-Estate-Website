import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FavoriteButton.css';

const FavoriteButton = ({ propertyId, className = '' }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const userInfo = localStorage.getItem('userInfo');

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!userInfo || !propertyId) return;
            try {
                const { token } = JSON.parse(userInfo);
                const res = await axios.get(`http://localhost:5005/api/favorites/status/${propertyId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsFavorite(res.data.isFavorite);
            } catch (error) {
                console.error("Error checking favorite status:", error);
            }
        };
        checkFavoriteStatus();
    }, [propertyId, userInfo]);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!userInfo) {
            alert("Please log in to add to favorites.");
            return;
        }

        try {
            const { token } = JSON.parse(userInfo);
            const res = await axios.post('http://localhost:5005/api/favorites/toggle', 
                { propertyId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setIsFavorite(res.data.isFavorite);
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <button 
            className={`favorite-btn-common ${isFavorite ? 'active' : ''} ${className}`}
            onClick={handleToggleFavorite}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
            <i className={`${isFavorite ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        </button>
    );
};

export default FavoriteButton;
