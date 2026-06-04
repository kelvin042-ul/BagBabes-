import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import '../styles/FloatingCartButton.css'

function FloatingCartButton({ cartCount }) {
    const [animate, setAnimate] = useState(false)

    // Animate when cart count changes
    useEffect(() => {
        if (cartCount > 0) {
            setAnimate(true)
            const timer = setTimeout(() => setAnimate(false), 300)
            return () => clearTimeout(timer)
        }
    }, [cartCount])

    // Don't show if cart is empty (optional - remove if you want it always visible)
    // if (cartCount === 0) return null

    return (
        <Link to="/cart" className={`floating-cart-btn ${animate ? 'pop' : ''}`}>
            <span className="cart-icon">🛒</span>
            <span className="cart-text">Cart</span>
        </Link>
    )
}

export default FloatingCartButton