import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { UserContext } from '../../UserContext';
import { Disclosure, Menu, MenuButton, MenuItem, MenuItems, DisclosureButton, DisclosurePanel } from '@headlessui/react';

import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

import { FaTachometerAlt } from 'react-icons/fa'; // Import the dashboard icon

import { FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Import login and signup icons


const navigation = [
  { name: 'AI Counsellor', href: '/ai-counselor' },
  { name: 'Assessments', href: '/assessment' },
  { name: 'Learn Conditions', href: '/conditions' },
  { name: 'Resources', href: '/resources' },
  { name: 'Research & Development', href: '/research-development' },
  { name: 'Games', href: '/games' },
  // { name: 'About', href: '/about' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

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
    <Disclosure as="nav" className="bg-[#09090b] text-white">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block h-6 w-6" />
              <XMarkIcon aria-hidden="true" className="hidden h-6 w-6" />
            </DisclosureButton>
          </div>

          {/* Logo and Desktop Navigation */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
                  <Link to="/" className="text-xl font-bold">
                       WellSpring
                  </Link>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      'text-sm font-medium rounded-md px-3 py-2 hover:bg-[#6d8ded] transition-colors',
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right-side icons */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Notification Icon */}
            <button
              type="button"
              className="relative rounded-full bg-[#1a1a1a] p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#09090b]">
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="flex rounded-full bg-[#1a1a1a] text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#09090b]">
                  <span className="sr-only">Open user menu</span>
                  {user ? (
                    <FaUserCircle className="h-8 w-8 rounded-full text-white" />
                  ) : (
                    <FaUser className="h-8 w-8 rounded-full text-white" />
                  )}
                </MenuButton>
              </div>
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-[#1a1a1a] shadow-lg py-1 ring-1 ring-black/5">
                {user ? (
                  <>
                    <MenuItem>
                      <Link to="/dashboard" className="block px-4 py-2 text-white">
                        Dashboard
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-white">
                        Profilel
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <div onClick={handleLogout} className="block px-4 py-2 text-white cursor-pointer">
                        Logout
                      </div>
                    </MenuItem>
                  </>
                ) : (
                  <>

                      <MenuItem>
                        <Link to="/dashboard" className="block px-4 py-2 text-white">
                          <FaTachometerAlt className="inline mr-2" /> Dashboard
                        </Link>
                      </MenuItem>
                   
                      <MenuItem>
                        <Link to="/login" className="block px-4 py-2 text-white">
                          <FaSignInAlt className="inline mr-2" /> Login
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link to="/signup" className="block px-4 py-2 text-white">
                          <FaUserPlus className="inline mr-2" /> Sign Up
                        </Link>
                      </MenuItem>
                  </>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              className={classNames(
                'block rounded-md px-3 py-2 text-base font-medium',
                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}