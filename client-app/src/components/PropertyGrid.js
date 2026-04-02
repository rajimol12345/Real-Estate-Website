import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard';
import { propertyService } from '../services/api';
import './PropertyCard.css';

const PropertyGrid = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await propertyService.getAll();
                // Map backend status to frontend expected status if necessary
                const properties = response.data.properties || response.data;
                const propertiesArray = Array.isArray(properties) ? properties : [];
                const mappedData = propertiesArray.map(item => ({
                    id: item._id,
                    image: item.imageURL || '/assets/images/slider/1.jpg',
                    title: item.title,
                    address: item.location,
                    price: item.price?.toLocaleString() || '0',
                    status: item.status,
                    beds: item.beds,
                    baths: item.baths,
                    sqft: item.sqft,
                    isBooked: item.isBooked
                }));
                setProperties(mappedData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError("Failed to load properties. Please try again later.");
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (error) return (
        <div className="container py-5 text-center text-danger">
            <p>{error}</p>
        </div>
    );

    return (
        <section className="property-section">
            <div className="container">
                <div className="section-title">
                    <h2>Recent <span>Listing</span></h2>
                    <div className="title-separator"></div>
                </div>
                <div className="property-grid">
                    {properties.map(property => (
                        <PropertyCard key={property.id} {...property} location={property.address} />
                    ))}
                    {properties.length === 0 && (
                        <div className="w-100 text-center py-5">
                            <p className="text-muted">No properties found.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default PropertyGrid;
