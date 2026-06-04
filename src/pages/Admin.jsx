import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminDashboard from '../components/AdminDashboard'
import '../styles/Admin.css'

function Admin() {
    const { currentUser, isAdmin, loading } = useAuth()

    if (loading) {
        return <div className="loading">Loading...</div>
    }

    if (!currentUser) {
        return (
            <div className="access-denied">
                <h2>🔒 Access Denied</h2>
                <p>Please login to access admin area.</p>
                <a href="/login" className="login-link">Go to Login</a>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="access-denied">
                <h2>⛔ Access Denied</h2>
                <p>You don't have permission to access the admin area.</p>
                <a href="/" className="home-link">Return to Home</a>
            </div>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
    )
}

export default Admin