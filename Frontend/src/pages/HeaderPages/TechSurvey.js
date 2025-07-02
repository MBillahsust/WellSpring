// src/pages/TechnologyUsageSurvey.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Allcss/AssessmentPages/Assessment.css';

const techUsageScale = {
  title: "Part 1 of 5",
  options: [
    { value: "1", label: "Strongly Disagree" },
    { value: "2", label: "Disagree" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Agree" },
    { value: "5", label: "Strongly Agree" }
  ],
  questions: [
    "I spend several hours daily watching short-form videos on TikTok, Instagram Reels, or YouTube Shorts.",  // Q1
    "I often scroll through social media feeds longer than I originally intended.",                         // Q2
    "I feel the urge to check my social media notifications as soon as they appear.",                     // Q3
    "I frequently binge-watch content on YouTube, Netflix, or other streaming platforms.",                 // Q4
    "The autoplay feature on video platforms makes it difficult for me to stop watching.",                // Q5
    "I frequently use disappearing message apps like Snapchat, Instagram Stories, or WhatsApp.",           // Q6
    "I feel anxious when my posts do not receive likes, comments, or shares quickly.",                     // Q7
    "Social media notifications often distract me from work, studies, or real-life activities.",           // Q8
    "I often refresh my social media feeds to check for new updates.",                                     // Q9
    "I check social media as soon as I wake up in the morning.",                                          // Q10
    "I feel mentally exhausted after spending a long time on social media.",                               // Q11
    "I use social media as a way to escape from stress or negative emotions.",                             // Q12
    "I feel pressured to maintain an online presence or follow trends on social media.",                   // Q13
    "I feel the need to respond immediately to messages or comments on social media.",                     // Q14
    "After using social media, I find it difficult to focus on real-world tasks."                         // Q15
  ]
};

const TechnologyUsageSurvey = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const totalQuestions = techUsageScale.questions.length;
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSelect = (questionIndex, value) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    // Build payload: email + Q1…Q15
    const payload = {
      email: localStorage.getItem('techUsageEmail'),
      gender : localStorage.getItem('techUsageGender'),
      age : localStorage.getItem('techUsageAge'),
      ...Object.fromEntries(
        Object.entries(responses).map(
          ([idx, val]) => [`Q${Number(idx) + 1}`, Number(val)]
        )
      )
    };
    // Save for later parts

    console.log(payload);
    
    localStorage.setItem('techSurvey1Responses', JSON.stringify(payload));
    navigate('/TechSurvey2');
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">

        {/* Header */}
        <div
          className="assessment-header adhd"
          style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}
        >
          <h2 className="assessment-title">Technology Usage Factors</h2>
          <p className="assessment-subtitle">
            Question {answeredQuestions} of {totalQuestions}
          </p>
          <div className="mt-4 w-full px-4">
            <div className="w-full h-1.5 bg-gray-200/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-800 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
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
              {techUsageScale.title}
              <p className="text-sm text-gray-600 mt-2 font-normal">
                Please rate how strongly you agree with each statement
              </p>
            </h3>

            {techUsageScale.questions.map((question, qIdx) => (
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
                  {techUsageScale.options.map(option => (
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

        {/* Footer */}
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
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm"
          />
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
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Review Answers
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-white font-medium hover:bg-blue-700 transition-colors"
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

export default TechnologyUsageSurvey;
