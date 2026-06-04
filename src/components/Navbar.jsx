import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Navbar.css'

function Navbar({ cartCount, onSearch }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const { isAdmin, currentUser, logout } = useAuth()
    const location = useLocation()

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        if (onSearch) {
            onSearch(value)
        }
    }

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen)
        if (isSearchOpen) {
            setSearchTerm('')
            if (onSearch) {
                onSearch('')
            }
        }
    }

    const handleLogout = async () => {
        await logout()
        setIsMenuOpen(false)
    }

    useEffect(() => {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
        setSearchTerm('')
        if (onSearch) {
            onSearch('')
        }
    }, [location.pathname])

    // ONLY show search on Home page (path === '/')
    const showSearch = location.pathname === '/'
    const isShopPage = location.pathname === '/shop'

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Left - Logo */}
                <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
                    <img src="/images/Babes.jpg" alt="BagBabesLuxury" className="nav-logo-img" />
                    <span className="nav-logo-text">BagBabesLuxury</span>
                </Link>

                {/* Center - Desktop Navigation */}
                <div className="nav-menu">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/shop" className="nav-link">Shop</Link>
                    <Link to="/cart" className="nav-link cart-link">
                        Cart ({cartCount})
                    </Link>
                    {isAdmin && (
                        <Link to="/admin/dashboard" className="nav-link admin-link">
                            Admin
                        </Link>
                    )}
                    {currentUser && (
                        <button onClick={handleLogout} className="nav-link">Logout</button>
                    )}
                </div>

                {/* Right - Desktop Search + Cart + Hamburger */}
                <div className="nav-actions">
                    {/* Desktop Search Bar - ONLY on Home page */}
                    {showSearch && (
                        <div className="desktop-search-container">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="desktop-search-input"
                            />
                        </div>
                    )}

                    {/* Mobile Search Icon - ONLY on Home page */}
                    {showSearch && (
                        <button
                            className={`mobile-search-toggle ${isSearchOpen ? 'active' : ''}`}
                            onClick={toggleSearch}
                            aria-label="Search"
                        >
                            🔍
                        </button>
                    )}

                    <Link to="/cart" className="cart-icon-link">
                        🛒
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </Link>

                    <button
                        className={`hamburger ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                {/* Mobile Search Bar - ONLY on Home page */}
                {showSearch && isSearchOpen && (
                    <div className="mobile-search-bar">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mobile-search-input"
                            autoFocus
                        />
                        <button className="search-close" onClick={toggleSearch}>✕</button>
                    </div>
                )}

                {/* Mobile Menu Overlay */}
                <div className={`nav-menu-overlay ${isMenuOpen ? 'active' : ''}`}>
                    <button className="mobile-menu-close" onClick={() => setIsMenuOpen(false)}>✕</button>
                    <div className="mobile-menu">
                        <Link to="/" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link to="/shop" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Shop
                        </Link>
                        <Link to="/cart" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                            Cart ({cartCount})
                        </Link>
                        {isAdmin && (
                            <Link to="/admin/dashboard" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                                Admin Dashboard
                            </Link>
                        )}
                        {currentUser && (
                            <button onClick={handleLogout} className="mobile-nav-link">Logout</button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar