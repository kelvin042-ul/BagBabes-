// Complete WhatsApp Service for BagShop

class WhatsAppService {
    constructor(adminPhone) {
        this.adminPhone = adminPhone
    }

    // Format phone number properly
    formatPhoneNumber(phone) {
        let cleaned = phone.replace(/[^0-9+]/g, '')
        if (!cleaned.startsWith('+')) {
            cleaned = '+' + cleaned
        }
        return cleaned
    }

    // Send message to admin (when order is placed)
    sendToAdmin(message) {
        try {
            const formattedNumber = this.formatPhoneNumber(this.adminPhone)
            const encodedMessage = encodeURIComponent(message)
            const url = `https://wa.me/${formattedNumber}?text=${encodedMessage}`
            window.open(url, '_blank')
            return true
        } catch (error) {
            console.error('Failed to open WhatsApp for admin:', error)
            return false
        }
    }

    // Send message to customer (when order is shipped)
    sendToCustomer(phoneNumber, message) {
        try {
            const formattedNumber = this.formatPhoneNumber(phoneNumber)
            const encodedMessage = encodeURIComponent(message)
            const url = `https://wa.me/${formattedNumber}?text=${encodedMessage}`
            window.open(url, '_blank')
            return true
        } catch (error) {
            console.error('Failed to open WhatsApp for customer:', error)
            return false
        }
    }

    // Simple order message for ADMIN (when order is placed)
    formatAdminOrderMessage(order, customer) {
        const itemsList = order.items.map(item =>
            `• ${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')

        return `🛍️ *NEW ORDER - SAMDELIVING*
    
        *Customer:* ${customer.fullName}
        *Phone:* ${customer.phone}
        *Email:* ${customer.email}
        *Address:* ${customer.address}

        *Items Ordered:*
        ${itemsList}

        *Total:* ₦${order.total.toFixed(2)}

        *Order ID:* ${order.id.slice(0, 8)}

        Please process this order.`
    }

    // Shipping confirmation message for CUSTOMER (when order is shipped)
    formatCustomerShippedMessage(order, customer) {
        const itemsList = order.items.map(item =>
            `• ${item.name} x${item.quantity}`
        ).join('\n')

        return `📦 *YOUR ORDER HAS SHIPPED!*
    
        Hi ${customer.fullName},

        Great news! Your order has been shipped and is on its way.

        *Order ID:* ${order.id.slice(0, 8)}
        *Items:*
        ${itemsList}

        *Delivery Address:*
        ${customer.address}

        *Estimated Delivery:* 3-7 business days

        Thank you for shopping with us! 🎒`
    }
}

// Create instance with your admin phone from .env
const whatsappService = new WhatsAppService(import.meta.env.VITE_ADMIN_PHONE)
export default whatsappService