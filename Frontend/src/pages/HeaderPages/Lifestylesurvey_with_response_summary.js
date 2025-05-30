import React, { useState } from 'react';
import './Assessment.css';

const lifestyleScale = {
  title: "Lifestyle & Psychosocial Survey",
  options: [
    { value: "1", label: "Never" },
    { value: "2", label: "Rarely" },
    { value: "3", label: "Sometimes" },
    { value: "4", label: "Often" },
    { value: "5", label: "Always" }
  ],
  questions: [
    "I get at least 7-8 hours of sleep on most nights.",
    "I have trouble sleeping when I use screens before bedtime.",
    "I engage in regular physical activity, such as exercise or sports.",
    "I believe my diet and nutrition impact my mental well-being.",
    "I frequently experience high levels of stress due to academic, work, or personal pressures.",
    "I have experienced symptoms of anxiety or depression in the past year.",
    "Social media has affected my self-esteem or body image.",
    "I often compare myself to others based on their social media posts.",
    "Over the past month, I have felt emotionally stable and in good mental health.",
    "I feel that social media or digital interactions have negatively affected my real-life relationships."
  ]
};

const LifestyleSurvey = () => {
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionIndex, value) => {
    const updated = { ...responses };
    updated[questionIndex] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateTotalScore = () => {
    return Object.values(responses).reduce((sum, val) => sum + parseInt(val), 0);
  };

  const getOptionLabel = (value) => {
    const opt = lifestyleScale.options.find((o) => o.value === value);
    return opt ? opt.label : '-';
  };

  if (submitted) {
    return (
      <div className="assessment-container">
        <div className="assessment-card">
          <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
            <h2 className="assessment-title">Survey Summary</h2>
            <p className="assessment-subtitle">
              Here's a summary of your responses to the Lifestyle & Psychosocial Survey.
            </p>
          </div>
          <div className="assessment-content">
            <div className="result-container">
              <div className="result-title">Total Score</div>
              <div className="result-score">{calculateTotalScore()} / {lifestyleScale.questions.length * 5}</div>
            </div>
            <div className="mt-6 space-y-4">
              {lifestyleScale.questions.map((q, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-lg p-4">
                  <p className="font-medium text-gray-800">{idx + 1}. {q}</p>
                  <p className="text-sm text-gray-600 mt-1">Your answer: <span className="font-semibold">{getOptionLabel(responses[idx])}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
          <h2 className="assessment-title">Lifestyle & Psychosocial Survey</h2>
          <p className="assessment-subtitle">
            This survey helps assess lifestyle habits and psychosocial factors that may influence mental well-being. Please respond honestly.
          </p>
        </div>

        <div className="assessment-content">
          <div className="scale-section">
            <h3 className="scale-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{lifestyleScale.title}</h3>
            {lifestyleScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{question}</p>
                <div className="options-grid">
                  {lifestyleScale.options.map((option) => (
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
          <button onClick={handleSubmit} className="next-button">
            Submit Survey
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSurvey;
