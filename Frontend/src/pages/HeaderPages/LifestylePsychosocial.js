import React from 'react';
import { motion } from 'framer-motion';
import { FaUserFriends, FaBed, FaRunning, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LifestylePsychosocial = () => {
  const navigate = useNavigate();

  const handleJoinSurvey = () => {
    navigate('/LifestyleSurvey');
  };

  const researchSections = [
    {
      title: "Sleep Patterns Study",
      icon: <FaBed className="text-3xl text-[#6d8ded]" />,
      description: "Analysis of sleep quality and mental health correlation",
      findings: [
        "Irregular sleep patterns increase stress levels",
        "Quality sleep improves emotional regulation",
        "Sleep hygiene practices enhance mental wellbeing",
        "Sleep deprivation affects cognitive function",
        "Consistent sleep schedule reduces anxiety"
      ],
      recommendations: [
        "Maintain regular sleep schedule",
        "Create calming bedtime routine",
        "Limit caffeine and screen time",
        "Optimize sleep environment",
        "Practice relaxation techniques"
      ]
    },
    {
      title: "Social Connection Research",
      icon: <FaUsers className="text-3xl text-[#6d8ded]" />,
      description: "Impact of social relationships on mental health",
      findings: [
        "Strong social support reduces anxiety",
        "Quality relationships improve resilience",
        "Social isolation increases depression risk",
        "Meaningful connections boost self-esteem",
        "Community engagement enhances wellbeing"
      ],
      recommendations: [
        "Nurture existing relationships",
        "Join social groups or clubs",
        "Practice active listening",
        "Set healthy boundaries",
        "Seek professional support"
      ]
    },
    {
      title: "Physical Activity Impact",
      icon: <FaRunning className="text-3xl text-[#6d8ded]" />,
      description: "Research on exercise and mental health benefits",
      findings: [
        "Regular exercise reduces stress",
        "Physical activity improves mood",
        "Exercise enhances sleep quality",
        "Movement boosts cognitive function",
        "Active lifestyle prevents depression"
      ],
      recommendations: [
        "Engage in regular exercise",
        "Find enjoyable activities",
        "Set realistic fitness goals",
        "Stay consistent with routine",
        "Combine cardio and strength training"
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
              <FaUserFriends className="text-4xl text-[#6d8ded]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Lifestyle & Psychosocial Research
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Comprehensive studies on how lifestyle factors and social relationships 
            influence mental health and overall well-being.
          </p>
          <button
            onClick={handleJoinSurvey}
            className="mt-4 bg-[#6d8ded] text-white px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-[#5b7cc8] transition"
          >
            Join Lifestyle & Psychosocial Survey
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

export default LifestylePsychosocial;
