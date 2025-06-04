import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.name || !formData.email || !formData.password || !formData.age || !formData.weight) {
      setError('All fields are required');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/SignUp`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: Number(formData.age),
        weight: parseFloat(formData.weight)
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Wellspring</h1>
          <p className="text-gray-600 text-lg">Begin your journey to better mental health today</p>
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
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join our community of support</p>
            </div>

            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

            <div className="space-y-4">
              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Full Name"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Email"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Password"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="confirmPassword"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Confirm Password"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="age"
                  onChange={handleChange}
                  value={formData.age}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Age"
                  required
                />
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} className="group">
                <input
                  name="weight"
                  onChange={handleChange}
                  value={formData.weight}
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                  placeholder="Weight (kg)"
                  required
                />
              </motion.div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
              <Link 
                to="/login" 
                className="text-sky-600 hover:text-sky-700 font-medium transition-colors duration-200"
              >
                Already have an account?
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}