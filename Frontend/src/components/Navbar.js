import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBrain, 
  FaGamepad, 
  FaChartLine, 
  FaCalendarAlt, 
  FaUser,
  FaBell
} from 'react-icons/fa';

import { FaUsers } from 'react-icons/fa'; // Add this


const Navbar = () => {
  const location = useLocation();
  const [notifications] = useState([
    { id: 1, text: 'New assessment available: Stress Check', isNew: true },
    { id: 2, text: 'Reminder: Complete your daily mood tracking', isNew: true },
    { id: 3, text: 'Your weekly wellness report is ready', isNew: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/dashboard', icon: FaUser, label: 'Dashboard' },
    { path: '/ai-counselor', icon: FaBrain, label: 'AI Counselor' },
    { path: '/games', icon: FaGamepad, label: 'Wellness Games' },
    { path: '/progress', icon: FaChartLine, label: 'Progress' },
    { path: '/routine', icon: FaCalendarAlt, label: 'My Routine' },
    { path: '/community', icon: FaUsers, label: 'Community' },

  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">WellSpring</span>
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out flex items-center space-x-2
                  ${isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                  }`}
              >
                <item.icon className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side - User & Notifications */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <FaBell className="text-gray-600 w-5 h-5" />
                {notifications.some(n => n.isNew) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 border-b border-gray-200">
                    Notifications
                  </h3>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0">
                          {notification.isNew && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{notification.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <Link
              to="/profile"
              className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUser className="text-blue-600 w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 rounded-md text-xs
                ${isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              <item.icon className={`w-5 h-5 mb-1 ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 