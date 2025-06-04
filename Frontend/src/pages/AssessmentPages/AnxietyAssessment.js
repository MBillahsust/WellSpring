import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "How often do you feel nervous, anxious, or on edge?",
  "How often do you not be able to stop or control worrying?",
  "How often do you worry too much about different things?",
  "How often do you have trouble relaxing?",
  "How often do you feel so restless that it's hard to sit still?",
  "How often do you become easily annoyed or irritable?",
  "How often do you feel afraid as if something awful might happen?",
  "How often do you have difficulty concentrating?",
  "How often do you have sleep problems (difficulty falling or staying asleep, or restless, unsatisfying sleep)?",
  "How often do you experience physical symptoms of anxiety (like rapid heartbeat, sweating, or shortness of breath)?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very often" }
];

export default function AnxietyAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

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

    let anxietyLevel, recommendation;
    if (score < 1) {
      anxietyLevel = "Minimal anxiety";
      recommendation = "Your anxiety levels appear to be within a normal range. Continue monitoring and maintaining healthy coping strategies.";
    } else if (score < 2) {
      anxietyLevel = "Mild anxiety";
      recommendation = "You're experiencing mild anxiety. Consider learning some basic anxiety management techniques.";
    } else if (score < 3) {
      anxietyLevel = "Moderate anxiety";
      recommendation = "Your anxiety levels are moderate. Consider consulting with a mental health professional for guidance.";
    } else {
      anxietyLevel = "Severe anxiety";
      recommendation = "Your anxiety levels are high. It's recommended to seek professional help for proper evaluation and support.";
    }

    setResult({
      severity: anxietyLevel,
      score: total,
      maxScore: questions.length * 4,
      recommendation: recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSaveScore = async () => {
    if (!userInfo || !userInfo.userId) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      userId: userInfo.userId,
      assessmentName: 'Anxiety Level Test',
      assessmentResult: result.severity,
      assessmentScore: `${result.score} out of ${result.maxScore}`,
      assessmentRecommendation: result.recommendation,
      takenAt: new Date().toISOString(),
    };
    console.log('Assessment payload:', JSON.stringify(payload, null, 2));
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/addassesment/assessments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      setSaveStatus('success');
    } catch (err) {
      setSaveStatus('error');
    }
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header anxiety">
          <h2 className="assessment-title">Anxiety Level Test</h2>
          <p className="assessment-subtitle">Answer the following questions to assess your anxiety level.</p>
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
              </p>
              <button className="next-button" onClick={handleSaveScore} style={{marginTop: '1rem'}}>
                Save Score
              </button>
              {saveStatus === 'saving' && <p style={{color: '#6366f1'}}>Saving...</p>}
              {saveStatus === 'success' && <p style={{color: 'green'}}>Score saved successfully!</p>}
              {saveStatus === 'error' && <p style={{color: 'red'}}>Failed to save score. Please try again.</p>}
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
