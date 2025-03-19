import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Brain, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <Brain className="w-8 h-8" />
          <span className="text-xl font-bold">MindCare</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/conditions" className="nav-link hover:text-[#6d8ded] transition-colors">
            Conditions
          </Link>
          <Link to="/resources" className="nav-link hover:text-[#6d8ded] transition-colors">
            Resources
          </Link>
          <Link to="/hotlines" className="nav-link hover:text-[#6d8ded] transition-colors">
            Hotlines
          </Link>
          <Link to="/about" className="nav-link hover:text-[#6d8ded] transition-colors">
            About
          </Link>
          
          {/* Desktop Profile Dropdown */}
          <div className="relative group">
            <User className="w-6 h-6 cursor-pointer hover:text-[#6d8ded] transition-colors" />
            <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <Link to="/signup" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                SignUp
              </Link>
              <Link to="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                Login
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white hover:text-[#6d8ded] transition-colors"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#09090b] border-t border-gray-800"
          >
            <div className="px-4 py-4 space-y-4">
              <Link 
                to="/conditions" 
                className="block py-2 hover:text-[#6d8ded] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Conditions
              </Link>
              <Link 
                to="/resources" 
                className="block py-2 hover:text-[#6d8ded] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link 
                to="/hotlines" 
                className="block py-2 hover:text-[#6d8ded] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hotlines
              </Link>
              <Link 
                to="/about" 
                className="block py-2 hover:text-[#6d8ded] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-2 border-t border-gray-800">
                <Link 
                  to="/signup" 
                  className="block py-2 hover:text-[#6d8ded] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SignUp
                </Link>
                <Link 
                  to="/login" 
                  className="block py-2 hover:text-[#6d8ded] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 hover:text-[#6d8ded] transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
