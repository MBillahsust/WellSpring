import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLaptop, FaLock, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TechUsageReduced = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isValid, setIsValid] = useState(true); // email optional

  // simple regex to match Gmail addresses
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setIsValid(val === '' || gmailRegex.test(val));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleStartSurvey = () => {
    if (!isValid || !gender || !age) return;

    // prepare values
    const emailToStore = email || 'not given';
    localStorage.setItem('techUsageEmail', emailToStore);
    localStorage.setItem('techUsageGender', gender);
    localStorage.setItem('techUsageAge', age);

    navigate('/TechSurveyReduced');
  };

  const canSubmit = isValid && gender && age;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="p-4 bg-blue-50 rounded-full">
              <FaLaptop className="text-4xl sm:text-5xl text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900">
              Digital Content & Mental Health Study
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Powered by machine learning and deep learning, we’re investigating how fast-paced digital
            content (short videos, endless feeds, notifications) and lifestyle factors (sleep, diet,
            activity) jointly influence attention, cognitive load, and impulsivity. This survey takes
            about 5–8 minutes and your responses are completely confidential.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 mb-12"
        >
          <div className="space-y-6">

            {/* Info */}
            <div className="bg-blue-50 p-4 sm:p-6 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-full">
                    <FaLock className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Confidentiality</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      There are only 34 questions. All answers are anonymous and will be used solely to train our AI models.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-full">
                    <FaChartLine className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900">Research Impact</h4>
                    <p className="text-xs sm:text-sm text-gray-600">
                      Your data trains ML/DL models that pinpoint digital practices affecting focus.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Dropdown */}
            <div className="flex justify-center">
              <select
                value={gender}
                onChange={handleGenderChange}
                className="w-full max-w-md px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Age Input */}
            <div className="flex justify-center">
              <input
                id="age"
                type="text"
                value={age}
                onChange={handleAgeChange}
                placeholder="Age"
                className="w-full max-w-md px-6 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            {/* Email Input */}
            <div className="flex justify-center">
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@gmail.com (optional)"
                className={`w-full max-w-md px-6 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition ${
                  email
                    ? isValid
                      ? 'border-green-500 focus:ring-green-300'
                      : 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-300'
                }`}
              />
            </div>
            {email && !isValid && (
              <p className="text-center text-xs text-red-600">Please enter a valid Gmail address or leave blank.</p>
            )}

            {/* Begin Survey */}
            <div className="flex justify-center">
              <button
                onClick={handleStartSurvey}
                disabled={!canSubmit}
                className={`w-full max-w-md px-6 py-3 mt-4 text-base sm:text-lg font-semibold rounded-lg transform transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  canSubmit
                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Begin Survey
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechUsageReduced;
