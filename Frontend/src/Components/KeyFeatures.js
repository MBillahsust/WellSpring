import React from 'react';
import { Link } from 'react-router-dom';
import { FaSmile, FaRunning } from 'react-icons/fa';
import { RiGameLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

export default function KeyFeatures() {
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
            className="text-[3rem] font-bold text-[#1a1a1a] mb-5 relative inline-block leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Key Features
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#00a0ff] to-[#0066ff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group"
          >
            <Link
              to="/mood-tracking"
              className="block bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,157,255,0.08)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.16)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <FaSmile className="w-8 h-8" />
                </div>
                <h3 className="text-[1.5rem] font-semibold text-[#1a1a1a] mb-4">Mood Tracking</h3>
                <p className="text-[1.125rem] text-[#4a5568] leading-relaxed">
                  Monitor your emotional state over time and identify patterns to better understand your mental health.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group"
          >
            <Link
              to="/activity-logging"
              className="block bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,157,255,0.08)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.16)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <FaRunning className="w-8 h-8" />
                </div>
                <h3 className="text-[1.5rem] font-semibold text-[#1a1a1a] mb-4">Activity Logging</h3>
                <p className="text-[1.125rem] text-[#4a5568] leading-relaxed">
                  Track your daily activities, sleep, and exercise to understand how they impact your well-being.
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group"
          >
            <Link
              to="/games"
              className="block bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,157,255,0.08)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.16)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <RiGameLine className="w-8 h-8" />
                </div>
                <h3 className="text-[1.5rem] font-semibold text-[#1a1a1a] mb-4">Mental Health Games</h3>
                <p className="text-[1.125rem] text-[#4a5568] leading-relaxed">
                  Boost your brain and mood through play. Gameplay data enables personalized support.
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
