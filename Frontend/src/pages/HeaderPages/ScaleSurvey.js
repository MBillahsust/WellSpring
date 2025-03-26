import React, { useState } from 'react';
import '../../Allcss/AssessmentPages/Assessment.css';


const scales = [
  {
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
      "How often do you forget a person’s name almost as soon as you’ve been told it for the first time?",
      "How often do you find yourself preoccupied with the future or the past instead of focusing on the present?",
      "How often do you find it difficult to stay focused on what’s happening in the present?",
      "How often do you start tasks but have difficulty finishing them?",
      "How often do you make careless mistakes when working on a boring or difficult project?"
    ]
  },
  {
    title: "Cognitive Load Scale",
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" }
    ],
    questions: [
      "I feel mentally exhausted after engaging in complex cognitive tasks.",
      "I struggle to concentrate for extended periods without feeling overwhelmed.",
      "I have difficulty keeping my thoughts focused when performing demanding tasks.",
      "I get mentally tired quickly when working on multiple cognitive tasks.",
      "I feel like I cannot process new information effectively when under cognitive stress.",
      "I have trouble starting mentally demanding tasks due to cognitive fatigue.",
      "My mind feels overloaded when dealing with a large amount of information at once.",
      "I experience a decline in mental clarity when I have to switch between tasks frequently.",
      "I feel drained and less motivated to engage in mentally challenging activities.",
      "When working on something mentally demanding, I can still maintain focus effectively. (Reverse scored)"
    ]
  },
  {
    title: "Behavioral Impulsivity Scale",
    options: [
      { value: "1", label: "Strongly Disagree" },
      { value: "2", label: "Disagree" },
      { value: "3", label: "Neutral" },
      { value: "4", label: "Agree" },
      { value: "5", label: "Strongly Agree" }
    ],
    questions: [
      "I often do things without thinking about the consequences.",
      "I say things without considering how they might affect others.",
      "I act on impulse, even if I know it might not be a good idea.",
      "I sometimes make purchases without planning ahead.",
      "I find it difficult to resist temptations in the moment.",
      "I get easily bored and tend to seek new experiences without much thought.",
      "I struggle to finish tasks that require long-term effort or focus.",
      "I take risks without fully thinking through the possible outcomes.",
      "I sometimes do things to make myself feel better, even if I regret them later.",
      "I usually think carefully before making a decision. (Reverse scored)"
    ]
  }
];

const ScaleSurvey = () => {
  const [responses, setResponses] = useState({});
  const [currentScaleIndex, setCurrentScaleIndex] = useState(0);

  const handleSelect = (scaleIndex, questionIndex, value) => {
    const updated = { ...responses };
    updated[`${scaleIndex}-${questionIndex}`] = value;
    setResponses(updated);
  };

  const handleNextScale = () => {
    if (currentScaleIndex < scales.length - 1) {
      setCurrentScaleIndex(currentScaleIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePreviousScale = () => {
    if (currentScaleIndex > 0) {
      setCurrentScaleIndex(currentScaleIndex - 1);
    }
  };

  const handleSubmit = () => {
    console.log("User responses:", responses);
    alert("Thank you for completing the survey! Your responses have been recorded.");
  };

  const currentScale = scales[currentScaleIndex];

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
          <h2 className="assessment-title">Mental Health Scales Survey</h2>
          <p className="assessment-subtitle">
            This survey evaluates attention, cognitive load, and impulsivity traits to support better mental health understanding.
            Please answer honestly. Your responses remain confidential.
          </p>
        </div>

        <div className="assessment-content">
          <div className="scale-section">
            <h3 className="scale-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{currentScale.title}</h3>
            {currentScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{question}</p>
                <div className="options-grid">
                  {currentScale.options.map((option) => (
                    <label key={option.value} className={`option-item ${responses[`${currentScaleIndex}-${qIdx}`] === option.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`q-${currentScaleIndex}-${qIdx}`}
                        value={option.value}
                        checked={responses[`${currentScaleIndex}-${qIdx}`] === option.value}
                        onChange={() => handleSelect(currentScaleIndex, qIdx, option.value)}
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

        <div className="assessment-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <button onClick={handlePreviousScale} className="next-button" disabled={currentScaleIndex === 0}>
            Previous Section
          </button>
          <button onClick={handleNextScale} className="next-button">
            {currentScaleIndex < scales.length - 1 ? 'Next Section' : 'Submit Survey'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScaleSurvey;
