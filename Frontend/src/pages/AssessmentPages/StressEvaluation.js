import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "How often do you feel overwhelmed by your daily tasks?",
  "How do you cope when you feel overwhelmed?",
  "Do you find yourself having trouble sleeping due to stress?",
  "How often do you feel you lack control over your life?",
  "How do you usually respond to stressful situations?",
  "Do you often experience physical symptoms (like headaches or stomach issues) related to stress?",
  "How much time do you spend on self-care or relaxation activities?",
  "How often do you feel irritable or angry due to stress?",
  "Do you feel like you have someone to talk to about your stress?",
  "Do you find it hard to focus on tasks when feeling stressed?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very often" }
];

export default function StressEvaluation() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const questionRef = useRef(null);

  useEffect(() => {
    if (questionRef.current) {
      questionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion]);

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

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResult = () => {
    const total = answers.reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const score = total / questions.length;

    let stressLevel, recommendation;
    if (score < 1) {
      stressLevel = "Low stress level";
      recommendation = "Your stress levels appear to be well-managed. Continue maintaining healthy coping strategies.";
    } else if (score < 2) {
      stressLevel = "Mild stress level";
      recommendation = "You're experiencing mild stress. Consider incorporating more stress management techniques into your daily routine.";
    } else if (score < 3) {
      stressLevel = "Moderate stress level";
      recommendation = "Your stress levels are moderate. Consider consulting with a mental health professional for guidance on stress management.";
    } else {
      stressLevel = "High stress level";
      recommendation = "Your stress levels are high. It's recommended to seek professional help for proper support and stress management strategies.";
    }

    setResult({
      severity: stressLevel,
      score: total,
      maxScore: questions.length * 4,
      recommendation: recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSaveScore = async () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Stress Level Assessment',
      assessmentResult: result.severity,
      assessmentScore: `${result.score} out of ${result.maxScore}`,
      recommendation: result.recommendation,
      takenAt: new Date().toISOString(),
    };
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
        <div className="assessment-header stress">
          <h2 className="assessment-title">Stress Level Assessment</h2>
          <p className="assessment-subtitle">Answer the following questions to assess your stress level.</p>
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
                <p className="progress-text">{Math.round(progress)}% complete</p>
              </div>
              <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
              <div className="question fade-in" ref={questionRef}>
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
        <div className="assessment-footer flex justify-between items-center gap-4 mt-4">
          {!result && (
            <>
              <button
                onClick={handleBack}
                className={`next-button bg-gray-300 text-gray-700 hover:bg-gray-400 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={currentQuestion === 0}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="next-button hover:bg-blue-600"
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion < questions.length - 1 ? "Next Question" : "Submit"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
