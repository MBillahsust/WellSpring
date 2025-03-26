import React, { useState } from 'react';
import '../../Allcss/AssessmentPages/Assessment.css';
const techScale = {
  title: "Technology Usage Survey",
  options: [
    { value: "1", label: "Strongly Disagree" },
    { value: "2", label: "Disagree" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Agree" },
    { value: "5", label: "Strongly Agree" }
  ],
  questions: [
    "I spend several hours daily watching short-form videos on TikTok, Instagram Reels, or YouTube Shorts.",
    "I often scroll through social media feeds longer than I originally intended.",
    "I feel the urge to check my social media notifications as soon as they appear.",
    "I frequently binge-watch content on YouTube, Netflix, or other streaming platforms.",
    "The autoplay feature on video platforms makes it difficult for me to stop watching.",
    "I frequently use disappearing message apps like Snapchat, Instagram Stories, or WhatsApp.",
    "I feel anxious when my posts do not receive likes, comments, or shares quickly.",
    "Social media notifications often distract me from work, studies, or real-life activities.",
    "I often refresh my social media feeds to check for new updates.",
    "I check social media as soon as I wake up in the morning.",
    "I feel mentally exhausted after spending a long time on social media.",
    "I use social media as a way to escape from stress or negative emotions.",
    "I feel pressured to maintain an online presence or follow trends on social media.",
    "I feel the need to respond immediately to messages or comments on social media.",
    "After using social media, I find it difficult to focus on real-world tasks."
  ]
};

const TechnologyUsageSurvey = () => {
  const [responses, setResponses] = useState({});

  const handleSelect = (questionIndex, value) => {
    const updated = { ...responses };
    updated[questionIndex] = value;
    setResponses(updated);
  };

  const handleSubmit = () => {
    console.log("Technology usage responses:", responses);
    alert("Thanks for completing the Technology Usage Survey!");
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
          <h2 className="assessment-title">Technology Usage Survey</h2>
          <p className="assessment-subtitle">
            This survey explores your digital consumption patterns and technology engagement. Your honest feedback is appreciated.
          </p>
        </div>

        <div className="assessment-content">
          <div className="scale-section">
            <h3 className="scale-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>{techScale.title}</h3>
            {techScale.questions.map((question, qIdx) => (
              <div key={qIdx} className="question-block" style={{ marginBottom: '2rem' }}>
                <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '1rem' }}>{question}</p>
                <div className="options-grid">
                  {techScale.options.map((option) => (
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

export default TechnologyUsageSurvey;
