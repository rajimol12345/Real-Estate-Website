import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ initialRating = 0, onRate, interactive = false, size = 'md' }) => {
    const [hover, setHover] = useState(0);

    const stars = [1, 2, 3, 4, 5];

    const handleClick = (rating) => {
        if (interactive && onRate) {
            onRate(rating);
        }
    };

    return (
        <div className={`star-rating size-${size} ${interactive ? 'interactive' : ''}`}>
            {stars.map((star) => (
                <span
                    key={star}
                    className={`star ${star <= (hover || initialRating) ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                >
                    <i className={star <= (hover || initialRating) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                </span>
            ))}
            <span className="rating-value">({initialRating.toFixed(1)})</span>
        </div>
    );
};

export default StarRating;
