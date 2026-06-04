import '../styles/Footer.css'
import { Link } from 'react-router-dom'


function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-logo">BagBabesLuxury</h3>
                    <p className="footer-description">
                        Premium quality bags for every occasion. Stylish, durable, and affordable.
                    </p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/cart">Cart</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Categories</h4>
                    <ul className="footer-links">
                        <li><a href="#">Clutch Bags</a></li>
                        <li><a href="#">Channel Bags</a></li>
                        <li><a href="#">Tote Bags</a></li>
                        <li><a href="#">Luxury Bags</a></li>
                        <li><a href="#">Hand Bags</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Contact Info</h4>
                    <ul className="footer-contact">
                        <li>📍 3 & 4 Kuddy Plaza New Mandilas, Trade Fair, Lagos, Nigeria</li>
                        <li>
                            <a href="https://wa.me/2348012345678" target="_blank" rel="noopener noreferrer">
                                📞 +2348168282424, +2349138016038, +2349039854438
                            </a>
                        </li>
                        <li>🟢 Active Always</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2026 BagBabesLuxury LTD. All rights reserved. | Designed with ❤️ for Bag lovers</p>
            </div>
        </footer>
    )
}

export default Footer