import React from 'react';
import { motion } from 'framer-motion';
import { FaLaptop, FaMobile, FaDesktop, FaTabletAlt } from 'react-icons/fa';

const TechUsage = () => {
  const researchSections = [
    {
      title: "Digital Wellbeing Assessment",
      icon: <FaDesktop className="text-3xl text-[#6d8ded]" />,
      description: "Comprehensive evaluation of technology's impact on mental health",
      findings: [
        "Increased screen time correlates with higher stress levels",
        "Social media usage affects sleep patterns",
        "Digital detox programs show positive mental health outcomes",
        "Screen time before bed disrupts sleep quality",
        "Digital mindfulness practices improve focus"
      ],
      recommendations: [
        "Implement regular digital breaks",
        "Use blue light filters in the evening",
        "Practice mindful technology use",
        "Set screen time limits",
        "Create tech-free zones"
      ]
    },
    {
      title: "Screen Time Analysis",
      icon: <FaMobile className="text-3xl text-[#6d8ded]" />,
      description: "Study of screen time patterns and mental health outcomes",
      findings: [
        "Excessive screen time linked to anxiety and depression",
        "Blue light exposure affects sleep quality",
        "Digital breaks improve focus and productivity",
        "Social media scrolling increases stress",
        "Device notifications impact concentration"
      ],
      recommendations: [
        "Track daily screen time",
        "Schedule offline activities",
        "Use app timers and limits",
        "Practice digital mindfulness",
        "Create balanced tech habits"
      ]
    },
    {
      title: "Social Media Impact",
      icon: <FaTabletAlt className="text-3xl text-[#6d8ded]" />,
      description: "Research on social media's influence on mental health",
      findings: [
        "Social comparison affects self-esteem",
        "FOMO leads to anxiety",
        "Online interactions impact real relationships",
        "Social media addiction patterns",
        "Digital well-being interventions"
      ],
      recommendations: [
        "Curate positive social feeds",
        "Limit social media usage",
        "Practice digital boundaries",
        "Engage in offline activities",
        "Build healthy online habits"
      ]
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
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-blue-50 rounded-full mr-4">
              <FaLaptop className="text-4xl text-[#6d8ded]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Technology Usage Research
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive research on how technology affects mental health and well-being, 
            including screen time analysis, digital wellbeing assessment, and social media impact studies.
          </p>
        </motion.div>

        <div className="space-y-12">
          {researchSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-50 rounded-full mr-4">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{section.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h3>
                  <ul className="space-y-3">
                    {section.findings.map((finding, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start text-gray-700"
                      >
                        <span className="text-[#6d8ded] mr-3 mt-1">•</span>
                        <span className="leading-relaxed">{finding}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                  <ul className="space-y-3">
                    {section.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start text-gray-700"
                      >
                        <span className="text-[#6d8ded] mr-3 mt-1">•</span>
                        <span className="leading-relaxed">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechUsage; 