import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Home,
    Users,
    UserRound,
    BookOpen,
    MessageSquare,
    LogOut,
    Target,
    Settings,
    Bell,
    Calendar,
    Sparkles,
    Image,
    X,
    MapPin
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login');
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && <div className="sidebar-overlay-fid" onClick={onClose}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <h2>estate<span>PRO</span></h2>
                    <button className="sidebar-close-fid" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <LayoutDashboard size={20} /> <span>{t('dashboard.overview')}</span>
                    </NavLink>
                    <NavLink to="/notifications" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Bell size={20} /> <span>{t('dashboard.notifications')}</span>
                    </NavLink>
                    <NavLink to="/properties" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Home size={20} /> <span>{t('dashboard.properties')}</span>
                    </NavLink>
                    <NavLink to="/gallery" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Image size={20} /> <span>{t('dashboard.gallery', 'Gallery')}</span>
                    </NavLink>
                    <NavLink to="/locations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <MapPin size={20} /> <span>{t('dashboard.locations', 'Locations')}</span>
                    </NavLink>
                    <NavLink to="/agents" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <UserRound size={20} /> <span>{t('dashboard.agents')}</span>
                    </NavLink>
                    <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Users size={20} /> <span>{t('dashboard.users')}</span>
                    </NavLink>
                    <NavLink to="/blogs" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <BookOpen size={20} /> <span>{t('dashboard.blogs')}</span>
                    </NavLink>
                    <NavLink to="/messages" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <MessageSquare size={20} /> <span>{t('dashboard.messages')}</span>
                    </NavLink>
                    <NavLink to="/leads" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Target size={20} /> <span>{t('dashboard.leads')}</span>
                    </NavLink>
                    <NavLink to="/appointments" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Calendar size={20} /> <span>{t('dashboard.appointments')}</span>
                    </NavLink>
                    <NavLink to="/ai-chats" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Sparkles size={20} /> <span>{t('dashboard.aichats')}</span>
                    </NavLink>
                    <NavLink to="/bot-settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                        <Settings size={20} /> <span>{t('dashboard.settings')}</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <LogOut size={20} /> <span>{t('dashboard.logout')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
