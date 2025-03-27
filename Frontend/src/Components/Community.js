import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaRobot } from 'react-icons/fa';

export default function CommunityFeatures() {
  const navigate = useNavigate();


  
  const features = [
    {
      title: "Connect with Experts",
      description: "Engage with a vibrant community to share experiences and support each other on your mental health journey.",
      path: "/counsellors",
      icon: FaUsers,
      buttonText: "View Experts"
    },
    {
      title: "Counsellor Bot",
      description: "Chat with our counsellor bot to get immediate assistance and guidance whenever you need support.",
      path: "/counsellor-bot",
      icon: FaRobot,
      buttonText: "Chat Now"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-[#f8faff] to-white py-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-[2.5rem] font-bold text-[#1a1a1a] mb-5 relative inline-block leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join Our Community
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#00a0ff] to-[#0066ff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,157,255,0.08)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.16)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-center h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">{feature.title}</h3>
                  <p className="text-[#4a5568] leading-relaxed mb-6 flex-grow">
                    {feature.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(feature.path)}
                    className="w-fit mx-auto bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm"
                  >
                    {feature.buttonText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
