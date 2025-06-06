import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "In the past month, how often have you had distressing memories, thoughts, or images of the traumatic event?",
  "In the past month, how often have you avoided thoughts or feelings related to the traumatic event?",
  "In the past month, how often have you had negative thoughts about yourself or others?",
  "In the past month, how often have you felt irritable or angry?",
  "In the past month, how often have you had trouble falling or staying asleep?",
  "In the past month, how often have you been easily startled or frightened?",
  "In the past month, how often have you had trouble remembering important parts of the traumatic event?",
  "In the past month, how often have you felt emotionally numb or detached from others?",
  "In the past month, how often have you lost interest in activities you used to enjoy?",
  "In the past month, how often have you felt guilty or ashamed about the traumatic event?",
  "In the past month, how often have you felt distant or cut off from others?",
  "In the past month, how often have you had difficulty concentrating?",
  "In the past month, how often have you engaged in self-destructive behavior?",
  "In the past month, how often have you felt overwhelmed by your emotions?",
  "In the past month, how often have you had physical reactions when reminded of the traumatic event?",
  "In the past month, how often have you avoided activities, places, or people that remind you of the traumatic event?",
  "In the past month, how often have you felt detached or estranged from others?",
  "In the past month, how often have you had difficulty experiencing positive emotions?",
  "In the past month, how often have you felt that your future will somehow be cut short?",
  "In the past month, how often have you had intrusive thoughts about the traumatic event?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little bit" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Quite a bit" },
  { value: "4", label: "Extremely" }
];

export default function PTSD_Assessment() {
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
    const total = answers.reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const score = total / questions.length;

    let severity, recommendation;
    if (score < 1) {
      severity = "Minimal PTSD symptoms";
      recommendation = "Your symptoms suggest minimal indication of PTSD. Continue monitoring your mental health.";
    } else if (score < 2) {
      severity = "Mild PTSD symptoms";
      recommendation = "You're showing mild symptoms of PTSD. Consider discussing these symptoms with a mental health professional.";
    } else if (score < 3) {
      severity = "Moderate PTSD symptoms";
      recommendation = "Your symptoms suggest moderate PTSD. It's recommended to consult with a mental health professional for further evaluation.";
    } else {
      severity = "Severe PTSD symptoms";
      recommendation = "Your symptoms indicate severe PTSD. Please seek professional help for proper evaluation and support.";
    }

    setResult({
      severity,
      score: total,
      maxScore: questions.length * 4,
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
      assessmentName: 'PTSD Assessment',
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
        <div className="assessment-header ptsd">
          <h2 className="assessment-title">PTSD Assessment</h2>
          <p className="assessment-subtitle">Rate how much these experiences have bothered you in the past month.</p>
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
                If you're experiencing severe distress, please seek immediate help from a mental health professional or emergency services.
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