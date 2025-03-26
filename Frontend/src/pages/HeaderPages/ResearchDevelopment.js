import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLaptop, FaUserFriends, FaChartLine } from 'react-icons/fa';

const ResearchDevelopment = () => {
  const researchBoxes = [
    {
      title: "Tech Usage",
      icon: <FaLaptop className="text-4xl text-[#6d8ded]" />,
      description: "Research on technology's impact on mental health and well-being",
      link: "/research/tech-usage"
    },
    {
      title: "Lifestyle & Psychosocial",
      icon: <FaUserFriends className="text-4xl text-[#6d8ded]" />,
      description: "Studies on lifestyle factors and social relationships affecting mental health",
      link: "/research/lifestyle-psychosocial"
    },
    {
      title: "Mental Health Scales",
      icon: <FaChartLine className="text-4xl text-[#6d8ded]" />,
      description: "Development and validation of mental health assessment tools",
      link: "/research/mental-health-scales"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Research & Development
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advancing mental health care through innovative research and development initiatives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {researchBoxes.map((box, index) => (
            <Link
              key={box.title}
              to={box.link}
              className="block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-6 p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors duration-300">
                    {box.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-[#6d8ded] transition-colors duration-300">
                    {box.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{box.description}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchDevelopment;
