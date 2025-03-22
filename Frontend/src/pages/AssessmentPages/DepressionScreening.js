import React, { useState } from 'react';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "How would you describe your mood over the past two weeks?",
  "Have you noticed any changes in your sleep patterns?",
  "How has your energy level been lately?",
  "Have you experienced any changes in your appetite or eating habits?",
  "How do you feel about yourself and your life in general?",
  "Have you had any difficulty concentrating or making decisions?",
  "Have you noticed any changes in your physical activity or the way you move?",
  "Have you had any thoughts about death or hurting yourself?",
  "How has your interest in activities or hobbies changed recently?",
  "Have you experienced any changes in your relationships or social interactions?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

export default function DepressionScreening() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const score = total / questions.length;

    let depressionLevel, recommendation;
    if (score < 1) {
      depressionLevel = "Minimal depression";
      recommendation = "Your symptoms suggest minimal indication of depression. Continue monitoring your mental health.";
    } else if (score < 2) {
      depressionLevel = "Mild depression";
      recommendation = "You're showing mild symptoms of depression. Consider talking to a mental health professional.";
    } else if (score < 3) {
      depressionLevel = "Moderate depression";
      recommendation = "Your symptoms suggest moderate depression. It's recommended to consult with a mental health professional.";
    } else {
      depressionLevel = "Severe depression";
      recommendation = "Your symptoms indicate severe depression. Please seek professional help immediately.";
    }

    setResult({
      severity: depressionLevel,
      score: total,
      maxScore: questions.length * 3,
      recommendation: recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header depression">
          <h2 className="assessment-title">Depression Screening</h2>
          <p className="assessment-subtitle">Answer the following questions about how you've been feeling over the past two weeks.</p>
        </div>
        <div className="assessment-content">
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">
                {result.severity}
              </div>
              <p className="result-details">
                Score: {result.score} out of {result.maxScore}
              </p>
              <div className="result-recommendation">
                <h4 className="recommendation-title">Recommendation</h4>
                <p className="recommendation-text">{result.recommendation}</p>
              </div>
              <p className="disclaimer">
                Note: This is a screening tool and not a diagnostic instrument. 
                If you're having thoughts of self-harm or suicide, please seek immediate help:
                National Suicide Prevention Lifeline (US): 1-800-273-8255
                Available 24/7
              </p>
            </div>
          ) : (
            <>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
              <div className="question">
                {questions[currentQuestion]}
              </div>
              <div className="options-grid">
                {answerOptions.map((option) => (
                  <div 
                    key={option.value} 
                    className={`option-item ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      id={`q-${option.value}`}
                      checked={answers[currentQuestion] === option.value}
                      onChange={() => handleAnswer(option.value)}
                      className="radio-input"
                    />
                    <label htmlFor={`q-${option.value}`} className="option-label">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="assessment-footer">
          {!result && (
            <button
              onClick={handleNext}
              className="next-button"
              disabled={answers[currentQuestion] === undefined}
            >
              {currentQuestion < questions.length - 1 ? "Next Question" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
