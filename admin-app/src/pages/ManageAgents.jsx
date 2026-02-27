import React, { useState, useEffect } from 'react';
import { agentService, uploadService } from '../services/api';
import { Plus, Edit, Trash2, X, Search, Facebook, Twitter, Linkedin, Instagram, Upload } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';
import './ManageAgents.css';

import Pagination from '../components/common/Pagination';

const ManageAgents = () => {
    const [agents, setAgents] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
        photo: '',
        isRealtor: true,
        socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        }
    });

    useEffect(() => {
        fetchAgents();
    }, [currentPage]);

    const fetchAgents = async () => {
        try {
            const res = await agentService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setAgents(res.data.agents);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching agents', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);

        setIsUploading(true);
        try {
            const response = await uploadService.uploadSingle(uploadData);
            // The backend now returns { url: "/uploads/..." }
            const filePath = response.data.url;
            setFormData({ ...formData, photo: filePath });
        } catch (error) {
            console.error('Error uploading file', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAgent) {
                await agentService.update(editingAgent._id, formData);
            } else {
                await agentService.create(formData);
            }
            setShowModal(false);
            setEditingAgent(null);
            resetForm();
            fetchAgents();
        } catch (error) {
            console.error('Error saving agent', error);
        }
    };

    const handleEdit = (agent) => {
        setEditingAgent(agent);
        setFormData({
            name: agent.name,
            email: agent.email || '',
            phone: agent.phone || '',
            description: typeof agent.description === 'string' ? agent.description : (agent.description?.en || ''),
            photo: agent.photo || '',
            isRealtor: agent.isRealtor,
            socialLinks: {
                facebook: agent.socialLinks?.facebook || '',
                twitter: agent.socialLinks?.twitter || '',
                linkedin: agent.socialLinks?.linkedin || '',
                instagram: agent.socialLinks?.instagram || ''
            }
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            try {
                await agentService.delete(id);
                fetchAgents();
            } catch (error) {
                console.error('Error deleting agent', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            description: '',
            photo: '',
            isRealtor: true,
            socialLinks: {
                facebook: '',
                twitter: '',
                linkedin: '',
                instagram: ''
            }
        });
    };

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-agents">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Manage Agents</h2>
                    <p>Total {totalCount} active agents</p>
                </div>
                <div className="header-actions">
                    <div className="search-box-fid me-3 d-inline-block">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary d-inline-flex align-items-center gap-2" onClick={() => { resetForm(); setEditingAgent(null); setShowModal(true); }}>
                        <Plus size={18} /> Add New Agent
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Socials</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgents.map((agent) => (
                                    <tr key={agent._id}>
                                        <td>
                                            <img
                                                src={getImageUrl(agent.photo)}
                                                alt={agent.name}
                                                className="agent-thumb-fid"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                                            />                                        </td>
                                        <td>
                                            <div className="agent-name-fid">{agent.name}</div>
                                            <div className="agent-role-fid">{agent.isRealtor ? 'Realtor' : 'Assistant'}</div>
                                        </td>
                                        <td>{agent.email}</td>
                                        <td>{agent.phone}</td>
                                        <td>
                                            <div className="social-links-list">
                                                {agent.socialLinks?.facebook && <Facebook size={14} className="social-icon-fid" />}
                                                {agent.socialLinks?.twitter && <Twitter size={14} className="social-icon-fid" />}
                                                {agent.socialLinks?.linkedin && <Linkedin size={14} className="social-icon-fid" />}
                                                {agent.socialLinks?.instagram && <Instagram size={14} className="social-icon-fid" />}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-icon text-primary" onClick={() => handleEdit(agent)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn btn-icon text-danger" onClick={() => handleDelete(agent._id)}>
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
                    <div className="modal-content-fid agent-modal">
                        <div className="modal-header-fid">
                            <h4>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body-fid">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="form-group-fid mb-3">
                                            <label>Full Name</label>
                                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 form-group-fid mb-3">
                                                <label>Email Address</label>
                                                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                                            </div>
                                            <div className="col-md-6 form-group-fid mb-3">
                                                <label>Phone Number</label>
                                                <input type="text" name="phone" className="form-control" value={formData.phone} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="form-group-fid mb-3">
                                            <label>Bio / Description</label>
                                            <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="form-group-fid mb-3">
                                            <label>Photo URL / Upload</label>
                                            <div className="input-group mb-2">
                                                <input type="text" name="photo" className="form-control form-control-sm" value={formData.photo} onChange={handleInputChange} placeholder="agent-1.jpg" />
                                                <label className="input-group-text p-0" style={{ cursor: 'pointer' }}>
                                                    <Upload size={14} className="mx-2" />
                                                    <input type="file" className="d-none" onChange={handleFileUpload} accept="image/*" />
                                                </label>
                                            </div>
                                            {isUploading && <small className="text-primary d-block mt-1">Uploading image...</small>}
                                        </div>
                                        <div className="form-check form-switch mb-3">
                                            <input className="form-check-input" type="checkbox" name="isRealtor" checked={formData.isRealtor} onChange={handleInputChange} />
                                            <label className="form-check-label">Is Official Realtor?</label>
                                        </div>
                                        <label className="mb-2 d-block fw-bold" style={{ fontSize: '13px' }}>Social Links</label>
                                        <div className="social-input-group">
                                            <div className="input-group mb-2">
                                                <span className="input-group-text"><Facebook size={14} /></span>
                                                <input type="text" name="socialLinks.facebook" className="form-control form-control-sm" value={formData.socialLinks.facebook} onChange={handleInputChange} placeholder="ID" />
                                            </div>
                                            <div className="input-group mb-2">
                                                <span className="input-group-text"><Twitter size={14} /></span>
                                                <input type="text" name="socialLinks.twitter" className="form-control form-control-sm" value={formData.socialLinks.twitter} onChange={handleInputChange} placeholder="ID" />
                                            </div>
                                            <div className="input-group mb-2">
                                                <span className="input-group-text"><Linkedin size={14} /></span>
                                                <input type="text" name="socialLinks.linkedin" className="form-control form-control-sm" value={formData.socialLinks.linkedin} onChange={handleInputChange} placeholder="ID" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isUploading}>
                                    {isUploading ? 'Please Wait...' : (editingAgent ? 'Update Agent' : 'Create Agent')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAgents;
