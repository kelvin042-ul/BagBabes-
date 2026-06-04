import { useState } from 'react'
import '../styles/CheckoutForm.css'

function CheckoutForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    })
    const [errors, setErrors] = useState({})
    const [showPayment, setShowPayment] = useState(false)

    const validate = () => {
        const newErrors = {}
        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        else {
            const cleaned = formData.phone.replace(/[^0-9+]/g, '')
            if (cleaned.length < 10) newErrors.phone = 'Phone number must be at least 10 digits'
        }
        if (!formData.address.trim()) newErrors.address = 'Shipping Address is required'
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length === 0) {
            setShowPayment(true)
        } else {
            setErrors(newErrors)
        }
    }

    const handleConfirmOrder = () => {
        if (typeof onSubmit === 'function') {
            onSubmit(formData)
        } else {
            console.error('onSubmit is not a function')
            alert('Error: Checkout function not available')
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    if (showPayment) {
        return (
            <div className="payment-instructions">
                <h3>📱 Payment Instructions</h3>
                <div className="bank-details">
                    <p><strong>Bank:</strong> MoniePoint</p>
                    <p><strong>Account Name:</strong> Chielo Ujunwa Priscilla</p>
                    <p>
                        <strong>Account Number:</strong>
                        <span id="accountNumber">8168282424</span>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText('5003284485')
                                alert('✅ Account number copied!')
                            }}
                            className="copy-btn"
                        >
                            📋 Copy
                        </button>
                    </p>
                </div>
                <div className="payment-steps">
                    <h4>How to complete your order:</h4>
                    <ol>
                        <li>Transfer the exact amount to the bank account above</li>
                        <li>Keep your transaction reference number</li>
                        <li>Click "Complete Order on WhatsApp" below</li>
                        <li>Admin will verify and process your order within 24 hours</li>
                    </ol>
                </div>
                <div className="payment-actions">
                    <button onClick={handleConfirmOrder} className="confirm-btn">
                        📱 Complete Order on WhatsApp
                    </button>
                    <button onClick={() => setShowPayment(false)} className="back-btn">
                        ← Back to Edit
                    </button>
                </div>
                <p className="payment-note">
                    <small>Note: Admin will contact you via WhatsApp once payment is confirmed.</small>
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="checkout-form">
            <h3>📦 Shipping Information</h3>
            <div className="form-group">
                <label>Full Name *</label>
                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>
            <div className="form-group">
                <label>Email Address *</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
                <label>Phone Number *</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+2341234567890"
                    className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
                <small className="hint">Include country code (e.g., +234 for Nigeria)</small>
            </div>
            <div className="form-group">
                <label>Delivery Address *</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street address, City, ZIP Code"
                    className={errors.address ? 'error' : ''}
                    rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="form-actions">
                <button type="submit" className="submit-btn">
                    Continue to Payment
                </button>
                <button type="button" onClick={onCancel} className="cancel-btn">
                    Cancel
                </button>
            </div>
        </form>
    )
}

export default CheckoutForm