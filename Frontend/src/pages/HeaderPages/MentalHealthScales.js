import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaClipboardCheck, FaChartBar, FaBrain } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MentalHealthScales = () => {
  const navigate = useNavigate();

  const handleJoinSurvey = () => {
    navigate('/ScaleSurvey');
  };

  const researchSections = [
    {
      title: "Anxiety Scale Development",
      icon: <FaClipboardCheck className="text-3xl text-[#6d8ded]" />,
      description: "Creation and validation of anxiety assessment tools",
      findings: [
        "New anxiety scale shows 95% accuracy",
        "Digital assessment tools prove effective",
        "Real-time monitoring improves treatment outcomes",
        "Early detection reduces severity",
        "Combined approach increases accuracy"
      ],
      recommendations: [
        "Regular anxiety screening",
        "Use validated assessment tools",
        "Track symptoms over time",
        "Combine multiple assessment methods",
        "Seek professional evaluation"
      ]
    },
    {
      title: "Depression Screening Tools",
      icon: <FaChartBar className="text-3xl text-[#6d8ded]" />,
      description: "Development of depression screening instruments",
      findings: [
        "Early detection improves treatment success",
        "Digital screening tools increase accessibility",
        "Combined assessment approach enhances accuracy",
        "Regular screening prevents escalation",
        "Personalized assessment improves outcomes"
      ],
      recommendations: [
        "Regular depression screening",
        "Use comprehensive assessment tools",
        "Monitor mood patterns",
        "Track treatment progress",
        "Maintain assessment records"
      ]
    },
    {
      title: "Cognitive Assessment Tools",
      icon: <FaBrain className="text-3xl text-[#6d8ded]" />,
      description: "Development of cognitive function assessment tools",
      findings: [
        "Digital cognitive tests show high reliability",
        "Regular assessment tracks progress",
        "Combined metrics improve accuracy",
        "Early detection of cognitive changes",
        "Personalized assessment approaches"
      ],
      recommendations: [
        "Regular cognitive screening",
        "Use validated assessment tools",
        "Track cognitive changes",
        "Combine multiple assessment methods",
        "Maintain assessment records"
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
              <FaChartLine className="text-4xl text-[#6d8ded]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Mental Health Assessment Tools
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Development and validation of comprehensive mental health assessment tools 
            for accurate diagnosis and treatment monitoring.
          </p>
          <button
            onClick={handleJoinSurvey}
            className="mt-4 bg-[#6d8ded] text-white px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-[#5b7cc8] transition"
          >
            Join Mental Health Survey
          </button>
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

export default MentalHealthScales;
