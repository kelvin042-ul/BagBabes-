// Save cart to localStorage
export const saveCart = (cart) => {
    try {
        const cartJSON = JSON.stringify(cart)
        localStorage.setItem('cart', cartJSON)
        console.log('Cart saved to localStorage:', cartJSON)
        return true
    } catch (error) {
        console.error('Error saving cart:', error)
        return false
    }
}

// Get cart from localStorage
export const getCart = () => {
    try {
        const cart = localStorage.getItem('cart')
        console.log('Raw cart from localStorage:', cart) // Debug log

        if (cart) {
            const parsedCart = JSON.parse(cart)
            console.log('Parsed cart:', parsedCart) // Debug log
            return parsedCart
        }

        console.log('No cart found, returning empty array') // Debug log
        return []
    } catch (error) {
        console.error('Error getting cart:', error)
        return []
    }
}

// Save orders to localStorage
export const saveOrders = (orders) => {
    try {
        const ordersJSON = JSON.stringify(orders)
        localStorage.setItem('orders', ordersJSON)
        console.log('Orders saved to localStorage:', orders) // Debug log
    } catch (error) {
        console.error('Error saving orders:', error)
    }
}

// Get orders from localStorage
export const getOrders = () => {
    try {
        const orders = localStorage.getItem('orders')
        console.log('Raw orders from localStorage:', orders) // Debug log

        if (orders) {
            const parsedOrders = JSON.parse(orders)
            console.log('Parsed orders:', parsedOrders) // Debug log
            return parsedOrders
        }

        console.log('No orders found, returning empty array') // Debug log
        return []
    } catch (error) {
        console.error('Error getting orders:', error)
        return []
    }
}

// Admin authentication
export const getAdminAuth = () => {
    try {
        const auth = localStorage.getItem('adminAuth')
        return auth ? JSON.parse(auth) : { isLoggedIn: false, password: 'admin123' }
    } catch (error) {
        console.error('Error getting admin auth:', error)
        return { isLoggedIn: false, password: 'admin123' }
    }
}

export const saveAdminAuth = (auth) => {
    try {
        localStorage.setItem('adminAuth', JSON.stringify(auth))
        console.log('Admin auth saved:', auth) // Debug log
    } catch (error) {
        console.error('Error saving admin auth:', error)
    }
}