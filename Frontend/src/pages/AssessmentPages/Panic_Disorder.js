import React, { useState } from 'react';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "How often do you experience sudden panic attacks or episodes of intense fear?",
  "How much do you worry about having another panic attack?",
  "Have you changed your behavior or daily routine to avoid panic attacks?",
  "How often do you experience rapid heartbeat or heart palpitations during panic episodes?",
  "How often do you experience shortness of breath or difficulty breathing during panic episodes?",
  "How often do you experience trembling or shaking during panic episodes?",
  "How often do you experience sweating during panic episodes?",
  "How often do you feel like you're choking during panic episodes?",
  "How often do you experience chest pain or discomfort during panic episodes?",
  "How often do you feel dizzy, unsteady, or lightheaded during panic episodes?",
  "How often do you experience feelings of unreality or being detached from yourself during panic episodes?",
  "How often do you fear losing control or going crazy during panic episodes?",
  "How often do you experience numbness or tingling sensations during panic episodes?",
  "How often do you experience chills or hot flushes during panic episodes?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

export default function Panic_Disorder() {
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

    let severity, recommendation;
    if (score < 1) {
      severity = "Minimal panic symptoms";
      recommendation = "Your symptoms suggest minimal indication of panic disorder. Continue monitoring your mental health.";
    } else if (score < 2) {
      severity = "Mild panic symptoms";
      recommendation = "You're showing mild symptoms of panic disorder. Consider discussing these symptoms with a mental health professional.";
    } else if (score < 3) {
      severity = "Moderate panic symptoms";
      recommendation = "Your symptoms suggest moderate panic disorder. It's recommended to consult with a mental health professional for further evaluation.";
    } else {
      severity = "Severe panic symptoms";
      recommendation = "Your symptoms indicate severe panic disorder. Please seek professional help for proper evaluation and support.";
    }

    setResult({
      severity,
      score: total,
      maxScore: questions.length * 3,
      recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header panic">
          <h2 className="assessment-title">Panic Disorder Assessment</h2>
          <p className="assessment-subtitle">Rate how often you experience these symptoms during panic episodes.</p>
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
                Please consult with a mental health professional for a proper evaluation.
                If you're experiencing a panic attack, try deep breathing exercises and seek immediate help if needed.
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
