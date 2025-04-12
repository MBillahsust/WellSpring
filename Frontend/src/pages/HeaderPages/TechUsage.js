import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptop, FaLock, FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TechUsage = () => {
  const navigate = useNavigate();

  const handleStartSurvey = () => {
    navigate('/TechSurvey');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
            <div className="p-4 sm:p-5 bg-blue-50 rounded-full mb-4 sm:mb-0 sm:mr-6">
              <FaLaptop className="text-4xl sm:text-5xl text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900">
              Technology Usage Research
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Thank you for your interest in our survey on mental health and technology use.
            This survey contains a total of 55 questions and will take about 10–15 minutes to complete.
            Your responses will help us better understand how technology can support mental health.

            We really appreciate your participation!


          </p>
        </motion.div>

        {/* Survey Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-6 sm:p-12 mb-12"
        >
          <div className="space-y-6 sm:space-y-8 text-gray-700">
            {/* Survey Info Card */}
            <div className="bg-blue-50 p-6 sm:p-8 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-white rounded-full">
                    <FaLock className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Data Privacy</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      All responses are confidential and used exclusively for research purposes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-white rounded-full">
                    <FaChartLine className="text-xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Research Impact</h4>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Your participation helps develop better digital wellbeing strategies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Take Survey Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleStartSurvey}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Take Survey
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TechUsage;
