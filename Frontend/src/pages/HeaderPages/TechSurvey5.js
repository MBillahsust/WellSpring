import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Allcss/AssessmentPages/Assessment.css';

const impulsivityScale = {
  title: "Behavioral Impulsivity Scale",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Always" }
  ],
  questions: [
    "I act on impulse without thinking things through.",
    "I make decisions quickly without considering consequences.",
    "I find it hard to resist checking my phone notifications immediately.",
    "I switch between apps/tasks frequently without completing them.",
    "I tend to interrupt others during online conversations.",
    "I make online purchases without careful consideration.",
    "I post on social media without thinking about potential impacts.",
    "I click on links or download files without verifying their safety.",
    "I share information online without fact-checking.",
    "I find it difficult to maintain focus on one digital task at a time."
  ]
};

const TechnologyUsageSurvey5 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalQuestions = impulsivityScale.questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSelect = (questionIndex, value) => {
    const updated = { ...responses };
    updated[questionIndex] = value;
    setResponses(updated);
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Store responses
    localStorage.setItem('techSurvey5Responses', JSON.stringify(responses));
    
    // Combine all responses
    const survey1Responses = JSON.parse(localStorage.getItem('techSurvey1Responses') || '{}');
    const survey2Responses = JSON.parse(localStorage.getItem('techSurvey2Responses') || '{}');
    const survey3Responses = JSON.parse(localStorage.getItem('techSurvey3Responses') || '{}');
    const survey4Responses = JSON.parse(localStorage.getItem('techSurvey4Responses') || '{}');
    
    const allResponses = {
      techUsage: survey1Responses,
      lifestyle: survey2Responses,
      attention: survey3Responses,
      cognitiveLoad: survey4Responses,
      impulsivity: responses
    };

    // Store combined responses
    localStorage.setItem('completeResearchResponses', JSON.stringify(allResponses));
    
    // Navigate to research development page after completing all surveys
    navigate('/research-development');
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
          <h2 className="assessment-title">Technology Usage Survey</h2>
          <p className="assessment-subtitle">
            Question {answeredQuestions} of {totalQuestions}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full px-4">
            <div className="w-full h-1.5 bg-gray-200/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-800 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="assessment-content">
          <div className="scale-section">
            <h3 className="scale-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>
              {impulsivityScale.title}
              <p className="text-sm text-gray-600 mt-2 font-normal">
                Please rate how often you experience each of the following behaviors
              </p>
            </h3>
            {impulsivityScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{question}</p>
                <div className="options-grid">
                  {impulsivityScale.options.map((option) => (
                    <label key={option.value} className={`option-item ${responses[qIdx] === option.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`q-${qIdx}`}
                        value={option.value}
                        checked={responses[qIdx] === option.value}
                        onChange={() => handleSelect(qIdx, option.value)}
                        className="radio-input"
                      />
                      <span className="option-label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="assessment-footer">
          <button
            onClick={handleSubmitClick}
            className="next-button"
            disabled={answeredQuestions < totalQuestions}
          >
            Submit Survey
          </button>
          {answeredQuestions < totalQuestions && (
            <p className="text-sm text-gray-500 mt-2">
              Please answer all questions to proceed
            </p>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Backdrop with better opacity */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Your Responses
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-800 font-medium mb-1">Ready to proceed?</p>
                  <p className="text-gray-600 text-sm">
                    Please ensure you have reviewed all your answers carefully before proceeding to the next survey.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Complete Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyUsageSurvey5; 