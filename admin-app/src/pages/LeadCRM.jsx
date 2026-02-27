import React, { useState, useEffect } from 'react';
import { leadService } from '../services/api';
import { Trash2, Phone, Mail, DollarSign, Target, User, Clock, Loader, Search, Filter, Download } from 'lucide-react';
import './LeadCRM.css';

import Pagination from '../components/common/Pagination';

const LeadCRM = () => {
    const [leads, setLeads] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchLeads();
    }, [currentPage]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await leadService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setLeads(res.data.leads);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching leads', error);
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (leads.length === 0) return;
        const headers = ["Name", "Email", "Phone", "Interest", "Budget", "Status", "Date"];
        const rows = leads.map(lead => [
            lead.name,
            lead.email,
            lead.phone || "N/A",
            lead.interest,
            lead.budget || "Any",
            lead.status,
            new Date(lead.createdAt).toLocaleDateString()
        ]);
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
        ].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `estatepro_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await leadService.update(id, { status });
            setLeads(leads.map(lead => lead._id === id ? { ...lead, status } : lead));
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Confirm deletion of this lead?')) {
            try {
                await leadService.delete(id);
                setLeads(leads.filter(lead => lead._id !== id));
            } catch (error) {
                console.error('Error deleting lead', error);
            }
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status) => {
        const colors = {
            'New': 'status-new',
            'Contacted': 'status-contacted',
            'Qualified': 'status-qualified',
            'Lost': 'status-lost'
        };
        return <span className={`lead-status-badge ${colors[status] || ''}`}>{status}</span>;
    };

    return (
        <div className="lead-crm-page">
            <div className="crm-header mb-4">
                <div className="header-info">
                    <h2>Lead Management CRM</h2>
                    <p>Track and manage high-interest leads generated from the Luxury Chatbot.</p>
                </div>
                <div className="header-actions d-flex align-items-center gap-3">
                    <button onClick={handleExport} className="btn btn-outline-secondary d-flex align-items-center gap-2">
                        <Download size={18} /> Export CSV
                    </button>
                    <div className="search-box-crm">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Find leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="crm-stats row mb-4">
                <div className="col-md-3">
                    <div className="stat-card shadow-sm">
                        <div className="stat-icon new"><Target size={24} /></div>
                        <div className="stat-data">
                            <h4>{leads.filter(l => l.status === 'New').length}</h4>
                            <p>New Leads</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card shadow-sm">
                        <div className="stat-icon qualified"><DollarSign size={24} /></div>
                        <div className="stat-data">
                            <h4>{leads.filter(l => l.status === 'Qualified').length}</h4>
                            <p>Qualified</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="stat-card shadow-sm">
                        <div className="stat-icon total"><User size={24} /></div>
                        <div className="stat-data">
                            <h4>{totalCount}</h4>
                            <p>Total Leads</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="crm-content glass-card shadow">
                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <Loader className="spin" size={32} />
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table crm-table">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Contact Information</th>
                                        <th>Budget / Interest</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead._id}>
                                            <td>
                                                <div className="client-info">
                                                    <div className="client-name">{lead.name}</div>
                                                    <div className="client-date"><Clock size={12} /> {new Date(lead.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="contact-info">
                                                    <div><Mail size={14} /> {lead.email}</div>
                                                    <div><Phone size={14} /> {lead.phone || 'N/A'}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="interest-info">
                                                    <div className="budget-label">{lead.budget || 'Any'}</div>
                                                    <div className="interest-type">{lead.interest}</div>
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    className="status-select"
                                                    value={lead.status}
                                                    onChange={(e) => handleUpdateStatus(lead._id, e.target.value)}
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Qualified">Qualified</option>
                                                    <option value="Lost">Lost</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button className="del-btn" onClick={() => handleDelete(lead._id)}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 text-muted">No leads found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default LeadCRM;
