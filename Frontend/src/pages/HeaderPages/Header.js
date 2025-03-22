import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b] text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <span className="text-xl font-bold">MindCare</span>
        </Link>

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
          
          <div className="relative" ref={dropdownRef}>
            <div 
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors duration-300 cursor-pointer"
            >
              <FaUser className="text-xl" />
            </div>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg py-2 z-50 border border-gray-800"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <Link 
                    to="/login" 
                    className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                  <div
                    onClick={handleLogout}
                    className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer"
                  >
                    Logout
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </header>
  );
}
