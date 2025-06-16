import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself",
  "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?"
];

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

const impairmentOptions = [
  { value: "0", label: "Not difficult at all" },
  { value: "1", label: "Somewhat difficult" },
  { value: "2", label: "Very difficult" },
  { value: "3", label: "Extremely difficult" }
];

export default function DepressionScreening() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(undefined));
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const questionRef = useRef(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

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
    // Sum only first 9 questions (PHQ-9 symptom questions)
    const totalScore = answers.slice(0, 9).reduce((sum, ans) => sum + parseInt(ans || 0, 10), 0);
    const impairmentScore = parseInt(answers[9] || 0, 10);

    let severity, recommendation;

    if (totalScore >= 20) {
      severity = "Severe depression";
      recommendation = "Your symptoms indicate severe depression. Immediate evaluation by a mental health professional is critical. Please seek help urgently.";
    } else if (totalScore >= 15) {
      severity = "Moderately severe depression";
      recommendation = "Your symptoms are concerning and consistent with moderately severe depression. Professional help is strongly advised. Consider a combination of therapy and medication.";
    } else if (totalScore >= 10) {
      severity = "Moderate depression";
      recommendation = "You may be experiencing moderate depression. It’s important to consult a mental health professional for evaluation and possible treatment.";
    } else if (totalScore >= 5) {
      severity = "Mild depression";
      recommendation = "Mild symptoms of depression are present. You may benefit from lifestyle changes and counseling. Consider talking to a counselor if symptoms persist.";
    } else if (totalScore >= 1) {
      severity = "Minimal depression";
      recommendation = "Your symptoms suggest minimal or no depression. No specific treatment is needed, but continue monitoring your mental health.";
    } else {
      severity = "No depression";
      recommendation = "You reported no symptoms of depression. Keep maintaining your mental well-being.";
    }

    // If functional impairment is very or extremely difficult, emphasize seeking help
    if (impairmentScore >= 2) {
      recommendation += " Additionally, your reported difficulties in daily functioning suggest that professional support would be beneficial.";
    }

    setResult({
      severity,
      score: totalScore,
      maxScore: 27,
      recommendation
    });
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSaveScore = async () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!result) return;

    setSaveStatus('saving');
    const payload = {
      assessmentName: 'Depression Screening',
      assessmentResult: result.severity,
      assessmentScore: `${result.score} out of ${result.maxScore}`,
      recommendation: `This test is based on PHQ - 9 Test. Test recommendation is: ${result.recommendation}`,
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
              <button
                className="px-5 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-all shadow-sm"
                onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
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
        <div className="assessment-header depression">
          <h2 className="assessment-title">Depression Screening</h2>
          <p className="assessment-subtitle">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
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
                Please consult with a mental health professional for a proper evaluation.
              </p>
              <button
                className="next-button"
                onClick={handleSaveScore}
                style={{ marginTop: '1rem' }}
              >
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
                {(currentQuestion < 9 ? answerOptions : impairmentOptions).map((option) => (
                  <div
                    key={option.value}
                    className={`option-item ${answers[currentQuestion] === option.value ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option.value}
                      id={`q-${currentQuestion}-${option.value}`}
                      checked={answers[currentQuestion] === option.value}
                      onChange={() => handleAnswer(option.value)}
                      className="radio-input"
                    />
                    <label htmlFor={`q-${currentQuestion}-${option.value}`} className="option-label">
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
