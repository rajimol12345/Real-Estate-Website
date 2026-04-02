import React, { useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { propertyService } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import './AddPhotoGalleryForm.css';

const AddPhotoGalleryForm = ({ formData, onNextStep, onPrevStep, onImageUpload, onImageRemove }) => {
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNextStep();
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadData = new FormData();
    for (let i = 0; i < files.length; i++) {
      uploadData.append('images', files[i]);
    }

    try {
      const response = await propertyService.uploadImages(uploadData);
      onImageUpload(response.data);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-photo-gallery-form">
      <h4 className="card-title">Add <span>Photo Gallery</span></h4>
      <form onSubmit={handleSubmit}>
        <div className={`upload-box ${uploading ? 'uploading' : ''}`}>
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            id="photo-upload"
            onChange={handleFileChange}
            disabled={uploading}
          />
          <label htmlFor="photo-upload" className="upload-area-label" style={{ cursor: uploading ? 'wait' : 'pointer', width: '100%', display: 'block' }}>
            <UploadCloud size={48} className="upload-icon" />
            <p>{uploading ? 'Uploading...' : 'Click here or drag & drop files to upload photos'}</p>
            <span className="upload-button">
              {uploading ? 'Wait...' : 'Browse Files'}
            </span>
          </label>
        </div>

        {/* Preview Gallery */}
        {formData?.images?.length > 0 && (
          <div className="image-preview-gallery mt-4">
            <h5>Uploaded Images</h5>
            <div className="preview-container d-flex flex-wrap gap-3">
              {formData.images.map((img, index) => (
                <div key={index} className="preview-item position-relative">
                  <img
                    src={getImageUrl(img)}
                    alt={`Upload ${index}`}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ddd' }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ padding: '2px 5px', fontSize: '10px' }}
                    onClick={() => onImageRemove(index)}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="form-actions d-flex justify-content-between mt-4">
          <button type="button" className="prev-btn" onClick={onPrevStep}>Previous Step</button>
          <button type="submit" className="next-btn" disabled={uploading}>Next Step</button>
        </div>
      </form>
    </div>
  );
};

export default AddPhotoGalleryForm;
