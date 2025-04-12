import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { UserContext } from '../../UserContext';

export default function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#09090b] text-white py-4">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Left side */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold">WellSpring</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center justify-center space-x-6">
            <Link to="/assessment" className="nav-link hover:text-[#6d8ded] transition-colors text-sm">
              Assessment
            </Link>
            <Link to="/conditions" className="nav-link hover:text-[#6d8ded] transition-colors text-sm">
              Conditions
            </Link>
            <Link to="/resources" className="nav-link hover:text-[#6d8ded] transition-colors text-sm">
              Resources
            </Link>
            <Link to="/research-development" className="nav-link hover:text-[#6d8ded] transition-colors text-sm">
              Research
            </Link>
            <Link to="/about" className="nav-link hover:text-[#6d8ded] transition-colors text-sm">
              About
            </Link>
          </nav>

          {/* User Profile & Mobile Menu - Right side */}
          <div className="flex items-center ml-auto">
            {/* Desktop User Profile */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <div
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors duration-300 cursor-pointer"
              >
                {user ? <FaUserCircle className="text-lg" /> : <FaUser className="text-lg" />}
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
                    {user ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200"
                        >
                          Profile
                        </Link>
                        <div
                          onClick={handleLogout}
                          className="block px-4 py-2 text-white hover:bg-[#2a2a2a] transition-colors duration-200 cursor-pointer"
                        >
                          Logout
                        </div>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="flex md:hidden items-center justify-center w-12 h-12 text-white hover:text-[#6d8ded] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 bg-[#09090b] border-t border-gray-800 md:hidden"
            >
              <div className="px-6 py-4 space-y-4">
                <Link
                  to="/assessment"
                  className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Assessment
                </Link>
                <Link
                  to="/conditions"
                  className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Conditions
                </Link>
                <Link
                  to="/resources"
                  className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Resources
                </Link>
                <Link
                  to="/research-development"
                  className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Research
                </Link>
                <Link
                  to="/about"
                  className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <div
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block text-white hover:text-[#6d8ded] transition-colors py-2 cursor-pointer"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block text-white hover:text-[#6d8ded] transition-colors py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
