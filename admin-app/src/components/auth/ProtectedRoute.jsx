import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Basic auth check - in real app, check JWT from localStorage/Context
    const isAuthenticated = localStorage.getItem('adminToken');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
