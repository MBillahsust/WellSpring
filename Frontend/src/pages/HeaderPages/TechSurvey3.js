// src/pages/TechnologyUsageSurvey3.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Allcss/AssessmentPages/Assessment.css';

const attentionScale = {
  title: "Part 3 of 5",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Very Often" }
  ],
  questions: [
    "I have trouble keeping my attention on tasks that are boring or repetitive.",                       // Q26
    "I often start tasks but leave them unfinished.",                                                   // Q27
    "I find myself checking notifications or my phone even during important tasks.",                      // Q28
    "I frequently lose or misplace items needed for daily tasks (e.g., keys, phone, notes).",            // Q29
    "I get distracted easily by sounds, activity, or movement around me.",                               // Q30
    "My house or workspace contains many half-finished projects.",                                       // Q31
    "When switching between apps or tasks, I find it hard to maintain mental focus.",                    // Q32
    "I struggle to stay present and focused when using digital devices.",                                 // Q33
    "I make careless mistakes on tasks that require full attention.",                                     // Q34
    "I forget appointments or obligations even after planning for them."                                  // Q35
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
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // map our 0–9 responses to Q26–Q35
    const survey3 = {};
    Object.entries(responses).forEach(([idx, val]) => {
      const qNum = Number(idx) + 26;  // idx 0 → Q26, … idx 9 → Q35
      survey3[`Q${qNum}`] = Number(val);
    });
    // save part 3
    localStorage.setItem('techSurvey3Responses', JSON.stringify(survey3));

    // combine with parts 1 & 2
    const survey1 = JSON.parse(localStorage.getItem('techSurvey1Responses') || '{}');
    const survey2 = JSON.parse(localStorage.getItem('techSurvey2Responses') || '{}');
    const complete = {
      email: localStorage.getItem('userEmail'),
      ...survey1,
      ...survey2,
      ...survey3
    };
    localStorage.setItem('completeResearchResponses', JSON.stringify(complete));

    // next
    navigate('/TechSurvey4');
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div
          className="assessment-header adhd"
          style={{ background: 'linear-gradient(135deg,rgb(237, 7, 7),rgb(233, 14, 105))' }}
        >
          <h2 className="assessment-title">Attention and Focus Scale</h2>
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
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>
                  {question}
                </p>
                <div className="options-grid">
                  {attentionScale.options.map(option => (
                    <label
                      key={option.value}
                      className={`option-item ${responses[qIdx] === option.value ? 'selected' : ''}`}
                    >
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Confirm Your Responses
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-800 font-medium mb-1">
                    Ready to proceed?
                  </p>
                  <p className="text-gray-600 text-sm">
                    Please ensure you have reviewed all your answers before moving on.
                  </p>
                </div>
              </div>
            </div>
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
                Continue to Next Survey
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyUsageSurvey3;
