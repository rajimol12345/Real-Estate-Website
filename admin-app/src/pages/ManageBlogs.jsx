import React, { useState, useEffect } from 'react';
import { blogService, uploadService } from '../services/api';
import { Plus, Edit, Trash2, X, Search, User, Calendar, Upload } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';
import './ManageBlogs.css';

import Pagination from '../components/common/Pagination';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        author: 'Admin',
        imageUrl: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, [currentPage]);

    const fetchBlogs = async () => {
        try {
            const res = await blogService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setBlogs(res.data.blogs);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching blogs', error);
        }
    };

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
            setFormData({ ...formData, imageUrl: res.data.url });
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBlog) {
                await blogService.update(editingBlog._id, formData);
            } else {
                await blogService.create(formData);
            }
            setShowModal(false);
            setEditingBlog(null);
            resetForm();
            fetchBlogs();
        } catch (error) {
            console.error('Error saving blog post', error);
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: typeof blog.title === 'string' ? blog.title : (blog.title?.en || ''),
            content: typeof blog.content === 'string' ? blog.content : (blog.content?.en || ''),
            author: blog.author || 'Admin',
            imageUrl: blog.imageUrl || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await blogService.delete(id);
                fetchBlogs();
            } catch (error) {
                console.error('Error deleting blog post', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            content: '',
            author: 'Admin',
            imageUrl: ''
        });
    };

    const filteredBlogs = blogs.filter(blog => {
        const titleStr = typeof blog.title === 'string' ? blog.title : (blog.title?.en || '');
        return titleStr.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="manage-blogs">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Manage Blog Posts</h2>
                    <p>Total {totalCount} posts published</p>
                </div>
                <div className="header-actions">
                    <div className="search-box-fid me-3 d-inline-block">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => { resetForm(); setEditingBlog(null); setShowModal(true); }}>
                        <Plus size={18} /> Add New Post
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog._id}>
                                        <td>
                                            <div className="blog-thumb-fid">
                                                <img
                                                    src={getImageUrl(blog.imageUrl)}
                                                    alt={typeof blog.title === 'string' ? blog.title : blog.title?.en}
                                                    className="img-fluid rounded"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="blog-title-table-fid">
                                                {typeof blog.title === 'string' ? blog.title : blog.title?.en}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1 text-muted small">
                                                <User size={14} /> {blog.author}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-1 text-muted small">
                                                <Calendar size={14} /> {new Date(blog.datePosted).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-icon text-primary" onClick={() => handleEdit(blog)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn btn-icon text-danger" onClick={() => handleDelete(blog._id)}>
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
                    <div className="modal-content-fid blog-modal">
                        <div className="modal-header-fid">
                            <h4>{editingBlog ? 'Edit Blog Post' : 'Add New Post'}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body-fid">
                                <div className="form-group-fid mb-3">
                                    <label>Post Title</label>
                                    <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                                </div>
                                <div className="row">
                                    <div className="col-md-6 form-group-fid mb-3">
                                        <label>Author Name</label>
                                        <input type="text" name="author" className="form-control" value={formData.author} onChange={handleInputChange} required />
                                    </div>
                                    <div className="col-md-6 form-group-fid mb-3">
                                        <label>Cover Image URL / Upload</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                name="imageUrl"
                                                className="form-control"
                                                value={formData.imageUrl}
                                                onChange={handleInputChange}
                                                placeholder="blog-1.jpg"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => document.getElementById('blog-upload').click()}
                                                disabled={isUploading}
                                            >
                                                {isUploading ? <span className="spinner-border spinner-border-sm"></span> : <Upload size={18} />}
                                            </button>
                                        </div>
                                        <input
                                            id="blog-upload"
                                            type="file"
                                            className="d-none"
                                            onChange={handleFileUpload}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                                <div className="form-group-fid mb-3">
                                    <label>Content</label>
                                    <textarea name="content" className="form-control" rows="10" value={formData.content} onChange={handleInputChange} required></textarea>
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                                    {isUploading ? 'Uploading...' : (editingBlog ? 'Update Post' : 'Publish Post')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBlogs;
