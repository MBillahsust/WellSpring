import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaBrain, 
  FaHeartbeat, 
  FaBolt, 
  FaSync, 
  FaShieldAlt, 
  FaUtensils, 
  FaUserFriends,
  FaBalanceScale
} from 'react-icons/fa';
import '../../Allcss/HeaderPages/Conditions.css';

export default function Conditions() {
  const conditions = [
    {
      name: 'Anxiety',
      summary: 'A feeling of worry, nervousness, or unease that can affect daily life.',
      link: '/conditions/anxiety',
      icon: FaHeartbeat,
      color: '#4f46e5'
    },
    {
      name: 'Depression',
      summary: 'A mood disorder causing persistent feelings of sadness and loss of interest.',
      link: '/conditions/depression',
      icon: FaBrain,
      color: '#6366f1'
    },
    {
      name: 'Bipolar Disorder',
      summary: 'A disorder associated with episodes of mood swings from high to low.',
      link: '/conditions/bipolar-disorder',
      icon: FaBolt,
      color: '#8b5cf6'
    },
    {
      name: 'Obsessive-Compulsive Disorder (OCD)',
      summary: 'A disorder characterized by unwanted, recurring thoughts and behaviors.',
      link: '/conditions/ocd',
      icon: FaSync,
      color: '#ec4899'
    },
    {
      name: 'Post-Traumatic Stress Disorder (PTSD)',
      summary: 'A disorder triggered by experiencing or witnessing a traumatic event.',
      link: '/conditions/ptsd',
      icon: FaShieldAlt,
      color: '#8b5cf6'
    },
    {
      name: 'Eating Disorders',
      summary: 'Disorders characterized by abnormal eating habits and body image concerns.',
      link: '/conditions/eating-disorders',
      icon: FaUtensils,
      color: '#f472b6'
    },
    {
      name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
      summary: 'A chronic condition including attention difficulty, hyperactivity, and impulsiveness.',
      link: '/conditions/adhd',
      icon: FaUserFriends,
      color: '#10b981'
    },
    {
      name: 'Schizophrenia',
      summary: 'A disorder affecting a person\'s ability to think, feel, and behave clearly.',
      link: '/conditions/schizophrenia',
      icon: FaBalanceScale,
      color: '#3b82f6'
    },
  ];

  return (
    <motion.div 
      className="conditions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Mental Health Conditions
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Learn more about different mental health conditions, their symptoms, causes, and treatments. 
        Each condition is unique and may require different approaches to treatment and support.
      </motion.p>

      <motion.div 
        className="conditions-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {conditions.map((condition, index) => (
          <motion.div 
            key={condition.name} 
            className="condition-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="condition-icon"
              style={{ color: condition.color }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <condition.icon size={32} />
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {condition.name}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {condition.summary}
            </motion.p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={condition.link} className="learn-more-link">
                Learn More
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
