import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/TopBanner.css'

function TopBanner() {
    const [isVisible, setIsVisible] = useState(true)
    const location = useLocation()

    // Only show on home page
    const isHomePage = location.pathname === '/'

    // Auto-hide after 5 seconds (optional)
    useEffect(() => {
        if (isHomePage && isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 10000)
            return () => clearTimeout(timer)
        }
    }, [isHomePage, isVisible])

    // Don't show if not home page
    if (!isHomePage) return null
    if (!isVisible) return null

    return (
        <div className="top-banner">
            <div className="top-banner-content">
                <span>🎒</span>
                <p>Welcome to BagBabesLuxury Store - Premium Bags for Every Occasion</p>
                <button onClick={() => setIsVisible(false)}>✕</button>
            </div>
        </div>
    )
}

export default TopBanner