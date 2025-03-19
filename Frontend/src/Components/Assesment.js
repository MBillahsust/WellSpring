import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaHeartbeat, 
  FaBalanceScale, 
  FaUsers, 
  FaBolt,
  FaClipboardCheck,
  FaSync,
  FaShieldAlt
} from 'react-icons/fa';

export default function MentalHealthAssessments() {
  const navigate = useNavigate();

  const assessments = [
    {
      title: "Anxiety Assessment",
      description: "Take our comprehensive anxiety assessment to understand your symptoms and receive personalized recommendations.",
      path: "/anxiety-assessment",
      icon: FaHeartbeat,
      buttonText: "Start Assessment"
    },
    {
      title: "Depression Screening",
      description: "Identify the signs and symptoms of depression with our screening tool and get guidance on next steps.",
      path: "/depression-screening",
      icon: FaBrain,
      buttonText: "Start Screening"
    },
    {
      title: "Stress Evaluation",
      description: "Assess your stress levels and learn personalized strategies to manage stress more effectively and efficiently.",
      path: "/stress-evaluation",
      icon: FaBalanceScale,
      buttonText: "Start Evaluation"
    },
    {
      title: "Social Anxiety Evaluation",
      description: "Assess your social anxiety levels and uncover personalized strategies to help you navigate social interactions with greater confidence and ease.",
      path: "/social_anxiety_gauge",
      icon: FaUsers,
      buttonText: "Start Assessment"
    },
    {
      title: "Panic Monitor",
      description: "Evaluate the intensity and frequency of your panic episodes, and get personalized techniques to help you manage and reduce panic attacks effectively.",
      path: "/panic_monitor",
      icon: FaBolt,
      buttonText: "Start Evaluation"
    },
    {
      title: "ADHD Clarity Check",
      description: "Gauge your attention and focus levels with this ADHD assessment, and receive tailored strategies to improve clarity, concentration, and impulse control.",
      path: "/adhd_clarity_check",
      icon: FaClipboardCheck,
      buttonText: "Start Checking"
    },
    {
      title: "OCD Check",
      description: "Assess your behaviors and thoughts with this OCD evaluation, and get customized strategies to reduce obsessive patterns and manage compulsive actions effectively.",
      path: "/ocd_check",
      icon: FaSync,
      buttonText: "Start Checking"
    },
    {
      title: "PTSD Clarity Check",
      description: "Evaluate your stress and trauma responses with this PTSD assessment, and receive personalized strategies to manage flashbacks, anxiety, and emotional resilience.",
      path: "/ptsd_clarity_check",
      icon: FaShieldAlt,
      buttonText: "Start Checking"
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
            Mental Health Assessments
            <motion.div
              className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#00a0ff] to-[#0066ff]"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {assessments.map((assessment, index) => (
            <motion.div
              key={assessment.path}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group h-full"
            >
              <div className="h-full bg-white rounded-2xl p-8 shadow-[0_2px_12px_rgba(0,157,255,0.08)] hover:shadow-[0_4px_16px_rgba(0,157,255,0.16)] transition-all duration-300 hover:-translate-y-1">
                <div className="text-center h-full flex flex-col">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white mb-6 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <assessment.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a1a] mb-4">{assessment.title}</h3>
                  <p className="text-[#4a5568] leading-relaxed mb-6 flex-grow">
                    {assessment.description}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(assessment.path)}
                    className="w-fit mx-auto bg-gradient-to-r from-[#00a0ff] to-[#0066ff] text-white px-6 py-2.5 rounded-full hover:shadow-lg transition-all duration-300 font-medium text-sm"
                  >
                    {assessment.buttonText}
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
