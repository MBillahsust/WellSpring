

import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const asrsQuestions = [
  "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  "How often do you have difficulty organizing tasks and activities?",
  "How often do you have trouble keeping your attention on tasks or activities?",
  "How often do you avoid, dislike, or are reluctant to engage in tasks that require sustained mental effort?",
  "How often do you lose things necessary for tasks and activities?",
  "How often are you easily distracted by extraneous stimuli?",
  "How often do you fidget with or tap your hands or feet, or squirm in your seat?",
  "How often do you leave your seat in situations when remaining seated is expected?",
  "How often do you run or climb in situations where it is inappropriate?",
  "How often are you unable to play or engage in activities quietly?",
  "How often do you talk excessively?",
  "How often do you blurt out an answer before a question has been completed?",
  "How often do you have trouble waiting your turn?",
  "How often do you interrupt or intrude on others?",
  "How often do you finish other people's sentences?",
  "How often do you feel restless?",
  "How often do you have difficulty engaging in quiet activities?",
  "How often do you feel overwhelmed by your responsibilities?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very often" }
];

export default function ADHD_Assesment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion]);

  const handleAnswer = (value) => {
    setAnswers([...answers.slice(0, currentQuestion), value]);
  };

  const handleNext = () => {
    if (currentQuestion < asrsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const totalScore = answers.reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const inattentionScore = answers.slice(0, 6).reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const hyperImpulsivityScore = answers.slice(6).reduce((sum, answer) => sum + parseInt(answer, 10), 0);

    let severity, recommendation;

    if (totalScore <= 18) {
      severity = "Minimal likelihood of ADHD";
      recommendation = "Your symptoms suggest minimal indication of ADHD. Continue monitoring any concerns you may have.";
    } else if (totalScore <= 36) {
      severity = "Mild likelihood of ADHD";
      recommendation = "Your symptoms suggest mild ADHD traits. Consider discussing these symptoms with a healthcare provider.";
    } else if (totalScore <= 54) {
      severity = "Moderate likelihood of ADHD";
      recommendation = "Your symptoms suggest moderate ADHD traits. It's recommended to consult with a mental health professional for further evaluation.";
    } else if (totalScore <= 72) {
      severity = "High likelihood of ADHD";
      recommendation = "Your symptoms suggest strong ADHD traits. We strongly recommend seeking professional evaluation and support.";
    }

    setResult({
      severity,
      totalScore,
      inattentionScore,
      hyperImpulsivityScore,
      maxScore: asrsQuestions.length * 4,
      recommendation
    });
  };

  const progress = ((currentQuestion + 1) / asrsQuestions.length) * 100;

  const handleSaveScore = async () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Adult ADHD Self-Report Scale (ASRS-v1.1)',
      assessmentResult: result.severity,
      assessmentScore: `Total: ${result.totalScore} / ${result.maxScore} | Inattention: ${result.inattentionScore} / 24 | Hyperactivity/Impulsivity: ${result.hyperImpulsivityScore} / 48`,
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
    <div ref={topRef} className="assessment-container p-4 md:p-6">
      <div className="assessment-card">
        <div className="assessment-header adhd">
          <h2 className="assessment-title text-xl md:text-2xl">Adult ADHD Self-Report Scale (ASRS-v1.1)</h2>
          <p className="assessment-subtitle">Answer the following questions to assess your ADHD symptoms.</p>
        </div>
        <div className="assessment-content fade-in">
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">{result.severity}</div>
              <p className="result-details">Total Score: {result.totalScore} / {result.maxScore}</p>
              <div className="result-details">
                <p>Inattention Score: {result.inattentionScore} / 24</p>
                <p>Hyperactivity/Impulsivity Score: {result.hyperImpulsivityScore} / 48</p>
              </div>
              <div className="result-recommendation">
                <h4 className="recommendation-title">Recommendation</h4>
                <p className="recommendation-text">{result.recommendation}</p>
              </div>
              <p className="disclaimer">
                Note: This is a screening tool and not a diagnostic instrument.
                Please consult with a mental health professional for a proper evaluation.
              </p>
              <button className="next-button hover:bg-green-600 transition" onClick={handleSaveScore} style={{ marginTop: '1rem' }}>
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
              </div>
              <p className="question-counter">
                Question {currentQuestion + 1} of {asrsQuestions.length} ({Math.round(progress)}%)
              </p>
              <div className="question">{asrsQuestions[currentQuestion]}</div>
              <div className="options-grid">
                {answerOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`option-item flex flex-col sm:flex-row sm:items-center gap-2 ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
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
                {currentQuestion < asrsQuestions.length - 1 ? "Next Question" : "Submit"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
