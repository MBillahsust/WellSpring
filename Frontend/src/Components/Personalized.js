import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BigCard({ onGetStartedClick }) {
  return (
    <section className="bg-gradient-to-b from-white via-[#f8faff] to-[#f0f7ff] py-28">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1 
            className="text-[2.75rem] font-bold text-[#1a1a1a] mb-5 relative inline-block leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Personalized Mental Health Support
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#00a0ff] to-[#0066ff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h1>
          <motion.p 
            className="text-[1.125rem] text-[#4a5568] max-w-[800px] mx-auto leading-[1.8] mb-12 font-normal"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Wellspring is an AI-powered platform that supports your mental wellness by helping you track your routine, mood, and activities and by offering insights through psychological assessments based on standardized medical tools. While it provides initial guidance for self-aware individuals, it isn’t a doctor and doesn’t replace professional advice—it’s always best to consult a qualified psychologist or physician without hesitation.


          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link 
                to="/signup" 
                className="group w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white text-[1rem] font-semibold tracking-wide rounded-full shadow-[0_2px_12px_rgba(0,157,255,0.25)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.35)] transition-all duration-300"
                onClick={onGetStartedClick}
              >
                Get Started
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2 group-hover:translate-x-0.5 transition-transform"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link 
                to="/about" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-white text-[#0066ff] text-[1rem] font-semibold tracking-wide rounded-full shadow-[0_2px_12px_rgba(0,157,255,0.12)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.2)] border border-[#e6f0ff] hover:bg-[#f8faff] transition-all duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
