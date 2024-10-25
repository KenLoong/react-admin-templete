import React from 'react';
import { Navigate, useLocation } from 'react-router-dom'

export const RouterAuth = ({ children }) => {
    const token = localStorage.getItem('token')
    const location = useLocation()

    if (!token && location.pathname !== '/login') {
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    return children
}
