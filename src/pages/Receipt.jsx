import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Receipt.css'

function Receipt() {
    const navigate = useNavigate()
    const [uploading, setUploading] = useState(false)
    const adminPhone = import.meta.env.VITE_ADMIN_PHONE

    const handleSendReceipt = () => {
        setUploading(true)

        // Pre-filled message for WhatsApp
        const message = `Hello! I have made payment for my order. Here is my receipt. Please confirm and process my order.`

        // Open WhatsApp in NEW TAB (no pop-up blocker)
        window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank')

        setUploading(false)

        // Optional: Show success message
        alert('✅ WhatsApp opened! Please attach your receipt photo and send.')
    }

    return (
        <div className="receipt-page">
            <div className="receipt-container">

                {/* Success Icon */}
                <div className="success-icon">✅</div>

                <h1>Payment Initiated!</h1>

                <p className="receipt-message">
                    Your order has been received. Please complete payment and send your receipt.
                </p>

                {/* Bank Details Card */}
                <div className="bank-details-card">
                    <h3>💳 Payment Details</h3>
                    <div className="bank-info">
                        <p><strong>Bank:</strong> MoniePoint</p>
                        <p><strong>Account Name:</strong> Chielo Ujunwa Priscilla</p>
                        <p><strong>Account Number:</strong> 8168282424</p>
                        <button
                            className="copy-btn"
                            onClick={() => {
                                navigator.clipboard.writeText('5003284485')
                                alert('✅ Account number copied!')
                            }}
                        >
                            📋 Copy Account Number
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="instructions">
                    <h3>📱 How to Complete Your Order:</h3>
                    <ol>
                        <li>Transfer the exact amount to the account above</li>
                        <li>Take a screenshot of your payment confirmation</li>
                        <li>Click the button below to send receipt via WhatsApp</li>
                        <li>Attach your screenshot and send the message</li>
                        <li>We'll confirm your order within 30 minutes</li>
                    </ol>
                </div>

                {/* Action Buttons */}
                <div className="receipt-actions">
                    <button
                        onClick={handleSendReceipt}
                        className="send-receipt-btn"
                        disabled={uploading}
                    >
                        {uploading ? 'Opening WhatsApp...' : '📱 Send Receipt via WhatsApp'}
                    </button>

                    <button
                        onClick={() => navigate('/shop')}
                        className="back-to-shop-btn"
                    >
                        🛍️ Continue Shopping
                    </button>
                </div>

                {/* Order ID Reference */}
                <p className="order-reference">
                    Have questions? Contact us on WhatsApp: {adminPhone}
                </p>
            </div>
        </div>
    )
}

export default Receipt