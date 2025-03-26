import React from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaClock, FaGlobe } from 'react-icons/fa';

const Hotlines = () => {
  const hotlines = [
    {
      title: "National Crisis Hotline",
      number: "988",
      description: "24/7, free and confidential support for people in distress",
      icon: <FaPhone className="text-4xl text-[#6d8ded]" />
    },
    {
      title: "Emergency Services",
      number: "911",
      description: "For immediate emergency assistance and crisis intervention",
      icon: <FaClock className="text-4xl text-[#6d8ded]" />
    },
    {
      title: "International Support",
      number: "1-800-273-8255",
      description: "International crisis support and suicide prevention",
      icon: <FaGlobe className="text-4xl text-[#6d8ded]" />
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
            Emergency Hotlines
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Immediate support and assistance available 24/7
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hotlines.map((hotline, index) => (
            <motion.div
              key={hotline.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="mb-6 p-4 bg-blue-50 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {hotline.icon}
                </motion.div>
                <motion.h3 
                  className="text-2xl font-semibold text-gray-900 mb-2"
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {hotline.title}
                </motion.h3>
                <motion.div 
                  className="text-3xl font-bold text-[#6d8ded] mb-4"
                  whileInView={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  {hotline.number}
                </motion.div>
                <motion.p 
                  className="text-gray-600 leading-relaxed"
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  {hotline.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotlines; 