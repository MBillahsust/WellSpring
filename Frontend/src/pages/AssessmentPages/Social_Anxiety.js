import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

// 17 SPIN items
const questions = [
  "1. I am afraid of people in authority",
  "2. I am bothered by blushing in front of people",
  "3. Parties and social events scare me",
  "4. I avoid talking to people I don’t know",
  "5. Being criticized scares me a lot",
  "6. Fear of embarrassment causes me to avoid doing things or speaking to people",
  "7. Sweating in front of people causes me distress",
  "8. I avoid going to parties",
  "9. I avoid activities in which I am the center of attention",
  "10. Talking to strangers scares me",
  "11. I avoid having to give speeches",
  "12. I would do anything to avoid being criticized",
  "13. Heart palpitations bother me when I am around people",
  "14. I am afraid of doing things when people might be watching",
  "15. Being embarrassed or looking stupid is among my worst fears",
  "16. I avoid speaking to anyone in authority",
  "17. Trembling or shaking in front of others is distressing to me"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "A little bit" },
  { value: "2", label: "Somewhat" },
  { value: "3", label: "Very much" },
  { value: "4", label: "Extremely" }
];

export default function Social_Anxiety() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(undefined));
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const questionRef = useRef(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => { setShowDisclaimer(true); }, []);
  useEffect(() => { questionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentQuestion]);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value, 10);
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
    const totalScore = answers.reduce((sum, v) => sum + (v || 0), 0);

    // SPIN thresholds:
    // 0–20: Minimal or no social anxiety
    // 21–30: Mild social anxiety
    // 31–40: Moderate social anxiety
    // 41–50: Severe social anxiety
    // 51–68: Very severe social anxiety :contentReference[oaicite:0]{index=0}
    let severity, recommendation;

    if (totalScore <= 20) {
      severity = "Minimal or No Social Anxiety";
      recommendation = "Your score suggests little to no social anxiety. Continue your usual activities and self-care practices.";
    } else if (totalScore <= 30) {
      severity = "Mild Social Anxiety";
      recommendation = "You have mild social anxiety. Consider occasional relaxation exercises and gradually challenging yourself in small social situations.";
    } else if (totalScore <= 40) {
      severity = "Moderate Social Anxiety";
      recommendation = "You have moderate social anxiety. Structured strategies like cognitive reframing and graded exposure could help—consider seeking a counselor’s guidance.";
    } else if (totalScore <= 50) {
      severity = "Severe Social Anxiety";
      recommendation = "You have severe social anxiety. It may be beneficial to seek professional support such as cognitive-behavioral therapy or an employee assistance program.";
    } else {
      severity = "Very Severe Social Anxiety";
      recommendation = "Your social anxiety is very severe. Please consider contacting a mental health professional promptly for comprehensive support.";
    }

    setResult({
      totalScore,
      maxScore: questions.length * 4,
      severity,
      recommendation
    });
  };

  const handleSaveScore = async () => {
    if (!userInfo?.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Social Anxiety Evaluation',
      assessmentResult: result.severity,
      assessmentScore: `${result.totalScore} out of ${result.maxScore}`,
      recommendation: `This test is based on Social Phobia Inventory (SPIN). The recommandation of this test is ${result.recommendation}`,
      takenAt: new Date().toISOString(),
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/addassesment/assessments`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-container">
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                ⚠️ Disclaimer
              </h3>
            </div>
            <div className="px-6 py-5 text-gray-700 text-base leading-relaxed">
              <p>This assessment is based solely on your responses and is intended for informational purposes only. Please consult a qualified healthcare provider for a professional evaluation.</p>
              <p className="mt-3 text-sm text-gray-500">Use this tool as a starting point for self-awareness, not a diagnosis.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900" onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}>Cancel</button>
              <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => setShowDisclaimer(false)} autoFocus>Accept and Continue</button>
            </div>
          </div>
        </div>
      )}

      <div className={`assessment-card${showDisclaimer ? ' pointer-events-none opacity-30' : ''}`}>
        <div className="assessment-header social-anxiety">
          <h2 className="assessment-title">Social Anxiety Assessment</h2>
          <p className="assessment-subtitle">How much have these bothered you during the past week?</p>
        </div>
        <div className="assessment-content" ref={questionRef}>
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">{result.severity}</div>
              <p className="result-details">Score: {result.totalScore} of {result.maxScore}</p>
              <div className="result-recommendation">
                <h4 className="recommendation-title">Recommendation</h4>
                <p className="recommendation-text">{result.recommendation}</p>
              </div>
              <button className="next-button" onClick={handleSaveScore} style={{ marginTop: '1rem' }}>Save Score</button>
              {saveStatus === 'saving' && <p style={{ color: '#6366f1' }}>Saving...</p>}
              {saveStatus === 'success' && <p style={{ color: 'green' }}>Score saved successfully!</p>}
              {saveStatus === 'error' && <p style={{ color: 'red' }}>Failed to save score. Please try again.</p>}
            </div>
          ) : (
            <>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
              <div className="question">{questions[currentQuestion]}</div>
              <div className="options-grid">
                {answerOptions.map(option => (
                  <div key={option.value} className={`option-item ${answers[currentQuestion] === parseInt(option.value) ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      id={`q-${option.value}`}
                      checked={answers[currentQuestion] === parseInt(option.value)}
                      onChange={() => handleAnswer(option.value)}
                      className="radio-input"
                    />
                    <label htmlFor={`q-${option.value}`} className="option-label">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="assessment-footer flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentQuestion(q => Math.max(q - 1, 0))}
                  className={`next-button bg-gray-300 text-gray-700 hover:bg-gray-400 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentQuestion === 0}
                >Back</button>
                <button
                  onClick={handleNext}
                  className="next-button hover:bg-green-600"
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion < questions.length - 1 ? "Next Question" : "Submit"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
