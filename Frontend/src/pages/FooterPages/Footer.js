import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between">
        {/* Brand */}
        <div className="mb-4 sm:mb-0">
          <h3 className="text-3xl font-bold">WellSpring</h3>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-8">
          <Link to="/privacy" className="text-base text-gray-300 hover:text-white font-medium transition-colors">Privacy</Link>
          <Link to="/terms" className="text-base text-gray-300 hover:text-white font-medium transition-colors">Terms</Link>
          <Link to="/contact" className="text-base text-gray-300 hover:text-white font-medium transition-colors">Contact</Link>
        </nav>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-6" />

      {/* Copyright */}
      <div className="mt-6 text-center text-sm text-gray-400">
        © 2025 WellSpring. All rights reserved.
      </div>
    </footer>
  );
}
