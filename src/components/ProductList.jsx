import ProductCard from './ProductCard'
import '../styles/ProductList.css'

function ProductList({ products, addToCart }) {
    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                />
            ))}
        </div>
    )
}

export default ProductList