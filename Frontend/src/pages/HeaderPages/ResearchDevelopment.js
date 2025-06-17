// src/components/ResearchDevelopment.js
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLaptop, FaUserFriends, FaChartLine } from 'react-icons/fa';

const ResearchDevelopment = () => {
  const researchBoxes = [
    {
      title: "Tech Usage Factors Analysis",
      icon: <FaLaptop className="text-3xl sm:text-4xl text-[#6d8ded]" />,
      description:
        "Using machine learning and deep learning, this study analyzes how fast-paced digital content consumption and lifestyle factors jointly influence attention, cognitive load, and impulsivity.",
      link: "/research/tech-usage",
    },
    {
      title: "Lifestyle & Psychosocial",
      icon: <FaUserFriends className="text-3xl sm:text-4xl text-[#6d8ded]" />,
      description:
        "Studies on lifestyle factors and social relationships affecting mental health.",
      link: "/research/lifestyle-psychosocial",
    },
    {
      title: "Mental Health Scales",
      icon: <FaChartLine className="text-3xl sm:text-4xl text-[#6d8ded]" />,
      description: "Development and validation of mental health assessment tools.",
      link: "/research/mental-health-scales",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Research & Development
          </h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Advancing mental health care through innovative research and development initiatives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {researchBoxes.map((box, idx) => (
            <Link
              key={box.title}
              to={box.link}
              className="h-full block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="h-full flex flex-col bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
              >
                <div className="flex-shrink-0 flex flex-col items-center text-center">
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    {box.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4 group-hover:text-[#6d8ded] transition-colors duration-300">
                    {box.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow">
                  {box.description}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchDevelopment;
