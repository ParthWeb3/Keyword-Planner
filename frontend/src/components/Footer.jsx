import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <a href="/privacy-policy" className="footer-link">Privacy Policy</a>
          <a href="/terms-of-service" className="footer-link">Terms of Service</a>
          <a href="/contact" className="footer-link">Contact</a>
        </div>
        <p className="footer-copyright">
          &copy; 2025 Keyword Planner. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
