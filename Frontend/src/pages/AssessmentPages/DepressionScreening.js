import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
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
    const updated = [...answers];
    updated[currentQuestion] = value;
    setAnswers(updated);
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
    const total = answers.reduce((sum, ans) => sum + parseInt(ans, 10), 0);
    const avg = total / questions.length;

    let severity, recommendation;
    if (avg < 1) {
      severity = "Minimal depression";
      recommendation = "Your symptoms suggest minimal indication of depression. Continue monitoring your mental health.";
    } else if (avg < 2) {
      severity = "Mild depression";
      recommendation = "You're showing mild symptoms of depression. Consider talking to a mental health professional.";
    } else if (avg < 3) {
      severity = "Moderate depression";
      recommendation = "Your symptoms suggest moderate depression. It's recommended to consult with a mental health professional.";
    } else {
      severity = "Severe depression";
      recommendation = "Your symptoms indicate severe depression. Please seek professional help immediately.";
    }

    setResult({
      severity,
      score: total,
      maxScore: questions.length * 3,
      recommendation
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
      assessmentName: 'Depression Screening',
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
        <div className="assessment-header depression">
          <h2 className="assessment-title">Depression Screening</h2>
          <p className="assessment-subtitle">Answer the following questions about how you've been feeling over the past two weeks.</p>
        </div>
        <div className="assessment-content">
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">{result.severity}</div>
              <p className="result-details">
                Score: {result.score} out of {result.maxScore}
              </p>
              <div className="result-recommendation">
                <h4 className="recommendation-title">Recommendation</h4>
                <p className="recommendation-text">{result.recommendation}</p>
              </div>
              <p className="disclaimer">
                Note: This is a screening tool and not a diagnostic instrument. <br />
                If you're having thoughts of self-harm or suicide, please seek immediate help: <br />
                <strong>National Suicide Prevention Lifeline (US): 1-800-273-8255</strong><br />
                Available 24/7
              </p>
              <button className="next-button" onClick={handleSaveScore} style={{ marginTop: '1rem' }}>
                Save Score
              </button>
              {saveStatus === 'saving' && <p style={{ color: '#6366f1' }}>Saving...</p>}
              {saveStatus === 'success' && <p style={{ color: 'green' }}>Score saved successfully!</p>}
              {saveStatus === 'error' && <p style={{ color: 'red' }}>Failed to save score. Please try again.</p>}
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
