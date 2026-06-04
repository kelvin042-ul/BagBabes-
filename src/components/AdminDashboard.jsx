import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import ProductManager from './ProductManager'
import Analytics from '../pages/Analytics'
import '../styles/AdminDashboard.css'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { auth } from '../firebaseConfig'

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('orders')
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
    const [currentPassword, setCurrentPassword] = useState('')
    const [showPasswordChange, setShowPasswordChange] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // Fetch orders in real-time
    useEffect(() => {
        const ordersQuery = query(collection(db, 'orders'), orderBy('timestamp', 'desc'))

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                firestoreId: doc.id,
                ...doc.data()
            }))
            setOrders(ordersData)
            setLoading(false)
        }, (error) => {
            console.error('Error fetching orders:', error)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const getNextStatus = (currentStatus) => {
        const statuses = ['Pending', 'Processing', 'Shipped']
        const currentIndex = statuses.indexOf(currentStatus)
        return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null
    }

    const handleStatusUpdate = async (order, newStatus) => {
        try {
            const orderRef = doc(db, 'orders', order.firestoreId)
            await updateDoc(orderRef, { status: newStatus })
            alert(`✅ Order status updated to ${newStatus}`)

            if (newStatus === 'Shipped') {
                if (window.confirm(`Send shipping notification to ${order.fullName}?`)) {
                    const message = `📦 Your SamDeLiving order #${order.orderId?.slice(0, 8) || ''} has shipped! Total: ₦${order.total?.toFixed(2)}`
                    window.location.href = `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`
                }
            }
        } catch (error) {
            console.error('Error updating order:', error)
            alert('❌ Error: ' + error.message)
        }
    }

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Delete this order?')) {
            try {
                await deleteDoc(doc(db, 'orders', orderId))
                setShowDeleteConfirm(null)
                alert('✅ Order deleted successfully')
            } catch (error) {
                console.error('Error deleting order:', error)
                alert('❌ Error: ' + error.message)
            }
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            alert('❌ Passwords do not match')
            return
        }

        if (newPassword.length < 6) {
            alert('❌ Password must be at least 6 characters')
            return
        }

        try {
            // Re-authenticate user first
            const user = auth.currentUser
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            )

            await reauthenticateWithCredential(user, credential)

            // Now change password
            await updatePassword(user, newPassword)

            alert('✅ Password changed successfully!')
            setShowPasswordChange(false)
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                alert('❌ Current password is incorrect')
            } else if (error.code === 'auth/requires-recent-login') {
                alert('❌ Please log out and log in again, then try changing password')
            } else {
                alert('❌ Error: ' + error.message)
            }
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }

    if (loading && activeTab === 'orders') {
        return <div className="loading">Loading orders...</div>
    }

    return (
        <div className="admin-dashboard">
            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    📦 Orders
                </button>
                <button
                    className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    🛍️ Manage Products
                </button>
                <button
                    className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                >
                    📊 Sales Analytics
                </button>

            </div>

            {/* Orders Tab */}
            {activeTab === 'orders' && (
                <>
                    <div className="dashboard-header">
                        <h2>Order Management</h2>
                        <div className="header-actions">
                            <button
                                onClick={() => setShowPasswordChange(!showPasswordChange)}
                                className="change-password-btn"
                            >
                                🔑 Change Password
                            </button>
                            <p className="order-count">Total Orders: {orders.length}</p>
                        </div>
                    </div>
                    {/* Password Change Form */}
                    {showPasswordChange && (
                        <div className="password-change-modal">
                            <form onSubmit={handleChangePassword} className="password-change-form">
                                <h3>Change Your Password</h3>

                                <div className="form-group">
                                    <label>Current Password *</label>
                                    <input
                                        type="password"
                                        placeholder="Enter your current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>New Password *</label>
                                    <input
                                        type="password"
                                        placeholder="Enter new password (min 6 characters)"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirm New Password *</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="save-btn">Change Password</button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordChange(false)
                                            setCurrentPassword('')
                                            setNewPassword('')
                                            setConfirmPassword('')
                                        }}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}{orders.length === 0 ? (
                        <div className="no-orders">
                            <p>No orders yet</p>
                        </div>
                    ) : (
                        <div className="orders-table-container">
                            <table className="orders-table">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                        <th>Contact</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.firestoreId}>
                                            <td>{order.orderId?.slice(0, 8) || 'N/A'}...</td>
                                            <td>{formatDate(order.date)}</td>
                                            <td>{order.fullName || 'N/A'}</td>
                                            <td>{order.phone || 'N/A'}</td>
                                            <td>{order.items?.length || 0} items</td>
                                            <td>₦{order.total?.toFixed(2) || '0.00'}</td>
                                            <td>
                                                <span className={`status-badge status-${(order.status || 'pending').toLowerCase()}`}>
                                                    {order.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                {getNextStatus(order.status) && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order, getNextStatus(order.status))}
                                                        className="update-status-btn"
                                                    >
                                                        {getNextStatus(order.status)}
                                                    </button>
                                                )}
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => {
                                                        const message = `Hi ${order.fullName || 'Customer'}, BagShop here about your order`
                                                        window.location.href = `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`
                                                    }}
                                                    className="whatsapp-contact-btn"
                                                    title="Contact customer"
                                                >
                                                    📱
                                                </button>
                                            </td>
                                            <td>
                                                {showDeleteConfirm === order.firestoreId ? (
                                                    <div className="delete-confirm">
                                                        <span>Sure?</span>
                                                        <button onClick={() => handleDeleteOrder(order.firestoreId)} className="delete-confirm-yes">✓</button>
                                                        <button onClick={() => setShowDeleteConfirm(null)} className="delete-confirm-no">✗</button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(order.firestoreId)}
                                                        className="delete-order-btn"
                                                        title="Delete order"
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <ProductManager />
            )}
            {/* Analytics Tab */}
            {activeTab === 'analytics' && <Analytics />}
        </div>
    )
}

export default AdminDashboard