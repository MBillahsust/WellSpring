// src/pages/TechnologyUsageSurvey5.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Allcss/AssessmentPages/Assessment.css';

const impulsivityScale = {
  title: "Part 5 of 5",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Very Often" }
  ],
  questions: [
    "I do things without thinking.",
    "I act on the spur of the moment.",
    "I buy things impulsively, even when I don’t need them.",
    "I say things without thinking.",
    "I get easily bored when I am working on thought problems or repetitive tasks.",
    "In the last month, I felt nervous and stressed.",
    "In the last month, I felt that I was unable to control important things in my life.",
    "I am more interested in the present than the future.",
    "In the last month, I felt difficulties were piling up so high that I couldn’t overcome them.",
    "I usually think carefully before making decisions. (Reversed scored)"
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
    setResponses(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    // build part 5 numbered Q46–Q55
    const part5 = Object.fromEntries(
      Object.entries(responses).map(
        ([idx, val]) => [`Q${46 + Number(idx)}`, Number(val)]
      )
    );
    // retrieve prior parts
    const survey1 = JSON.parse(localStorage.getItem('techSurvey1Responses') || '{}');
    const survey2 = JSON.parse(localStorage.getItem('techSurvey2Responses') || '{}');
    const survey3 = JSON.parse(localStorage.getItem('techSurvey3Responses') || '{}');
    const survey4 = JSON.parse(localStorage.getItem('techSurvey4Responses') || '{}');

    // assemble full payload
    const payload = {
      email: localStorage.getItem('userEmail'),
      ...survey1,
      ...survey2,
      ...survey3,
      ...survey4,
      ...part5
    };

    try {
      await axios.post('http://localhost:5004/research/research', payload);
      // on success, navigate to research-development
      navigate('/research-development');
    } catch (err) {
      console.error("Failed submitting survey:", err);
      // you can add a toast or alert here if desired
    }
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div
          className="assessment-header adhd"
          style={{ background: 'linear-gradient(135deg,rgb(130,80,0),rgb(169,64,15))' }}
        >
          <h2 className="assessment-title">Behavioral Impulsivity Scale</h2>
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
              style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}
            >
              {impulsivityScale.title}
              <p className="text-sm text-gray-600 mt-2 font-normal">
                Please rate how often you experience each of the following behaviors
              </p>
            </h3>
            {impulsivityScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p
                  className="question-text"
                  style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}
                >
                  {question}
                </p>
                <div className="options-grid">
                  {impulsivityScale.options.map(option => (
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
                  <p className="text-gray-800 font-medium mb-1">Ready to submit?</p>
                  <p className="text-gray-600 text-sm">
                    Please ensure you have reviewed all your answers before submitting.
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
