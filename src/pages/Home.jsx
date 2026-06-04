import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import FloatingCartButton from '../components/FloatingCartButton'
import '../styles/Home.css'

function Home({ addToCart, cartCount, searchTerm }) {
    const [allProducts, setAllProducts] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [filteredBestSellers, setFilteredBestSellers] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
                const querySnapshot = await getDocs(q)
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isNew: doc.data().isNew || false,
                    isBestSeller: doc.data().isBestSeller || false,
                    outOfStock: doc.data().outOfStock || false
                }))
                setAllProducts(productsData)

                // Filter Best Sellers (products marked as isBestSeller && not out of stock)
                const bestSellerProducts = productsData.filter(p => p.isBestSeller === true && p.outOfStock !== true)
                setBestSellers(bestSellerProducts)
                setFilteredBestSellers(bestSellerProducts)
                setFilteredProducts(productsData.slice(0, 10))
            } catch (error) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    // Filter products when search term changes
    useEffect(() => {
        if (!searchTerm.trim()) {
            // No search term - show default (first 10 products)
            setFilteredProducts(allProducts.slice(0, 10))
            setFilteredBestSellers(bestSellers)
            return
        }

        // Filter ALL products by name or description
        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        setFilteredProducts(filtered)

        // Also filter Best Sellers by search term
        const filteredBest = bestSellers.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        setFilteredBestSellers(filteredBest)
    }, [searchTerm, allProducts, bestSellers])

    return (
        <div className="home-page">
            <Hero />

            {/* BEST SELLERS SECTION - Only shows if there are best sellers AND no active search */}
            {filteredBestSellers.length > 0 && !searchTerm.trim() && (
                <section className="best-sellers-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>⭐ Best Sellers</h2>
                            <p>Our most popular picks loved by customers</p>
                        </div>
                        <div className="products-grid">
                            {filteredBestSellers.slice(0, 20).map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    addToCart={addToCart}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* OUR PRODUCTS SECTION */}
            <section className="home-products">
                <div className="container">
                    <div className="section-header">
                        <h2>{searchTerm ? `Search Results` : `Our Products`}</h2>
                        <p>{searchTerm ? `Found ${filteredProducts.length} products for "${searchTerm}"` : `Premium quality bags crafted for you`}</p>
                    </div>

                    {loading ? (
                        <div className="products-loading">
                            <div className="loader"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="no-products">
                            <p>No products found matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {filteredProducts.slice(0, searchTerm ? undefined : 10).map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        addToCart={addToCart}
                                    />
                                ))}
                            </div>

                            {!searchTerm && filteredProducts.length >= 10 && (
                                <div className="view-all-container">
                                    <a href="/shop" className="view-all-btn">
                                        View All Products →
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            <Footer />
            <FloatingCartButton cartCount={cartCount} />
        </div>
    )
}

export default Home