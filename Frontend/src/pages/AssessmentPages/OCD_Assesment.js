import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "I have saved up so many things that they get in the way.",
  "I check things more often than necessary.",
  "I get upset if objects are not arranged properly.",
  "I feel compelled to count while I am doing things.",
  "I find it difficult to touch an object when I know it has been touched by strangers or certain people.",
  "I find it difficult to control my own thoughts.",
  "I collect things I don't need.",
  "I repeatedly check doors, windows, drawers, etc.",
  "I get upset if others change the way I have arranged things.",
  "I feel I have to repeat certain numbers.",
  "I sometimes have to wash or clean myself simply because I feel contaminated.",
  "I am upset by unpleasant thoughts that come into my mind against my will.",
  "I avoid throwing things away because I am afraid I might need them later.",
  "I repeatedly check gas and water taps and light switches after turning them off.",
  "I need things to be arranged in a particular way.",
  "I feel that there are good and bad numbers.",
  "I wash my hands more often and longer than necessary.",
  "I frequently get nasty thoughts and have difficulty in getting rid of them."
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "A lot" },
  { value: "4", label: "Extremely" }
];

export default function OCD_Assesment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => { setShowDisclaimer(true); }, []);

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
      severity = "Minimal OCD symptoms";
      recommendation = "Your symptoms suggest minimal indication of OCD. Continue monitoring your mental health.";
    } else if (score < 2) {
      severity = "Mild OCD symptoms";
      recommendation = "You're showing mild symptoms of OCD. Consider discussing these symptoms with a mental health professional.";
    } else if (score < 3) {
      severity = "Moderate OCD symptoms";
      recommendation = "Your symptoms suggest moderate OCD. It's recommended to consult with a mental health professional for further evaluation.";
    } else {
      severity = "Severe OCD symptoms";
      recommendation = "Your symptoms indicate severe OCD. Please seek professional help for proper evaluation and support.";
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
      assessmentName: 'OCD Assessment',
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
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity animate-fadeIn"></div>
          <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 border border-gray-200 animate-scaleIn overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">⚠️ Disclaimer</h3>
            </div>
            <div className="px-6 py-5 text-gray-700 text-base leading-relaxed">
              <p>This assessment is based solely on your responses and is intended for informational purposes only. Please consult a qualified healthcare provider for a professional evaluation.</p>
              <p className="mt-3 text-sm text-gray-500">Use this tool as a starting point for self-awareness, not a diagnosis.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button className="px-5 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm" onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}>Cancel</button>
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md" onClick={() => setShowDisclaimer(false)} autoFocus>Accept and Continue</button>
            </div>
          </div>
        </div>
      )}
      <div className={`assessment-card${showDisclaimer ? ' pointer-events-none opacity-30' : ''}`}>
        <div className="assessment-header ocd">
          <h2 className="assessment-title">OCD Assessment</h2>
          <p className="assessment-subtitle">Rate how much these statements apply to you over the past week.</p>
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
        <div className="assessment-footer flex justify-between items-center gap-4 mt-4">
          {!result && (
            <>
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                className={`next-button bg-gray-300 text-gray-700 hover:bg-gray-400 transition duration-200 ${
                  currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={currentQuestion === 0}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="next-button hover:bg-green-600 transition duration-200"
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
