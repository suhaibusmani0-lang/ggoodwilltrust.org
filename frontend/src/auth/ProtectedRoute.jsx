import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    // Agar user login nahi hai, toh wapas login page par bhej do
    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    // Agar login hai, toh Admin Dashboard dikha do
    return children;
};

export default ProtectedRoute;