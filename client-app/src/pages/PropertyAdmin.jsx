import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/api';
import './PropertyAdmin.css';

const PropertyAdmin = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProperty, setCurrentProperty] = useState({
        title: '',
        price: '',
        location: '',
        beds: '',
        baths: '',
        sqft: '',
        imageURL: '',
        status: 'For Sale',
        type: 'House'
    });

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const response = await propertyService.getAll();
            const propertiesData = response.data.properties || response.data;
            setProperties(Array.isArray(propertiesData) ? propertiesData : []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch properties.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProperty({ ...currentProperty, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await propertyService.update(currentProperty._id, currentProperty);
                setSuccess('Property updated successfully!');
            } else {
                await propertyService.create(currentProperty);
                setSuccess('Property added successfully!');
            }
            resetForm();
            fetchProperties();
        } catch (err) {
            setError(isEditing ? 'Failed to update property.' : 'Failed to add property.');
        } finally {
            setLoading(false);
            setTimeout(() => setSuccess(null), 3000);
        }
    };

    const handleEdit = (property) => {
        setCurrentProperty(property);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            setLoading(true);
            try {
                await propertyService.delete(id);
                setSuccess('Property deleted successfully!');
                fetchProperties();
            } catch (err) {
                setError('Failed to delete property.');
            } finally {
                setLoading(false);
                setTimeout(() => setSuccess(null), 3000);
            }
        }
    };

    const resetForm = () => {
        setCurrentProperty({
            title: '',
            price: '',
            location: '',
            beds: '',
            baths: '',
            sqft: '',
            imageURL: '',
            status: 'For Sale',
            type: 'House'
        });
        setIsEditing(false);
    };

    return (
        <div className="property-admin-container">
            <div className="admin-header">
                <h2>Property Management <span>Dashboard</span></h2>
                <p>Add, edit or delete properties from your inventory.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="admin-grid">
                {/* Form Section */}
                <div className="admin-form-card">
                    <h3>{isEditing ? 'Edit Property' : 'Add New Property'}</h3>
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group-fid">
                            <label>Title</label>
                            <input type="text" name="title" value={currentProperty.title} onChange={handleInputChange} required placeholder="Luxury Villa..." />
                        </div>
                        <div className="form-row-fid">
                            <div className="form-group-fid">
                                <label>Price ($)</label>
                                <input type="number" name="price" value={currentProperty.price} onChange={handleInputChange} required placeholder="500000" />
                            </div>
                            <div className="form-group-fid">
                                <label>Location</label>
                                <input type="text" name="location" value={currentProperty.location} onChange={handleInputChange} required placeholder="London, UK" />
                            </div>
                        </div>
                        <div className="form-row-fid">
                            <div className="form-group-fid">
                                <label>Beds</label>
                                <input type="number" name="beds" value={currentProperty.beds} onChange={handleInputChange} required placeholder="3" />
                            </div>
                            <div className="form-group-fid">
                                <label>Baths</label>
                                <input type="number" name="baths" value={currentProperty.baths} onChange={handleInputChange} required placeholder="2" />
                            </div>
                            <div className="form-group-fid">
                                <label>Sqft</label>
                                <input type="number" name="sqft" value={currentProperty.sqft} onChange={handleInputChange} required placeholder="2500" />
                            </div>
                        </div>
                        <div className="form-group-fid">
                            <label>Image URL</label>
                            <input type="text" name="imageURL" value={currentProperty.imageURL} onChange={handleInputChange} required placeholder="https://..." />
                        </div>
                        <div className="form-row-fid">
                            <div className="form-group-fid">
                                <label>Status</label>
                                <select name="status" value={currentProperty.status} onChange={handleInputChange}>
                                    <option value="For Sale">For Sale</option>
                                    <option value="For Rent">For Rent</option>
                                </select>
                            </div>
                            <div className="form-group-fid">
                                <label>Type</label>
                                <select name="type" value={currentProperty.type} onChange={handleInputChange}>
                                    <option value="House">House</option>
                                    <option value="Apartment">Apartment</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Villa">Villa</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-actions-fid">
                            <button type="submit" className="btn-admin-submit" disabled={loading}>
                                {loading ? 'Processing...' : (isEditing ? 'UPDATE PROPERTY' : 'ADD PROPERTY')}
                            </button>
                            {isEditing && <button type="button" className="btn-admin-cancel" onClick={resetForm}>CANCEL</button>}
                        </div>
                    </form>
                </div>

                {/* List Section */}
                <div className="admin-list-card">
                    <h3>Property Inventory</h3>
                    {loading && !properties.length ? (
                        <div className="loading-spinner">Loading properties...</div>
                    ) : (
                        <div className="admin-table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Price</th>
                                        <th>Details</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(property => (
                                        <tr key={property._id}>
                                            <td className="td-property">
                                                <img src={property.imageURL} alt={property.title} className="admin-thumb" />
                                                <div className="property-info">
                                                    <strong>{property.title}</strong>
                                                    <span>{property.location}</span>
                                                </div>
                                            </td>
                                            <td className="td-price">${property.price?.toLocaleString()}</td>
                                            <td className="td-details">
                                                {property.beds}bd | {property.baths}ba | {property.sqft} sqft
                                                <span className={`badge-fid ${property.status === 'For Sale' ? 'sale' : 'rent'}`}>{property.status}</span>
                                            </td>
                                            <td className="td-actions">
                                                <button className="btn-edit-fid" onClick={() => handleEdit(property)} title="Edit"><i className="fa-solid fa-pen-to-square"></i></button>
                                                <button className="btn-delete-fid" onClick={() => handleDelete(property._id)} title="Delete"><i className="fa-solid fa-trash-can"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyAdmin;
