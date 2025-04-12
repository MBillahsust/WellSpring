import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Allcss/AssessmentPages/Assessment.css';

const attentionScale = {
  title: "Attention and Focus Scale",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Very Often" }
  ],
  questions: [
    "How often do you have difficulty keeping your attention when doing boring or repetitive work?",
    "How often do you get distracted by activity or noise around you?",
    "How often do you have problems remembering appointments or obligations?",
    "How often do you misplace or have difficulty finding things at home or at work?",
    "How often do you rush through activities without being fully attentive to them?",
    "How often do you forget a person's name almost as soon as you've been told it for the first time?",
    "How often do you find yourself preoccupied with the future or the past instead of focusing on the present?",
    "How often do you find it difficult to stay focused on what's happening in the present?",
    "How often do you start tasks but have difficulty finishing them?",
    "How often do you make careless mistakes when working on a boring or difficult project?"
  ]
};

const TechnologyUsageSurvey3 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const totalQuestions = attentionScale.questions.length;
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
    localStorage.setItem('techSurvey3Responses', JSON.stringify(responses));
    
    // Combine all responses
    const survey1Responses = JSON.parse(localStorage.getItem('techSurvey1Responses') || '{}');
    const survey2Responses = JSON.parse(localStorage.getItem('techSurvey2Responses') || '{}');
    
    const allResponses = {
      techUsage: survey1Responses,
      lifestyle: survey2Responses,
      attention: responses
    };

    // Store combined responses
    localStorage.setItem('completeResearchResponses', JSON.stringify(allResponses));
    
    // Navigate to TechSurvey4
    navigate('/TechSurvey4');
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
              {attentionScale.title}
              <p className="text-sm text-gray-600 mt-2 font-normal">
                Please rate how often you experience each of the following situations
              </p>
            </h3>
            {attentionScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{question}</p>
                <div className="options-grid">
                  {attentionScale.options.map((option) => (
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
            Next Survey
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Submission
            </h3>
            <p className="text-gray-600 mb-6">
              Please review your answers before proceeding to the next survey. Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Review Answers
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyUsageSurvey3; 