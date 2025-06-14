import React from 'react';
import '../../Allcss/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">WellSpring</div>
        <nav className="footer-nav">
          <a href="/privacy" className="footer-link">Privacy</a>
          <a href="/terms" className="footer-link">Terms</a>
          <a href="/contact" className="footer-link">Contact</a>
        </nav>
        <div className="footer-copyright">
          © 2025 WellSpring. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
