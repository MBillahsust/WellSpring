import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { jwtDecode } from 'jwt-decode';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserInfo } = useContext(UserContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/Login`, {
        email,
        password
      });
      setSuccess('Login successful! Redirecting...');
      window.alert('Login successful!');
      console.log('Login token:', res.data.token);
      const decoded = jwtDecode(res.data.token);
      console.log('Decoded userId:', decoded.userId);
      setUserInfo({ token: res.data.token, email, userId: decoded.userId });
      const redirectTo = location.state?.from || '/';
      setTimeout(() => navigate(redirectTo), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      window.alert('Login failed!');
      console.log('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-sky-50 to-white">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-1 items-center justify-center p-8"
      >
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Wellspring</h1>
          <p className="text-gray-600 text-lg">Your journey to better mental health starts here</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex items-center justify-center p-4 sm:p-8 min-h-screen md:min-h-0"
      >
        <div className="w-full max-w-md">
          <motion.form 
            onSubmit={onSubmitHandler}
            className="bg-white p-6 sm:p-8 rounded-lg shadow-lg"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to continue your journey</p>
            </div>

            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Email"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Password"
                  required
                />
              </motion.div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link 
                to="/forgot-password" 
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
              >
                Forgot Password?
              </Link>
              <Link 
                to="/signup" 
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
              >
                Create Account
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 px-4 rounded-lg hover:from-sky-600 hover:to-sky-700 transition-all duration-200 font-medium shadow-md relative"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
