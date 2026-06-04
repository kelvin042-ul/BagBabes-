import '../styles/CartItem.css'

function CartItem({ item, updateQuantity, removeFromCart }) {
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <p className="cart-item-price">₦{item.price.toFixed(2)} each</p>

                <div className="cart-item-actions">
                    <div className="quantity-control">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="quantity-btn"
                        >
                            -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="quantity-btn"
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="remove-btn"
                    >
                        Remove
                    </button>
                </div>
            </div>
            <div className="cart-item-total">
                ₦{(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    )
}

export default CartItem