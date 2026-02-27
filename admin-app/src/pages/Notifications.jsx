import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import { Bell, Check, Trash2, Clock, Info, User, Target, MessageSquare, Home } from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this notification?')) return;
        try {
            await notificationService.delete(id);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking all as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'lead': return <Target size={20} className="type-icon lead" />;
            case 'contact': return <MessageSquare size={20} className="type-icon contact" />;
            case 'property': return <Home size={20} className="type-icon property" />;
            case 'system': return <Info size={20} className="type-icon system" />;
            default: return <Bell size={20} className="type-icon default" />;
        }
    };

    return (
        <div className="notifications-page fade-in">
            <div className="page-header-fid">
                <div className="title-area">
                    <h2>System <span>Notifications</span></h2>
                    <p>Manage and track system events and alerts</p>
                </div>
                <div className="action-area">
                    <button onClick={handleMarkAllRead} className="btn-secondary-fid">
                        <Check size={18} /> Mark All Read
                    </button>
                </div>
            </div>

            <div className="notifications-container">
                {loading ? (
                    <div className="loading-state">Loading notifications...</div>
                ) : notifications.length > 0 ? (
                    <div className="notifications-list">
                        {notifications.map(n => (
                            <div key={n._id} className={`notification-card ${!n.isRead ? 'unread' : ''}`}>
                                <div className="card-icon">
                                    {getIcon(n.type)}
                                </div>
                                <div className="card-content">
                                    <div className="card-header">
                                        <h4>{n.title}</h4>
                                        <span className="card-time">
                                            <Clock size={14} /> {new Date(n.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className="card-msg">{n.message}</p>
                                    {n.link && (
                                        <a href={n.link} className="card-link">View Details</a>
                                    )}
                                </div>
                                <div className="card-actions">
                                    {!n.isRead && (
                                        <button onClick={() => handleMarkAsRead(n._id)} title="Mark as read">
                                            <Check size={18} />
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(n._id)} className="delete-btn" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <Bell size={48} />
                        <p>No notifications to show</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
