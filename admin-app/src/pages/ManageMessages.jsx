import React, { useState, useEffect } from 'react';
import { messageService } from '../services/api';
import { Trash2, X, Search, Mail, User, Clock, MessageSquare } from 'lucide-react';
import './ManageMessages.css';

import Pagination from '../components/common/Pagination';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingMessage, setViewingMessage] = useState(null);

    useEffect(() => {
        fetchMessages();
    }, [currentPage]);

    const fetchMessages = async () => {
        try {
            const res = await messageService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setMessages(res.data.messages);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await messageService.delete(id);
                if (viewingMessage?._id === id) setViewingMessage(null);
                fetchMessages();
            } catch (error) {
                console.error('Error deleting message', error);
            }
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-messages">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Enquiries & Messages</h2>
                    <p>Total {totalCount} messages received</p>
                </div>
                <div className="header-actions">
                    <div className="search-box-fid">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-5">
                    <div className="content-card message-list-card">
                        <div className="card-body p-0">
                            <div className="message-list-header p-3 border-bottom">
                                <strong>Inbox</strong>
                            </div>
                            <div className="message-items">
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((msg) => (
                                        <div
                                            key={msg._id}
                                            className={`message-item p-3 border-bottom ${viewingMessage?._id === msg._id ? 'active' : ''}`}
                                            onClick={() => setViewingMessage(msg)}
                                        >
                                            <div className="d-flex justify-content-between mb-1">
                                                <div className="msg-sender fw-bold">{msg.name}</div>
                                                <div className="msg-date small text-muted">
                                                    {new Date(msg.dateReceived).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="msg-subject text-truncate small fw-semibold text-primary">
                                                {msg.subject || '(No Subject)'}
                                            </div>
                                            <div className="msg-preview text-truncate small text-muted">
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-muted">
                                        No messages found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-7">
                    <div className="content-card message-view-card">
                        <div className="card-body h-100">
                            {viewingMessage ? (
                                <div className="message-content fade-in h-100 d-flex flex-column">
                                    <div className="message-content-header pb-3 border-bottom mb-4">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <h4 className="mb-1">{viewingMessage.subject || 'Enquiry'}</h4>
                                                <div className="d-flex align-items-center gap-3 text-muted small">
                                                    <span className="d-flex align-items-center gap-1"><User size={14} /> {viewingMessage.name}</span>
                                                    <span className="d-flex align-items-center gap-1"><Mail size={14} /> {viewingMessage.email}</span>
                                                    <span className="d-flex align-items-center gap-1"><Clock size={14} /> {new Date(viewingMessage.dateReceived).toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                                                onClick={() => handleDelete(viewingMessage._id)}
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="message-body flex-grow-1 py-3 overflow-auto">
                                        <div className="message-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                            {viewingMessage.message}
                                        </div>
                                    </div>
                                    <div className="message-footer pt-3 border-top mt-auto">
                                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => window.location.href = `mailto:${viewingMessage.email}`}>
                                            <Mail size={16} /> Reply to User
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-100 d-flex flex-column align-items-center justify-content-center text-muted">
                                    <MessageSquare size={48} className="mb-3 opacity-25" />
                                    <p>Select a message to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageMessages;
