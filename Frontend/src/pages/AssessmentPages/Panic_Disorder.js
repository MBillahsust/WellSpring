import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

// 7-item Panic Disorder Severity Scale (PDSS)
const questions = [
  "How many panic attacks did you have in the past week?",
  "How much distress did you experience during your worst panic attack?",
  "How much anticipatory anxiety did you feel about having another panic attack?",
  "To what extent have you been avoiding situations out of fear of having a panic attack?",
  "How much have you changed your behavior (e.g. rituals, safety behaviors) to prevent panic attacks?",
  "How much have panic symptoms interfered with your work or school activities?",
  "How much have panic symptoms interfered with your social or family life?"
];

const answerOptions = [
  { value: "0", label: "None" },
  { value: "1", label: "Mild" },
  { value: "2", label: "Moderate" },
  { value: "3", label: "Severe" },
  { value: "4", label: "Extreme" }
];

export default function Panic_Disorder() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(undefined));
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const questionRef = useRef(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Show disclaimer once on mount
  useEffect(() => { setShowDisclaimer(true); }, []);
  // Scroll to top of question on change
  useEffect(() => { questionRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [currentQuestion]);

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[currentQuestion] = parseInt(value, 10);
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
    const total = answers.reduce((sum, ans) => sum + (ans || 0), 0);
    // PDSS thresholds:
    // 0–3   → Minimal or no panic symptoms
    // 4–7   → Mild panic symptoms
    // 8–12  → Moderate panic symptoms
    // 13–17 → Severe panic symptoms
    // 18–28 → Extreme panic symptoms
    let severity, recommendation;

    if (total <= 3) {
      severity = "Minimal or No Panic Symptoms";
      recommendation = "Your score indicates minimal panic symptoms. Continue monitoring and practicing healthy coping strategies.";
    } else if (total <= 7) {
      severity = "Mild Panic Symptoms";
      recommendation = "You have mild panic symptoms. Consider learning relaxation exercises (e.g., deep breathing) and monitoring triggers.";
    } else if (total <= 12) {
      severity = "Moderate Panic Symptoms";
      recommendation = "Your symptoms are moderate. Structured techniques like cognitive reframing and gradual exposure may help—consider consulting a mental health professional.";
    } else if (total <= 17) {
      severity = "Severe Panic Symptoms";
      recommendation = "You have severe panic symptoms. Seeking professional evaluation (e.g., CBT, medication review) is recommended.";
    } else {
      severity = "Extreme Panic Symptoms";
      recommendation = "Your symptoms are extreme. Please contact a mental health provider promptly for comprehensive support.";
    }

    setResult({
      score: total,
      maxScore: questions.length * 4,
      severity,
      recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSaveScore = async () => {
    if (!userInfo?.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Panic Monitor',
      assessmentResult: result.severity,
      assessmentScore: `${result.score} out of ${result.maxScore}`,
      recommendation: `Panic Disorder Severity Scale (PDSS). The recommandation is: ${result.recommendation}`,
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
              <p>This assessment evaluates panic symptoms over the past week but cannot diagnose medical conditions. Please be aware that the results of the assessment are based solely on your responses to the questionnaire; they provide an indication and do not constitute a clinical diagnosis.</p>
              <p className="mt-3 text-sm text-gray-500">For an accurate diagnosis and treatment plan, please consult a qualified healthcare provider.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t border-gray-200">
              <button
                className="px-5 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowDisclaimer(false)}
                autoFocus
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`assessment-card${showDisclaimer ? ' pointer-events-none opacity-30' : ''}`}>
        <div className="assessment-header panic">
          <h2 className="assessment-title">Panic Disorder Assessment</h2>
          <p className="assessment-subtitle">Rate each item based on your experience over the past week.</p>
        </div>
        <div className="assessment-content" ref={questionRef}>
          {result ? (
            <div className="result-container">
              <h3 className="result-title">Assessment Complete</h3>
              <div className="result-score">{result.severity}</div>
              <p className="result-details">Score: {result.score} out of {result.maxScore}</p>
              <div className="result-recommendation">
                <h4 className="recommendation-title">Recommendation</h4>
                <p className="recommendation-text">{result.recommendation}</p>
              </div>
              <p className="disclaimer text-xs mt-2 text-gray-500">
                Note: This is a screening tool and not a diagnostic instrument.
              </p>
              <button
                className="next-button mt-4"
                onClick={handleSaveScore}
              >
                Save Score
              </button>
              {saveStatus === 'saving' && <p className="text-xs mt-2 text-blue-600">Saving...</p>}
              {saveStatus === 'success' && <p className="text-xs mt-2 text-green-600">Saved successfully!</p>}
              {saveStatus === 'error' && <p className="text-xs mt-2 text-red-600">Save failed. Try again.</p>}
            </div>
          ) : (
            <>
              <div className="progress-container mb-4">
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <p className="question-counter">Question {currentQuestion + 1} of {questions.length}</p>
              <div className="question mb-4">{questions[currentQuestion]}</div>
              <div className="options-grid space-y-2">
                {answerOptions.map(option => (
                  <label
                    key={option.value}
                    className={`option-item flex items-center p-3 border rounded-md cursor-pointer ${
                      answers[currentQuestion] === parseInt(option.value)
                        ? 'bg-indigo-50 border-indigo-400'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      checked={answers[currentQuestion] === parseInt(option.value)}
                      onChange={() => handleAnswer(option.value)}
                      className="h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-3">{option.label}</span>
                  </label>
                ))}
              </div>
              <div className="assessment-footer flex justify-between items-center mt-6">
                <button
                  onClick={handleBack}
                  className={`next-button bg-gray-300 text-gray-700 hover:bg-gray-400 ${
                    currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={currentQuestion === 0}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="next-button bg-green-600 text-white hover:bg-green-700"
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
