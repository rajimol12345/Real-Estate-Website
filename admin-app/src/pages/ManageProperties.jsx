import React, { useState, useEffect } from 'react';
import { propertyService, uploadService, locationService } from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Image, Upload, MapPin, Film } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';
import './ManageProperties.css';

import Pagination from '../components/common/Pagination';
import MediaSection from '../components/MediaSection';

const ManageProperties = () => {
    const [properties, setProperties] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('basic-info');
    const [showMapModal, setShowMapModal] = useState(false);
    const [mapUrl, setMapUrl] = useState('');
    const [selectedPropertyTitle, setSelectedPropertyTitle] = useState('');
    const [editingProperty, setEditingProperty] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        beds: '',
        baths: '',
        sqft: '',
        status: 'For Sale',
        type: 'House',
        imageURL: '',
        amenities: '',
        address: '',
        cityId: '',
        areaId: '',
        latitude: '',
        longitude: '',
        yearBuilt: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        ownerMessage: '',
        media: {
            featuredImage: '',
            galleryImages: [],
            floorPlans: [],
            walkthrough3D: '',
            virtualTour360: '',
            videoTour: '',
            brochurePdf: ''
        }
    });

    useEffect(() => {
        fetchProperties();
        fetchMasterData();
    }, [currentPage]);

    useEffect(() => {
        if (formData.cityId) {
            setFilteredAreas(areas.filter(area => area.cityId?._id === formData.cityId));
        } else {
            setFilteredAreas([]);
        }
    }, [formData.cityId, areas]);

    const fetchMasterData = async () => {
        try {
            const [citiesRes, areasRes] = await Promise.all([
                locationService.getCities(),
                locationService.getAreas()
            ]);
            setCities(citiesRes.data);
            setAreas(areasRes.data);
        } catch (error) {
            console.error('Error fetching master data', error);
        }
    };

    const fetchProperties = async () => {
        try {
            const res = await propertyService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setProperties(res.data.properties);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching properties', error);
        }
    };

    const initMap = () => {
        if (!window.google || !document.getElementById('admin-map')) return;

        const defaultLat = parseFloat(formData.latitude) || 23.8103;
        const defaultLng = parseFloat(formData.longitude) || 90.4125;

        const mapInstance = new window.google.maps.Map(document.getElementById('admin-map'), {
            center: { lat: defaultLat, lng: defaultLng },
            zoom: 13,
            mapTypeControl: false,
        });

        const markerInstance = new window.google.maps.Marker({
            position: { lat: defaultLat, lng: defaultLng },
            map: mapInstance,
            draggable: true,
            animation: window.google.maps.Animation.DROP
        });

        // Search Box
        const input = document.getElementById('pac-input');
        const searchBoxInstance = new window.google.maps.places.SearchBox(input);

        mapInstance.addListener('bounds_changed', () => {
            searchBoxInstance.setBounds(mapInstance.getBounds());
        });

        searchBoxInstance.addListener('places_changed', () => {
            const places = searchBoxInstance.getPlaces();
            if (places.length === 0) return;

            const place = places[0];
            if (!place.geometry || !place.geometry.location) return;

            mapInstance.setCenter(place.geometry.location);
            mapInstance.setZoom(17);
            markerInstance.setPosition(place.geometry.location);

            updateLocation(place.geometry.location.lat(), place.geometry.location.lng());
        });

        // Marker Drag
        markerInstance.addListener('dragend', () => {
            const pos = markerInstance.getPosition();
            updateLocation(pos.lat(), pos.lng());
        });

        // Map Click
        mapInstance.addListener('click', (e) => {
            markerInstance.setPosition(e.latLng);
            updateLocation(e.latLng.lat(), e.latLng.lng());
        });

        setMap(mapInstance);
        setMarker(markerInstance);
    };

    const updateLocation = (lat, lng) => {
        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
        }));
    };

    const loadGoogleMapsScript = () => {
        if (window.google) {
            initMap();
            return;
        }

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
            console.warn('Google Maps API Key not set');
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
    };

    useEffect(() => {
        if (activeTab === 'location' && showModal) {
            loadGoogleMapsScript();
        }
    }, [activeTab, showModal]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setIsUploading(true);
        try {
            const res = await uploadService.uploadSingle(uploadData);
            setFormData({ ...formData, imageURL: res.data.url });
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            amenities: formData.amenities.split(',').map(item => item.trim()),
        };
        try {
            if (editingProperty) {
                await propertyService.update(editingProperty._id, submissionData);
            } else {
                await propertyService.create(submissionData);
            }
            setShowModal(false);
            setEditingProperty(null);
            resetForm();
            fetchProperties();
        } catch (error) {
            console.error('Error saving property', error);
        }
    };

    const handleEdit = (property) => {
        setEditingProperty(property);
        setFormData({
            title: typeof property.title === 'string' ? property.title : (property.title?.en || ''),
            description: typeof property.description === 'string' ? property.description : (property.description?.en || ''),
            price: property.price,
            location: property.location,
            beds: property.beds,
            baths: property.baths,
            sqft: property.sqft,
            status: property.status,
            type: property.type,
            imageURL: property.imageURL,
            amenities: property.amenities ? property.amenities.join(', ') : '',
            address: property.address,
            cityId: property.cityId?._id || property.cityId || '',
            areaId: property.areaId?._id || property.areaId || '',
            latitude: property.latitude,
            longitude: property.longitude,
            yearBuilt: property.yearBuilt,
            ownerName: property.ownerName,
            ownerEmail: property.ownerEmail,
            ownerPhone: property.ownerPhone || '',
            ownerMessage: property.ownerMessage || '',
            media: property.media || {
                featuredImage: '',
                galleryImages: [],
                floorPlans: [],
                walkthrough3D: '',
                virtualTour360: '',
                videoTour: '',
                brochurePdf: ''
            }
        });
        setShowModal(true);
    };

    const handleTraceLocation = (property) => {
        let query = '';
        if (property.latitude && property.longitude) {
            query = `${property.latitude},${property.longitude}`;
        } else if (property.address) {
            query = encodeURIComponent(property.address);
        } else if (property.location) {
            query = encodeURIComponent(property.location);
        }

        if (query) {
            // Using placeholder for embedded map if a real API key isn't provided, otherwise standard search
            // For a "Clean UI" embedded feel without necessarily needing a complex API key for basic search:
            const url = `https://www.google.com/maps?q=${query}&output=embed`;
            setMapUrl(url);
            setSelectedPropertyTitle(typeof property.title === 'string' ? property.title : property.title?.en);
            setShowMapModal(true);
        } else {
            alert('No location data available for this property.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await propertyService.delete(id);
                fetchProperties();
            } catch (error) {
                console.error('Error deleting property', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            price: '',
            location: '',
            beds: '',
            baths: '',
            sqft: '',
            status: 'For Sale',
            type: 'House',
            imageURL: '',
            amenities: [],
            address: '',
            cityId: '',
            areaId: '',
            latitude: '',
            longitude: '',
            yearBuilt: '',
            ownerName: '',
            ownerEmail: '',
            ownerPhone: '',
            ownerMessage: '',
            media: {
                featuredImage: '',
                galleryImages: [],
                floorPlans: [],
                walkthrough3D: '',
                virtualTour360: '',
                videoTour: '',
                brochurePdf: ''
            }
        });
    };

    return (
        <div className="manage-properties">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Manage Properties</h2>
                    <p>Total {totalCount} listings</p>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { resetForm(); setEditingProperty(null); setShowModal(true); }}>
                    <Plus size={18} /> Add New Property
                </button>
            </div>

            <div className="content-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Location</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property) => (
                                    <tr key={property._id}>
                                        <td>
                                            <img src={getImageUrl(property.imageURL)} alt={typeof property.title === 'string' ? property.title : property.title?.en} className="prop-thumb" />
                                        </td>
                                        <td>
                                            <div className="prop-title-fid">
                                                {typeof property.title === 'string' ? property.title : property.title?.en}
                                            </div>
                                            <div className="prop-type-fid">{property.type}</div>
                                        </td>
                                        <td>{property.location}</td>
                                        <td>${property.price?.toLocaleString()}</td>
                                        <td>
                                            <span className={`badge-fid ${property.status === 'For Sale' ? 'bg-success' : 'bg-info'}`}>
                                                {property.status}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-icon text-success" onClick={() => handleTraceLocation(property)} title="Trace Location">
                                                <MapPin size={16} />
                                            </button>
                                            <Link to="/gallery" className="btn btn-icon text-info" title="Manage Gallery">
                                                <Image size={16} />
                                            </Link>
                                            <button className="btn btn-icon text-primary" onClick={() => handleEdit(property)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn btn-icon text-danger" onClick={() => handleDelete(property._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid">
                        <div className="modal-header-fid">
                            <h4>{editingProperty ? 'Edit Property' : 'Add New Property'}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body-fid">
                                <ul className="nav nav-tabs mb-4" id="propertyTab" role="tablist">
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className={`nav-link ${activeTab === 'basic-info' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('basic-info')}
                                        >
                                            Basic Info
                                        </button>
                                    </li>
                                            <li className="nav-item">
                                        <button
                                            type="button"
                                            className={`nav-link ${activeTab === 'location' ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveTab('location');
                                                setTimeout(initMap, 100);
                                            }}
                                        >
                                            Map & Location
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            type="button"
                                            className={`nav-link ${activeTab === 'media' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('media')}
                                        >
                                            Media & Gallery
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content" id="propertyTabContent">
                                    {activeTab === 'basic-info' && (
                                        <div className="tab-pane fade show active" role="tabpanel">
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label>Property Title</label>
                                                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Description</label>
                                                    <textarea name="description" className="form-control" value={formData.description} onChange={handleInputChange} rows="4" required></textarea>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Price ($)</label>
                                                    <input type="number" name="price" className="form-control" value={formData.price} onChange={handleInputChange} required />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Location</label>
                                                    <input type="text" name="location" className="form-control" value={formData.location} onChange={handleInputChange} required />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>Beds</label>
                                                    <input type="number" name="beds" className="form-control" value={formData.beds} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>Baths</label>
                                                    <input type="number" name="baths" className="form-control" value={formData.baths} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label>Sq Ft</label>
                                                    <input type="number" name="sqft" className="form-control" value={formData.sqft} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Status</label>
                                                    <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                                                        <option value="For Sale">For Sale</option>
                                                        <option value="For Rent">For Rent</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Type</label>
                                                    <select name="type" className="form-select" value={formData.type} onChange={handleInputChange}>
                                                        <option value="House">House</option>
                                                        <option value="Apartment">Apartment</option>
                                                        <option value="Commercial">Commercial</option>
                                                        <option value="Garage">Garage</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Amenities (comma-separated)</label>
                                                    <input type="text" name="amenities" className="form-control" value={formData.amenities} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Address</label>
                                                    <input type="text" name="address" className="form-control" value={formData.address} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Latitude</label>
                                                    <input type="number" name="latitude" className="form-control" value={formData.latitude} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Longitude</label>
                                                    <input type="number" name="longitude" className="form-control" value={formData.longitude} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Year Built</label>
                                                    <input type="number" name="yearBuilt" className="form-control" value={formData.yearBuilt} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>City (Master)</label>
                                                    <select name="cityId" className="form-select" value={formData.cityId} onChange={handleInputChange}>
                                                        <option value="">Select City</option>
                                                        {cities.map(city => <option key={city._id} value={city._id}>{city.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Area (Master)</label>
                                                    <select name="areaId" className="form-select" value={formData.areaId} onChange={handleInputChange} disabled={!formData.cityId}>
                                                        <option value="">Select Area</option>
                                                        {filteredAreas.map(area => <option key={area._id} value={area._id}>{area.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Owner Name</label>
                                                    <input type="text" name="ownerName" className="form-control" value={formData.ownerName} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Owner Email</label>
                                                    <input type="email" name="ownerEmail" className="form-control" value={formData.ownerEmail} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Owner Phone</label>
                                                    <input type="text" name="ownerPhone" className="form-control" value={formData.ownerPhone} onChange={handleInputChange} />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Owner Message</label>
                                                    <textarea name="ownerMessage" className="form-control" value={formData.ownerMessage} onChange={handleInputChange}></textarea>
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <label>Legacy Property Image (Featured Image takes priority)</label>
                                                    <div className="input-group">
                                                        <span className="input-group-text"><Image size={18} /></span>
                                                        <input
                                                            type="text"
                                                            name="imageURL"
                                                            className="form-control"
                                                            value={formData.imageURL}
                                                            onChange={handleInputChange}
                                                            placeholder="Image URL or upload"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => document.getElementById('prop-upload').click()}
                                                            disabled={isUploading}
                                                        >
                                                            {isUploading ? <span className="spinner-border spinner-border-sm"></span> : <Upload size={18} />}
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        id="prop-upload"
                                                        style={{ display: 'none' }}
                                                        onChange={handleFileUpload}
                                                        accept="image/*"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'location' && (
                                        <div className="tab-pane fade show active" role="tabpanel">
                                            <div className="row">
                                                <div className="col-md-12 mb-3">
                                                    <label>Search Location</label>
                                                    <input id="pac-input" type="text" className="form-control mb-2" placeholder="Search for a location..." />
                                                </div>
                                                <div className="col-md-12 mb-3">
                                                    <div id="admin-map" style={{ height: '400px', width: '100%', borderRadius: '8px' }}></div>
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Latitude (Read-only)</label>
                                                    <input type="text" name="latitude" className="form-control bg-light" value={formData.latitude} readOnly />
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label>Longitude (Read-only)</label>
                                                    <input type="text" name="longitude" className="form-control bg-light" value={formData.longitude} readOnly />
                                                </div>
                                                <div className="col-md-12 mb-3 text-muted">
                                                    <small><i className="fa-solid fa-circle-info me-1"></i> Drag the pin or click on map to set exact location.</small>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'media' && (
                                        <div className="tab-pane fade show active" role="tabpanel">
                                            <MediaSection
                                                formData={formData}
                                                setFormData={setFormData}
                                                isUploading={isUploading}
                                                setIsUploading={setIsUploading}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : (editingProperty ? 'Update Property' : 'Create Property')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Map Modal */}
            {showMapModal && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid map-modal-fid">
                        <div className="modal-header-fid">
                            <h4>Trace Location: {selectedPropertyTitle}</h4>
                            <button className="close-btn" onClick={() => setShowMapModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body-fid p-0" style={{ height: '450px' }}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight="0"
                                marginWidth="0"
                                src={mapUrl}
                                title="Property Location"
                            ></iframe>
                        </div>
                        <div className="modal-footer-fid">
                            <button className="btn btn-secondary" onClick={() => setShowMapModal(false)}>Close</button>
                            <a
                                href={mapUrl.replace('&output=embed', '')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                Open in Full Maps
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProperties;
