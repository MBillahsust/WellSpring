// src/pages/TechnologyUsageSurvey2.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Allcss/AssessmentPages/Assessment.css';

const lifestyleScale = {
  title: "Part 2 of 5",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Always" }
  ],
  questions: [
    "I get at least 7–8 hours of sleep on most nights. *(Reverse Scored)*",             
    "I have trouble sleeping when I use screens before bedtime.",                       
    "I engage in regular physical activity, such as exercise or sports. *(Reverse Scored)*",    
    "I believe my diet and nutrition impact my mental well-being.",                     
    "I frequently experience high levels of stress due to academic, work, or personal pressures.", 
    "I have experienced symptoms of anxiety or depression in the past year.",            
    "Social media has affected my self-esteem or body image.",                           
    "I often compare myself to others based on their social media posts.",               
    "Over the past month, I have felt emotionally stable and in good mental health. *(Reverse Scored)*", 
    "I feel that social media or digital interactions have negatively affected my real-life relationships."
  ]
};

const TechnologyUsageSurvey2 = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalQuestions = lifestyleScale.questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSelect = (questionIndex, value) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // 1) load whatever's in completeResearchResponses (includes email + Q1–Q15)
    const completeSoFar = JSON.parse(
      localStorage.getItem('techSurvey1Responses') || '{}'
    );

    // 2) map our 0→Q16 … 9→Q25
    const survey2 = {};
    Object.entries(responses).forEach(([idx, val]) => {
      const qNum = 16 + Number(idx);
      survey2[`Q${qNum}`] = Number(val);
    });

    // 3) merge back into the same object
    const updated = {
      ...completeSoFar,
      ...survey2
    };

    console.log(updated);

    // 4) write back
    localStorage.setItem(
      'techSurvey2Responses',
      JSON.stringify(updated)
    );

    // 5) go to part 3
    navigate('/TechSurvey3');
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div
          className="assessment-header adhd"
          style={{ background: 'linear-gradient(135deg,rgb(131, 39, 236),rgb(13, 125, 237))' }}
        >
          <h2 className="assessment-title">Lifestyle &amp; Psychosocial Factors</h2>
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
            <h3
              className="scale-title"
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}
            >
              {lifestyleScale.title}
              <p className="text-sm text-gray-600 mt-2 font-normal">
                Please rate how often you experience each of the following behaviors
              </p>
            </h3>

            {lifestyleScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p
                  className="question-text"
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    marginBottom: '1rem'
                  }}
                >
                  {question}
                </p>
                <div className="options-grid">
                  {lifestyleScale.options.map(option => (
                    <label
                      key={option.value}
                      className={`option-item ${
                        responses[qIdx] === option.value ? 'selected' : ''
                      }`}
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
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
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
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Review Answers
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white hover:bg-blue-700"
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

export default TechnologyUsageSurvey2;
