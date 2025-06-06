import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "How afraid are you to speak in public?",
  "How afraid are you to meet new people?",
  "How afraid are you to talk to people in positions of authority?",
  "How afraid are you to be the focus of attention in a social situation?",
  "How afraid are you to attend social gatherings or parties?",
  "How afraid are you to eat in front of others?",
  "How afraid are you to use public transport?",
  "How afraid are you to go to a restaurant?",
  "How afraid are you to engage in conversation with acquaintances?",
  "How afraid are you to be watched while performing a task?",
  "How afraid are you to make phone calls to people you do not know well?",
  "How afraid are you to attend social events?",
  "How often do you avoid speaking in public?",
  "How often do you avoid meeting new people?",
  "How often do you avoid talking to people in authority?",
  "How often do you avoid situations where you might be the center of attention?",
  "How often do you avoid attending parties?",
  "How often do you avoid eating in public?",
  "How often do you avoid using public transport?",
  "How often do you avoid going to restaurants?",
  "How often do you avoid talking to acquaintances?",
  "How often do you avoid situations where you might be observed while performing a task?",
  "How often do you avoid making phone calls to people you do not know well?",
  "How often do you avoid attending social events?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Mildly" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Severely" }
];

export default function Social_Anxiety() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
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
    const fearScore = answers.slice(0, 12).reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const avoidanceScore = answers.slice(12).reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const totalScore = fearScore + avoidanceScore;

    let severity, recommendation;
    if (totalScore <= 30) {
      severity = "Mild social anxiety";
      recommendation = "Your symptoms suggest mild social anxiety. Consider learning some basic anxiety management techniques.";
    } else if (totalScore <= 60) {
      severity = "Moderate social anxiety";
      recommendation = "Your symptoms suggest moderate social anxiety. Consider consulting with a mental health professional for guidance.";
    } else {
      severity = "Severe social anxiety";
      recommendation = "Your symptoms indicate severe social anxiety. It's recommended to seek professional help for proper evaluation and support.";
    }

    setResult({
      severity,
      totalScore,
      fearScore,
      avoidanceScore,
      maxScore: questions.length * 3,
      recommendation
    });
  };

  const handleSaveScore = async () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Social Anxiety Assessment',
      assessmentResult: result.severity,
      assessmentScore: `Total: ${result.totalScore} / ${result.maxScore} | Fear: ${result.fearScore} / 36 | Avoidance: ${result.avoidanceScore} / 36`,
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isInFearSection = currentQuestion < 12;

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header social-anxiety">
          <h2 className="assessment-title">Social Anxiety Assessment</h2>
          <p className="assessment-subtitle">
            {isInFearSection 
              ? "Rate your level of fear in these situations"
              : "Rate how often you avoid these situations"}
          </p>
        </div>
        <div className="assessment-content">
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">
                {result.severity}
              </div>
              <p className="result-details">
                Total Score: {result.totalScore} out of {result.maxScore}
              </p>
              <div className="result-details">
                <p>Fear Score: {result.fearScore} / 36</p>
                <p>Avoidance Score: {result.avoidanceScore} / 36</p>
              </div>
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
