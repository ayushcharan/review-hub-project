import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section brand-section">
                    <h2 className="footer-brand">Review-Hub</h2>
                    <p className="footer-description">
                        Discover and review the latest tech products with ease. 
                        Your trusted source for honest feedback and top-rated gadgets.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-link" title="Twitter">𝕏</a>
                        <a href="#" className="social-link" title="Instagram">📸</a>
                        <a href="#" className="social-link" title="Website">🌐</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Products</Link></li>
                        <li><Link to="/dashboard">My Dashboard</Link></li>
                        <li><Link to="/notifications">Notifications</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                        <li><a href="#">Terms of Use</a></li>
                        <li><a href="#">Contact Support</a></li>
                    </ul>
                </div>

                <div className="footer-section newsletter">
                    <h3>Join Our Newsletter</h3>
                    <p>Get the latest updates on new products and top-rated reviews.</p>
                    <div className="newsletter-form">
                        <input type="email" placeholder="Enter your email" className="newsletter-input" />
                        <button className="btn btn-primary newsletter-btn">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Review-Hub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
