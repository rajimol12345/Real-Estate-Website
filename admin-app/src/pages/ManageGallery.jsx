import React, { useState, useEffect } from 'react';
import api, { propertyService } from '../services/api';
import { X, Images, Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import './ManageProperties.css'; // Reuse basic UI styling
import { getImageUrl } from '../utils/helpers';
import Pagination from '../components/common/Pagination';

const ManageGallery = () => {
    const [properties, setProperties] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);

    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProperties();
    }, [currentPage]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await propertyService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setProperties(res.data.properties);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching properties', error);
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const openEditModal = (property) => {
        setEditingProperty(property);
        setGalleryImages(property.media?.galleryImages || []);
        setShowModal(true);
    };

    const handleSaveGallery = async () => {
        if (!editingProperty) return;
        setIsSaving(true);

        try {
            const updatedMedia = {
                ...(editingProperty.media || {
                    featuredImage: '',
                    floorPlans: [],
                    walkthrough3D: '',
                    virtualTour360: '',
                    videoTour: '',
                    brochurePdf: ''
                }),
                galleryImages: galleryImages
            };

            console.log('Sending gallery update:', { media: updatedMedia });
            await propertyService.update(editingProperty._id, { 
                media: updatedMedia,
                title: editingProperty.title,
                description: editingProperty.description
            });

            // Refresh the list and close modal
            fetchProperties();
            setShowModal(false);
            setEditingProperty(null);
        } catch (error) {
            console.error('Error saving gallery', error);
            const errorMsg = error.response?.data?.message || "Failed to save gallery changes.";
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="manage-properties fade-in">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="h3 mb-0 text-gray-800">Gallery Management</h2>
                    <p className="text-muted">Total {totalCount} listings available for gallery updates.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div className="content-card">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Featured Image</th>
                                        <th>Property Title</th>
                                        <th>Gallery Images</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(property => {
                                        const title = typeof property.title === 'string' ? property.title : (property.title?.en || 'Untitled');
                                        const galleryCount = property.media?.galleryImages?.length || 0;

                                        return (
                                            <tr key={property._id}>
                                                <td className="align-middle">
                                                    <img src={getImageUrl(property.imageURL)} alt={title} className="prop-thumb" style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                </td>
                                                <td className="align-middle">
                                                    <div className="prop-title-fid fw-semibold">
                                                        {title}
                                                    </div>
                                                </td>
                                                <td className="align-middle">
                                                    <span className={`badge ${galleryCount > 0 ? 'bg-success' : 'bg-secondary'}`}>
                                                        {galleryCount} image{galleryCount !== 1 ? 's' : ''}
                                                    </span>
                                                    {galleryCount > 0 && (
                                                        <div className="d-flex mt-2" style={{ gap: '4px' }}>
                                                            {property.media.galleryImages.slice(0, 4).map((img, i) => (
                                                                <img key={i} src={getImageUrl(img)} alt={`thumb ${i}`} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '3px' }} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="align-middle text-end">
                                                    <button className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1" onClick={() => openEditModal(property)}>
                                                        <Images size={16} /> Manage Gallery
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {totalPages > 1 && (
                        <div className="mt-3">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Gallery Edit Modal */}
            {showModal && editingProperty && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid" style={{ maxWidth: '800px' }}>
                        <div className="modal-header-fid">
                            <h4>Manage Gallery: {typeof editingProperty.title === 'string' ? editingProperty.title : (editingProperty.title?.en || 'Untitled')}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body-fid" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                            <div className="alert alert-info">
                                <p className="mb-0 small">
                                    Upload high-quality images to showcase this property. You can upload multiple images at once. These will be displayed in the property's photo slider and dedicated gallery pages.
                                </p>
                            </div>

                            <ImageUpload
                                label="Property Gallery Assets"
                                helpText="Accepts JPG, PNG, WEBP. Max size 2MB per image. Select multiple files."
                                multiple={true}
                                maxFiles={20}
                                value={galleryImages}
                                onChange={(urls) => setGalleryImages(urls)}
                                onUploadStart={() => setIsUploading(true)}
                                onUploadFinish={() => setIsUploading(false)}
                            />
                        </div>
                        <div className="modal-footer-fid">
                            <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                            <button
                                type="button"
                                className="btn btn-primary d-flex align-items-center gap-2"
                                onClick={handleSaveGallery}
                                disabled={isUploading || isSaving}
                            >
                                {(isUploading || isSaving) ? (
                                    <><span className="spinner-border spinner-border-sm"></span> Processing...</>
                                ) : (
                                    <><Save size={16} /> Save Gallery</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;
