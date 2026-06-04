import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import ProductList from '../components/ProductList'
import '../styles/ProductDetail.css'

function ProductDetail({ addToCart }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, 'products', id)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    const productData = { id: docSnap.id, ...docSnap.data() }
                    setProduct(productData)
                    await fetchRelatedProducts(productData.category, productData.id)
                } else {
                    navigate('/shop')
                }
            } catch (error) {
                console.error('Error fetching product:', error)
                navigate('/shop')
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [id, navigate])

    const fetchRelatedProducts = async (category, currentId) => {
        try {
            const q = query(collection(db, 'products'), where('category', '==', category))
            const snapshot = await getDocs(q)
            const productsData = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(p => p.id !== currentId)
                .slice(0, 4)
            setRelatedProducts(productsData)
        } catch (error) {
            console.error('Error fetching related products:', error)
        }
    }

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product)
        }
    }

    if (loading) return <div className="loading">Loading product...</div>
    if (!product) return <div className="loading">Product not found</div>

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Product Image */}
                <div className="product-detail-image">
                    <img src={product.image} alt={product.name} />
                </div>

                {/* Product Info */}
                <div className="product-detail-info">
                    <h1 className="product-detail-name">{product.name}</h1>
                    <p className="product-detail-price">₦{product.price?.toLocaleString()}</p>
                    <p className="product-detail-description">{product.description}</p>

                    {/* Quantity Selector */}
                    <div className="product-detail-quantity">
                        <label>Quantity:</label>
                        <div className="quantity-selector">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button className="product-detail-add-btn" onClick={handleAddToCart}>
                        Add to Cart 🛒
                    </button>

                    {/* Category Badge */}
                    <div className="product-detail-category">
                        Category: <span>{product.category}</span>
                    </div>
                </div>
            </div>

            {/* You May Also Like Section */}
            {relatedProducts.length > 0 && (
                <div className="related-products">
                    <h2 className="related-title">You May Also Like</h2>
                    <ProductList products={relatedProducts} addToCart={addToCart} />
                </div>
            )}
        </div>
    )
}

export default ProductDetail