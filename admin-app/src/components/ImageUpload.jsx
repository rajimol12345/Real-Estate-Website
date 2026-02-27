import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { uploadService } from '../services/api';
import './ImageUpload.css';

const ImageUpload = ({
    label = "Upload Image",
    helpText = "Accepts JPG, PNG, WEBP. Max size 2MB.",
    accept = "image/jpeg, image/png, image/webp",
    maxSizeMB = 2,
    multiple = false,
    maxFiles = undefined,
    value = [], // Should be an array of strings (URLs)
    onChange,
    onUploadStart,
    onUploadFinish
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef(null);

    // Convert array-based values or single string to array for internal handling
    const currentImages = Array.isArray(value) ? value : (value ? [value] : []);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
            // Reset input value so same file can be selected again if needed
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const processFiles = async (files) => {
        setError('');

        // File limits check
        let filesToProcess = files;
        if (!multiple) {
            filesToProcess = [files[0]];
        } else if (maxFiles && currentImages.length + files.length > maxFiles) {
            setError(`You can only upload up to ${maxFiles} images.`);
            filesToProcess = files.slice(0, Math.max(0, maxFiles - currentImages.length));
            if (filesToProcess.length === 0) return;
        }

        // Validation
        const validFiles = [];
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        for (const file of filesToProcess) {
            if (file.size > maxSizeBytes) {
                setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
                continue;
            }

            // Basic type validation if accept is provided (browsers handle this mostly, but good for D&D)
            if (accept && !accept.split(',').some(type => file.type.match(type.trim().replace('*', '.*')))) {
                // If we're uploading PDFs, relax image checking slightly
                if (!(accept.includes('pdf') && file.type === 'application/pdf')) {
                    setError(`File type not accepted for "${file.name}".`);
                    continue;
                }
            }

            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Upload files
        setIsUploading(true);
        if (onUploadStart) onUploadStart();

        const newUrls = [...currentImages];

        try {
            if (multiple) {
                // Upload multiple at once
                const formData = new FormData();
                validFiles.forEach(f => formData.append('images', f));
                const res = await uploadService.uploadMultiple(formData);
                newUrls.push(...res.data);
            } else {
                // Upload single
                const formData = new FormData();
                formData.append('image', validFiles[0]);
                const res = await uploadService.uploadSingle(formData);

                // For single upload, replace existing string rather than push
                const finalValue = res.data.url;
                onChange(finalValue);
                return; // exit early for single
            }

            // Pass the updated array back up
            onChange(newUrls);
        } catch (err) {
            console.error("Upload error", err);
            setError("Failed to upload file(s). Please try again.");
        } finally {
            setIsUploading(false);
            if (onUploadFinish) onUploadFinish();
        }
    };

    const removeImage = (indexToRemove) => {
        if (!multiple) {
            onChange('');
            return;
        }
        const newUrls = currentImages.filter((_, idx) => idx !== indexToRemove);
        onChange(newUrls);
    };

    // Check if we reached the limit
    const isLimitReached = multiple && maxFiles && currentImages.length >= maxFiles;
    // For single mode, if we have an image, we hide the dropzone unless they remove it
    const hideDropzone = (!multiple && currentImages.length > 0) || isLimitReached;

    return (
        <div className="image-upload-wrapper">
            <div className="d-flex justify-content-between align-items-end mb-2">
                <label className="form-label mb-0 fw-semibold">{label}</label>
                {multiple && maxFiles && (
                    <small className="text-muted">{currentImages.length} / {maxFiles}</small>
                )}
            </div>

            {!hideDropzone && (
                <div
                    className={`upload-dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && inputRef.current && inputRef.current.click()}
                >
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleChange}
                        accept={accept}
                        multiple={multiple}
                        style={{ display: 'none' }}
                    />

                    <div className="dropzone-content">
                        {isUploading ? (
                            <div className="upload-spinner">
                                <div className="spinner-border text-primary mb-2" role="status"></div>
                                <p className="mb-0 text-muted">Uploading...</p>
                            </div>
                        ) : (
                            <>
                                <UploadCloud className="upload-icon mb-2" size={32} />
                                <p className="mb-1 fw-medium">Click to upload or drag and drop</p>
                                <p className="text-muted small mb-0">{helpText}</p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {error && <div className="text-danger small mt-2">{error}</div>}

            {/* Previews */}
            {currentImages.length > 0 && (
                <div className={`upload-previews ${multiple ? 'grid-view' : 'single-view'} mt-3`}>
                    {currentImages.map((src, idx) => (
                        <div key={`${src}-${idx}`} className="preview-item">
                            {src.endsWith('.pdf') ? (
                                <div className="pdf-preview-box">
                                    <div className="pdf-icon">PDF</div>
                                    <span className="pdf-name text-truncate" title={src.split('/').pop()}>{src.split('/').pop()}</span>
                                </div>
                            ) : (
                                <img src={src.startsWith('http') || src.startsWith('blob') ? src : `http://localhost:5005${src}`} alt={`Preview ${idx}`} />
                            )}
                            <button
                                type="button"
                                className="preview-remove-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(idx);
                                }}
                                title="Remove file"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
