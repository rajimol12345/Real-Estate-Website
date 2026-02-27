import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Search, User, X, Check, Trash2, Globe, Menu } from 'lucide-react';
import { notificationService } from '../../services/api';
import './Header.css';

const LANGUAGES = [
    { code: 'en', label: 'EN' },
    { code: 'bn', label: 'BN' },
    { code: 'de', label: 'DE' },
    { code: 'nl', label: 'NL' },
];

const Header = ({ onToggleSidebar }) => {
    const { t, i18n } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showLangs, setShowLangs] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

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

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('lng', code);
        setShowLangs(false);
    };

    return (
        <header className="admin-header">
            <div className="header-left">
                <button className="menu-toggle-fid" onClick={onToggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            <div className="header-right">
                {/* Language Switcher */}
                <div className="lang-wrapper">
                    <button className="icon-btn" onClick={() => { setShowLangs(!showLangs); setShowNotifications(false); }}>
                        <Globe size={20} />
                        <span className="lang-current">{i18n.language.toUpperCase()}</span>
                    </button>
                    {showLangs && (
                        <div className="lang-dropdown-admin fade-in">
                            {LANGUAGES.map(lang => (
                                <button
                                    key={lang.code}
                                    className={`lang-opt ${i18n.language === lang.code ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    {lang.label} {i18n.language === lang.code && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="notification-wrapper">
                    <button
                        className={`icon-btn ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown fade-in">
                            <div className="dropdown-header">
                                <h4>Notifications</h4>
                                {unreadCount > 0 && (
                                    <button onClick={handleMarkAllRead} className="mark-all-btn">Mark all read</button>
                                )}
                            </div>
                            <div className="dropdown-body">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification._id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
                                            <div className="noti-content">
                                                <p className="noti-title">{notification.title}</p>
                                                <p className="noti-msg">{notification.message}</p>
                                                <span className="noti-time">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="noti-actions">
                                                {!notification.isRead && (
                                                    <button onClick={() => handleMarkAsRead(notification._id)} title="Mark as read">
                                                        <Check size={14} />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(notification._id)} className="delete-btn" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-notifications">
                                        <p>No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            <div className="dropdown-footer">
                                <button onClick={() => setShowNotifications(false)}>Close</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <span>Administrator</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
