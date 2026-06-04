import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/ProductCard.css'

function ProductCard({ product, addToCart }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const navigate = useNavigate()

    const handleImageClick = () => {
        navigate(`/product/${product.id}`)
    }

    const isNewProduct = () => {
        if (!product.isNew) return false
        if (!product.createdAt) return false
        const daysOld = (new Date() - new Date(product.createdAt)) / (1000 * 60 * 60 * 24)
        return daysOld <= 7
    }

    return (
        <div className="product-card">
            <div className="product-image-container" onClick={handleImageClick}>
                <div className="view-details-icon">
                    👁️ View details
                </div>
                {isNewProduct() && <div className="new-badge">NEW</div>}
                {!imageLoaded && <div className="image-loader"></div>}
                <img
                    src={product.image}
                    alt={product.name}
                    className={`product-image ${imageLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description || 'Premium quality bag'}</p>

                <div className="product-footer">
                    <span className="product-price">₦{product.price.toLocaleString()}</span>
                    <button
                        className="add-to-cart-icon"
                        onClick={() => addToCart(product)}
                        aria-label="Add to cart"
                    >
                        🛒
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard