import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import TopBanner from './components/TopBanner'
import Navbar from './components/Navbar'
import ProductDetail from './pages/ProductDetail'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import Login from './components/Login'
import Notification from './components/Notification'
import Receipt from './pages/Receipt'
import { getCart, saveCart } from './utils/storage'

function App() {
  const [cart, setCart] = useState([])
  const [notification, setNotification] = useState({ show: false, message: '', type: '' })
  const [globalSearchTerm, setGlobalSearchTerm] = useState('')
  // Load cart from localStorage when app starts
  useEffect(() => {
    const savedCart = getCart()
    console.log('Loading saved cart:', savedCart)
    setCart(savedCart)
  }, [])

  // Save cart whenever it changes
  useEffect(() => {
    console.log('saving cart:', cart)
    saveCart(cart)
  }, [cart])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
    showNotification('Product added to cart!', 'success')
  }

  const updateCartItem = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
    showNotification('Item removed from cart', 'info')
  }

  const clearCart = () => {
    setCart([])
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' })
    }, 3000)
  }

  // Handle search from Navbar
  const handleSearch = (searchTerm) => {
    setGlobalSearchTerm(searchTerm)
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <TopBanner />
          <Navbar cartCount={cartCount} onSearch={handleSearch} />
          <main className="main-content">
            <Routes>
              <Route path="/receipt" element={<Receipt />} />
              <Route path="/" element={<Home addToCart={addToCart} searchTerm={globalSearchTerm} />} />
              <Route path="/shop" element={<Shop addToCart={addToCart} cartCount={cartCount} />} />
              <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
              <Route path="/cart" element={
                <Cart
                  cart={cart}
                  updateCartItem={updateCartItem}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                  showNotification={showNotification}
                />
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/bagshop/admin-login" element={<Login />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
            </Routes>
          </main>
          {notification.show && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App