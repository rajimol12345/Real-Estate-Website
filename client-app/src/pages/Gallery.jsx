import React, { useState, useEffect, useContext } from 'react';
import PageCover from '../components/PageCover/PageCover';
import { propertyService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import { LanguageContext } from '../context/LanguageContext';
import './Gallery.css';
import pageCoverBg from '../assets/images/slider/1.jpg';

const Gallery = () => {
    const { getLocalized } = useContext(LanguageContext);
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGalleryData = async () => {
            setLoading(true);
            try {
                const response = await propertyService.getAll({ limit: 100 }); // Fetch more to populate gallery
                const properties = response.data.properties || [];

                // Flatten all gallery images from all properties into one array
                const images = [];
                properties.forEach(prop => {
                    const title = getLocalized(prop.title);

                    // Add featured image if available
                    if (prop.imageURL) {
                        images.push({
                            id: `${prop._id}-featured`,
                            src: getImageUrl(prop.imageURL),
                            title: title,
                            propertyId: prop._id
                        });
                    }

                    // Add gallery images if available
                    if (prop.media && prop.media.galleryImages && prop.media.galleryImages.length > 0) {
                        prop.media.galleryImages.forEach((img, index) => {
                            images.push({
                                id: `${prop._id}-gallery-${index}`,
                                src: getImageUrl(img),
                                title: title,
                                propertyId: prop._id
                            });
                        });
                    }
                });

                setGalleryImages(images);
            } catch (error) {
                console.error("Error fetching gallery images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, [getLocalized]);

    return (
        <div className="gallery-page">
            <PageCover title="Property Gallery" homeLink="/" currentCrumb="Gallery" backgroundImage={pageCoverBg} />

            <section className="gallery-content-section">
                <div className="container">
                    <div className="section-title text-center">
                        <h2>Our Property Gallery</h2>
                        <div className="yellow-separator"></div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading gallery...</span>
                            </div>
                        </div>
                    ) : galleryImages.length > 0 ? (
                        <div className="gallery-grid">
                            {galleryImages.map(image => (
                                <div className="gallery-item" key={image.id}>
                                    <div className="gallery-image-box">
                                        <img src={image.src} alt={image.title} loading="lazy" />
                                        <div className="gallery-overlay">
                                            <h4>{image.title}</h4>
                                            <div className="gallery-icons">
                                                <a href={image.src} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-expand"></i></a>
                                                <a href={`/listing-details/${image.propertyId}`}><i className="fa-solid fa-link"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <p className="text-muted">No gallery images found.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Gallery;
