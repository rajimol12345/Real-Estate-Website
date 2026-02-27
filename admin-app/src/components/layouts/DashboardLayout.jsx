import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="dashboard-wrapper">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className="main-content">
                <Header onToggleSidebar={toggleSidebar} />
                <div className="page-body">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
