import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that happened that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
];

const answerOptions = [
  { value: "0", label: "Never" },
  { value: "1", label: "Almost never" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Fairly often" },
  { value: "4", label: "Very often" }
];

// Zero-based indices of the four items that must be reverse-scored (questions 4,5,7,8)
const reverseIndices = [3, 4, 6, 7];

export default function StressEvaluation() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const questionRef = useRef(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Only show disclaimer once, on mount
  useEffect(() => {
    setShowDisclaimer(true);
  }, []);

  // Scroll into view on question change
  useEffect(() => {
    if (questionRef.current) questionRef.current.scrollIntoView({ behavior: 'smooth' });
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
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  };

  const calculateResult = () => {
    // Sum, applying reverse scoring where needed
    const totalScore = answers.reduce((sum, ans, idx) => {
      const val = parseInt(ans, 10) || 0;
      return sum + (reverseIndices.includes(idx) ? (4 - val) : val);
    }, 0);

    // PSS score ranges: 0–13 low, 14–26 moderate, 27–40 high
    let stressLevel, recommendation;
    if (totalScore <= 13) {
      stressLevel = "Low perceived stress";
      recommendation = "Your stress is in the low range. Continue with your current coping strategies and self-care routines.";
    } else if (totalScore <= 26) {
      stressLevel = "Moderate perceived stress";
      recommendation = "You’re experiencing moderate stress. Consider incorporating regular relaxation exercises (e.g., deep breathing, mindfulness) and time management techniques.";
    } else {
      stressLevel = "High perceived stress";
      recommendation = "Your stress is high. It may help to seek support from a mental health professional or employee assistance program and practice structured stress-reduction strategies.";
    }

    setResult({
      severity: stressLevel,
      score: totalScore,
      maxScore: questions.length * 4,
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
      assessmentName: 'Stress Evaluation',
      assessmentResult: result.severity,
      assessmentScore: `${result.score} out of ${result.maxScore}`,
      recommendation: `This is a test based on Perceived Stress Scale (PSS-10). The recommendation is: ${result.recommendation}`,
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
    // full-bleed, with responsive padding
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-10 px-2 sm:px-4 md:px-8 flex justify-center">
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-4 border border-gray-200 overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Disclaimer
              </h3>
            </div>
            <div className="px-4 py-4 text-gray-700 text-sm md:text-base leading-relaxed">
              <p>
                The PSS-10 measures your perceived stress over the last month.&nbsp;
                It is a screening tool, not a diagnosis. Please consult a qualified healthcare provider for a professional evaluation.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Use this tool as a starting point for self-awareness, not a clinical determination.
              </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm md:text-base font-medium hover:bg-gray-900 transition"
                onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-blue-700 transition"
                onClick={() => setShowDisclaimer(false)}
                autoFocus
              >
                Accept and Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`assessment-card bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-xl mx-4 mb-8 px-4 sm:px-6 md:px-8${showDisclaimer ? ' pointer-events-none opacity-30' : ''}`}>
        <div className="assessment-header stress py-4">
          <h2 className="assessment-title text-xl md:text-2xl font-bold">Stress Evaluation</h2>
          <p className="assessment-subtitle text-sm md:text-base">Answer each based on how often you felt or thought this way in the last month.</p>
        </div>

        <div className="assessment-content" ref={questionRef}>
          {result ? (
            <div className="result-container space-y-4">
              <h3 className="result-title text-lg md:text-xl font-bold">Assessment Complete</h3>
              <div className="result-score text-lg md:text-2xl font-semibold">{result.severity}</div>
              <p className="result-details text-sm md:text-base">
                Score: {result.score} out of {result.maxScore}
              </p>
              <div className="result-recommendation bg-gray-50 p-4 rounded">
                <h4 className="recommendation-title text-sm md:text-base font-medium">Recommendation</h4>
                <p className="recommendation-text text-sm md:text-base">{result.recommendation}</p>
              </div>
              <p className="disclaimer text-xs md:text-sm text-gray-500">
                Note: This is a screening tool, not a diagnostic instrument.
                For personalized guidance, please consult a mental health professional.
              </p>
              <button
                className="w-full py-2 md:py-3 bg-indigo-600 text-white rounded-lg text-sm md:text-base font-medium hover:bg-indigo-700 transition"
                onClick={handleSaveScore}
              >
                Save Score
              </button>
              {saveStatus === 'saving' && <p className="text-blue-600 text-xs md:text-sm text-center">Saving...</p>}
              {saveStatus === 'success' && <p className="text-green-600 text-xs md:text-sm text-center">Saved successfully!</p>}
              {saveStatus === 'error' && <p className="text-red-600 text-xs md:text-sm text-center">Save failed. Try again.</p>}
            </div>
          ) : (
            <>
              <div className="progress-container mb-3 text-center">
                <div
                  className="progress-bar h-2 md:h-3 rounded-full bg-indigo-200"
                  style={{ width: `${progress}%` }}
                />
                <p className="mt-2 text-gray-600 text-sm md:text-base">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <div className="question-counter text-center text-gray-600 text-sm md:text-base mb-2">
                {answers.filter(ans => ans !== undefined).length} of {questions.length} answered
              </div>

              <div className="question text-sm md:text-base font-medium mb-4">
                {questions[currentQuestion]}
              </div>

              <div className="options-grid grid grid-cols-1 gap-2">
                {answerOptions.map(option => (
                  <div
                    key={option.value}
                    className={`option-item p-3 rounded-lg border ${
                      answers[currentQuestion] === option.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer text-sm md:text-base">
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={answers[currentQuestion] === option.value}
                        onChange={() => handleAnswer(option.value)}
                        className="h-4 w-4 md:h-5 md:w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="assessment-footer px-2 sm:px-0 py-4 bg-gray-50 border-t border-gray-200">
          {!result && (
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium ${
                  currentQuestion === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
                disabled={currentQuestion === 0}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-lg text-sm md:text-base font-medium ${
                  answers[currentQuestion] === undefined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
