import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/api';
import { Calendar, Clock, User, Home, CheckCircle, XCircle, Trash2, Loader, Filter } from 'lucide-react';
import './ManageAppointments.css';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await appointmentService.getAll();
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await appointmentService.update(id, { status });
            setAppointments(prev => prev.map(app => app._id === id ? { ...app, status } : app));
        } catch (error) {
            alert("Error updating status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await appointmentService.delete(id);
            setAppointments(prev => prev.filter(app => app._id !== id));
        } catch (error) {
            alert("Error deleting appointment");
        }
    };

    const filteredAppointments = filter === 'All'
        ? appointments
        : appointments.filter(app => app.status === filter);

    if (loading) return (
        <div className="d-flex justify-content-center py-5">
            <Loader className="spin" size={32} />
        </div>
    );

    return (
        <div className="appointments-page">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Showing & Appointments</h2>
                    <p className="text-muted">Manage property viewing requests from your AI assistant.</p>
                </div>
                <div className="filter-group d-flex align-items-center gap-2">
                    <Filter size={18} className="text-muted" />
                    <select
                        className="form-select status-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="appointments-grid">
                {filteredAppointments.length > 0 ? (
                    filteredAppointments.map(app => (
                        <div key={app._id} className={`appointment-card glass-panel ${app.status.toLowerCase()}`}>
                            <div className="card-status-badge">{app.status}</div>
                            <div className="card-main">
                                <div className="prop-info mb-3">
                                    <Home size={18} className="icon-gold" />
                                    <div>
                                        <h4>{app.property?.title?.en || 'Unknown Property'}</h4>
                                        <p className="small text-muted">{app.property?.location}</p>
                                    </div>
                                </div>

                                <div className="client-info mb-3">
                                    <User size={18} className="text-muted" />
                                    <div>
                                        <p className="mb-0 fw-bold">{app.user?.name || 'Guest User'}</p>
                                        <p className="small text-muted mb-0">{app.user?.email || 'No email provided'}</p>
                                    </div>
                                </div>

                                <div className="time-info d-flex gap-4">
                                    <div className="d-flex align-items-center gap-2">
                                        <Calendar size={16} className="text-muted" />
                                        <span>{new Date(app.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <Clock size={16} className="text-muted" />
                                        <span>{app.timeSlot}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer d-flex justify-content-between align-items-center">
                                <div className="actions d-flex gap-2">
                                    {app.status === 'Pending' && (
                                        <button
                                            className="btn-icon confirm"
                                            title="Confirm"
                                            onClick={() => handleUpdateStatus(app._id, 'Confirmed')}
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                    )}
                                    {app.status !== 'Cancelled' && app.status !== 'Completed' && (
                                        <button
                                            className="btn-icon cancel"
                                            title="Cancel"
                                            onClick={() => handleUpdateStatus(app._id, 'Cancelled')}
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    )}
                                </div>
                                <button
                                    className="btn-icon delete"
                                    onClick={() => handleDelete(app._id)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state text-center py-5 w-100">
                        <Calendar size={48} className="text-muted mb-3" />
                        <h3>No appointments found</h3>
                        <p className="text-muted">Viewing requests will appear here once users book them via the chatbot.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAppointments;
