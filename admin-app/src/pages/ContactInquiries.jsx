import React, { useState, useEffect } from 'react';
import { messageService } from '../services/api';
import { Trash2, Eye, Mail, MessageSquare, Search, Filter, Loader, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './ContactInquiries.css';

const ContactInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingInquiry, setViewingInquiry] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await messageService.getAll();
            const inquiriesData = res.data.messages || res.data;
            setInquiries(inquiriesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inquiries', error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await messageService.update(id, { status });
            // Update local state
            setInquiries(inquiries.map(item => item._id === id ? { ...item, status } : item));
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            try {
                await messageService.delete(id);
                setInquiries(inquiries.filter(item => item._id !== id));
                if (viewingInquiry?._id === id) setViewingInquiry(null);
            } catch (error) {
                console.error('Error deleting inquiry', error);
            }
        }
    };

    const handleView = async (inquiry) => {
        setViewingInquiry(inquiry);
        if (inquiry.status === 'New') {
            handleUpdateStatus(inquiry._id, 'Read');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'New':
                return <span className="status-badge new"><AlertCircle size={12} /> New</span>;
            case 'Read':
                return <span className="status-badge read"><Clock size={12} /> Read</span>;
            case 'Replied':
                return <span className="status-badge replied"><CheckCircle size={12} /> Replied</span>;
            default:
                return <span className="status-badge">{status}</span>;
        }
    };

    const filteredData = inquiries.filter(item => {
        const matchesSearch =
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="contact-inquiries-page">
            <div className="page-header mb-4">
                <div className="header-info">
                    <h2>Enquiries & Messages</h2>
                    <p className="text-muted">Manage all property inquiries and contact form submissions.</p>
                </div>

                <div className="header-actions">
                    <div className="search-group">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <Filter className="filter-icon" size={18} />
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="All">All Status</option>
                            <option value="New">New</option>
                            <option value="Read">Read</option>
                            <option value="Replied">Replied</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="inquiry-content-area">
                {loading ? (
                    <div className="loader-container">
                        <Loader className="spinner" />
                        <span>Loading inquiries...</span>
                    </div>
                ) : (
                    <div className="table-responsive inquiry-table-container shadow-sm">
                        <table className="table inquiry-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Website</th>
                                    <th>Message</th>
                                    <th>Status</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item._id} className={item.status === 'New' ? 'row-unread' : ''}>
                                            <td><div className="fw-bold">{item.name}</div></td>
                                            <td><a href={`mailto:${item.email}`} className="email-link">{item.email}</a></td>
                                            <td>
                                                {item.website ? (
                                                    <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="website-link">
                                                        {item.website.replace(/^https?:\/\//, '')}
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">-</span>
                                                )}
                                            </td>
                                            <td><div className="message-preview text-truncate" style={{ maxWidth: '200px' }}>{item.message}</div></td>
                                            <td>{getStatusBadge(item.status)}</td>
                                            <td className="text-end">
                                                <div className="action-btns">
                                                    <button className="btn-action view" onClick={() => handleView(item)} title="View Message">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="btn-action delete" onClick={() => handleDelete(item._id)} title="Delete Inquiry">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 no-data">
                                            <MessageSquare size={48} className="mb-2 opacity-25" />
                                            <p>No inquiries found matching your criteria.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inquiry Detail Modal */}
            {viewingInquiry && (
                <div className="inquiry-modal-overlay">
                    <div className="inquiry-modal shadow-lg fade-in">
                        <div className="modal-header">
                            <h3>Inquiry Details</h3>
                            <button className="close-btn" onClick={() => setViewingInquiry(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="inquiry-meta">
                                <div className="meta-item">
                                    <label>From:</label> <span>{viewingInquiry.name} ({viewingInquiry.email})</span>
                                </div>
                                <div className="meta-item">
                                    <label>Website:</label>
                                    <span>
                                        {viewingInquiry.website ? (
                                            <a href={viewingInquiry.website.startsWith('http') ? viewingInquiry.website : `https://${viewingInquiry.website}`} target="_blank" rel="noopener noreferrer">
                                                {viewingInquiry.website}
                                            </a>
                                        ) : 'None'}
                                    </span>
                                </div>
                                <div className="meta-item">
                                    <label>Date:</label> <span>{new Date(viewingInquiry.dateReceived).toLocaleString()}</span>
                                </div>
                                <div className="meta-item">
                                    <label>Status:</label> <span>{getStatusBadge(viewingInquiry.status)}</span>
                                </div>
                                <div className="meta-item full-width">
                                    <label>Subject:</label> <h5>{viewingInquiry.subject || 'Property Inquiry'}</h5>
                                </div>
                            </div>
                            <div className="message-content">
                                <label>Message:</label>
                                <div className="message-text">
                                    {viewingInquiry.message}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <div className="status-updater">
                                <label>Set Status:</label>
                                <select
                                    value={viewingInquiry.status}
                                    onChange={(e) => handleUpdateStatus(viewingInquiry._id, e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="Read">Read</option>
                                    <option value="Replied">Replied</option>
                                </select>
                            </div>
                            <div className="footer-actions">
                                <button className="btn btn-secondary" onClick={() => setViewingInquiry(null)}>Close</button>
                                <a href={`mailto:${viewingInquiry.email}`} className="btn btn-primary d-flex align-items-center gap-2" onClick={() => handleUpdateStatus(viewingInquiry._id, 'Replied')}>
                                    <Mail size={16} /> Reply via Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactInquiries;
