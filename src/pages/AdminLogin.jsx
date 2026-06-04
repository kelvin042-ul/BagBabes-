import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'
import '../styles/AdminLogin.css'

function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate('/admin/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            if (error.code === 'auth/user-not-found') {
                setError('No admin account found with this email')
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password')
            } else {
                setError('Login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-icon">🔐</div>
                <h2>Admin Portal</h2>
                <p className="admin-login-subtitle">Enter your credentials to access dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@yourstore.com"
                            required
                        />
                    </div>

                    <div className="admin-form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && <div className="admin-error-message">{error}</div>}

                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        {loading ? 'Logging in...' : 'Access Dashboard'}
                    </button>

                    <p className="admin-login-note">🔒 For authorized admins only</p>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin