import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { ExternalLink, Video, FileText, Trash2, Plus, Layout } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
import './MediaSection.css';

const MediaSection = ({ formData, setFormData, isUploading, setIsUploading }) => {
    const [showPreview, setShowPreview] = useState({ type: null, url: '' });

    const handleMediaChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            media: {
                ...prev.media,
                [field]: value
            }
        }));
    };

    const handleFloorPlanChange = (index, field, value) => {
        const updatedFloorPlans = [...(formData.media?.floorPlans || [])];
        updatedFloorPlans[index] = { ...updatedFloorPlans[index], [field]: value };
        handleMediaChange('floorPlans', updatedFloorPlans);
    };

    const addFloorPlan = () => {
        const updatedFloorPlans = [...(formData.media?.floorPlans || []), { label: '', image: '' }];
        handleMediaChange('floorPlans', updatedFloorPlans);
    };

    const removeFloorPlan = (index) => {
        const updatedFloorPlans = (formData.media?.floorPlans || []).filter((_, i) => i !== index);
        handleMediaChange('floorPlans', updatedFloorPlans);
    };

    const getVideoEmbedUrl = (url) => {
        if (!url) return null;
        let videoId = '';
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            videoId = url.split('v=')[1] || url.split('/').pop();
            if (videoId.includes('&')) videoId = videoId.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}`;
        } else if (url.includes('vimeo.com')) {
            videoId = url.split('/').pop();
            return `https://player.vimeo.com/video/${videoId}`;
        }
        return null;
    };

    return (
        <div className="media-visuals-section">
            <h5 className="section-subtitle mb-4">Media & Visuals</h5>

            {/* 1. Featured Image */}
            <div className="media-group mb-4">
                <ImageUpload
                    label="Featured Image (Required)"
                    helpText="Main image for listings. Max 2MB."
                    value={formData.media?.featuredImage || ''}
                    onChange={(val) => handleMediaChange('featuredImage', val)}
                    onUploadStart={() => setIsUploading(true)}
                    onUploadFinish={() => setIsUploading(false)}
                />
            </div>

            <hr className="my-4" />

            {/* 2. Property Gallery */}
            <div className="media-group mb-4">
                <ImageUpload
                    label="Property Gallery"
                    helpText="Upload up to 10 images. Max 2MB each."
                    multiple={true}
                    maxFiles={10}
                    value={formData.media?.galleryImages || []}
                    onChange={(val) => handleMediaChange('galleryImages', val)}
                    onUploadStart={() => setIsUploading(true)}
                    onUploadFinish={() => setIsUploading(false)}
                />
            </div>

            <hr className="my-4" />

            {/* 3. Floor Plans */}
            <div className="media-group mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <label className="form-label fw-semibold mb-0">Floor Plan Images</label>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={addFloorPlan}
                    >
                        <Plus size={14} /> Add Floor Plan
                    </button>
                </div>

                <div className="floor-plans-list">
                    {(formData.media?.floorPlans || []).map((plan, index) => (
                        <div key={index} className="floor-plan-item p-3 mb-3 border rounded">
                            <div className="row">
                                <div className="col-md-5 mb-2 mb-md-0">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Label (e.g. Ground Floor)"
                                        value={plan.label}
                                        onChange={(e) => handleFloorPlanChange(index, 'label', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-5 mb-2 mb-md-0">
                                    <ImageUpload
                                        label=""
                                        helpText="Upload plan image"
                                        value={plan.image}
                                        onChange={(val) => handleFloorPlanChange(index, 'image', val)}
                                        onUploadStart={() => setIsUploading(true)}
                                        onUploadFinish={() => setIsUploading(false)}
                                    />
                                </div>
                                <div className="col-md-2 d-flex align-items-center justify-content-md-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => removeFloorPlan(index)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(formData.media?.floorPlans || []).length === 0 && (
                        <p className="text-muted small">No floor plans added yet.</p>
                    )}
                </div>
            </div>

            <hr className="my-4" />

            {/* 4 & 5. 3D & Virtual Tour */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">3D Walkthrough Link</label>
                    <div className="input-group">
                        <span className="input-group-text"><Layout size={18} /></span>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="Matterport or custom 3D URL"
                            value={formData.media?.walkthrough3D || ''}
                            onChange={(e) => handleMediaChange('walkthrough3D', e.target.value)}
                        />
                    </div>
                    <small className="text-muted">Enter full URL including https://</small>
                </div>
                <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Virtual Tour (360°)</label>
                    <div className="input-group">
                        <span className="input-group-text"><ExternalLink size={18} /></span>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="360° Tour URL or iframe link"
                            value={formData.media?.virtualTour360 || ''}
                            onChange={(e) => handleMediaChange('virtualTour360', e.target.value)}
                        />
                        {formData.media?.virtualTour360 && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => window.open(formData.media.virtualTour360, '_blank')}
                            >
                                Preview
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 6. Video Tour */}
            <div className="row mb-4">
                <div className="col-md-12 mb-3">
                    <label className="form-label fw-semibold">Video Tour URL</label>
                    <div className="input-group">
                        <span className="input-group-text"><Video size={18} /></span>
                        <input
                            type="url"
                            className="form-control"
                            placeholder="YouTube or Vimeo URL"
                            value={formData.media?.videoTour || ''}
                            onChange={(e) => handleMediaChange('videoTour', e.target.value)}
                        />
                    </div>
                    {getVideoEmbedUrl(formData.media?.videoTour) && (
                        <div className="video-preview-wrap mt-3 rounded overflow-hidden shadow-sm">
                            <iframe
                                width="100%"
                                height="315"
                                src={getVideoEmbedUrl(formData.media.videoTour)}
                                title="Video Tour"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                </div>
            </div>

            <hr className="my-4" />

            {/* 7. Brochure PDF */}
            <div className="media-group mb-4">
                <ImageUpload
                    label="Brochure PDF"
                    helpText="Single PDF upload. Max 5MB."
                    accept="application/pdf"
                    maxSizeMB={5}
                    value={formData.media?.brochurePdf || ''}
                    onChange={(val) => handleMediaChange('brochurePdf', val)}
                    onUploadStart={() => setIsUploading(true)}
                    onUploadFinish={() => setIsUploading(false)}
                />
                {formData.media?.brochurePdf && (
                    <div className="mt-2 text-end">
                        <a
                            href={formData.media.brochurePdf.startsWith('http') ? formData.media.brochurePdf : `${API_BASE_URL}${formData.media.brochurePdf}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-link text-primary"
                        >
                            View PDF
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaSection;
