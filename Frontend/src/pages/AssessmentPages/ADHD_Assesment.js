import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import '../../Allcss/AssessmentPages/Assessment.css';

const asrsQuestions = [
  // Core attention questions (Part A)
  "How often do you have trouble wrapping up the final details of a project?",
  "How often do you have difficulty organizing tasks?",
  "How often do you forget important appointments?",
  "How often do you avoid tasks requiring sustained mental effort?",
  "How often do you lose focus during meetings or conversations?",
  "How often do you make careless mistakes in your work?",
  
  // Additional focus-related questions
  "How often do you struggle to follow through on instructions?",
  "How often do you have trouble sustaining attention in tasks?",
  "How often do you misplace important items?",
  "How often are you distracted by external stimuli?",
  "How often do you have difficulty with quiet activities?",
  "How often do you procrastinate on starting tasks?",
  "How often do you daydream when you should be focused?",
  "How often do you have trouble completing paperwork?",
  "How often do you switch between unfinished tasks?",
  "How often do you forget daily routines?",
  "How often do you need to re-read material to understand it?",
  "How often do you miss important details in documents?"
];

const answerOptions = [
  { value: "0", label: "Never" },
  { value: "1", label: "Rarely" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Often" },
  { value: "4", label: "Very Often" }
];

export default function ADHD_Assessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const topRef = useRef(null);

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentQuestion]);

  const handleAnswer = (value) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < asrsQuestions.length - 1) {
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
    const partAScore = answers.slice(0, 6).reduce((sum, answer) => sum + (answer >= 3 ? 1 : 0), 0);
    const totalScore = answers.reduce((sum, answer) => sum + parseInt(answer, 10), 0);
    const maxPossibleScore = asrsQuestions.length * 4;
    const percentageScore = (totalScore / maxPossibleScore) * 100;

    // Attention/Focus Spectrum Analysis
    let attentionLevel, recommendation;
    let specificStrategies = [];

    if (percentageScore < 25) {
      attentionLevel = "Excellent Focus";
      recommendation = "Your attention and focus skills appear strong. To maintain this:";
      specificStrategies = [
        "Practice mindfulness to sustain your focus abilities",
        "Take regular breaks during long tasks",
        "Challenge yourself with new learning opportunities"
      ];
    } else if (percentageScore < 45) {
      attentionLevel = "Mild Attention Challenges";
      recommendation = "You show occasional focus difficulties. Recommended strategies:";
      specificStrategies = [
        "Use the Pomodoro technique (25min work/5min break)",
        "Minimize distractions in your workspace",
        "Practice active listening techniques"
      ];
    } else if (percentageScore < 65) {
      attentionLevel = "Moderate Attention Difficulties";
      recommendation = "Your results suggest noticeable focus challenges. Consider:";
      specificStrategies = [
        "Digital tools for organization and reminders",
        "Breaking tasks into smaller steps",
        "Behavioral strategies like habit stacking",
        "Professional evaluation if impacting daily life"
      ];
    } else if (percentageScore < 85) {
      attentionLevel = "Significant Focus Impairment";
      recommendation = "You report substantial attention difficulties. Recommended actions:";
      specificStrategies = [
        "Comprehensive professional assessment",
        "Cognitive behavioral therapy techniques",
        "Environmental modifications at work/school",
        "Potential medication evaluation if appropriate"
      ];
    } else {
      attentionLevel = "Severe Attention Challenges";
      recommendation = "Your responses indicate profound focus difficulties. Important next steps:";
      specificStrategies = [
        "Immediate consultation with a specialist",
        "Neuropsychological testing",
        "Comprehensive treatment planning",
        "Work/school accommodations evaluation"
      ];
    }

    // ADHD-Specific Scoring (Part A)
    let adhdConsistency = "";
    if (partAScore >= 4) {
      adhdConsistency = " (Highly consistent with ADHD symptoms)";
    } else if (partAScore >= 2) {
      adhdConsistency = " (Some ADHD-like symptoms)";
    }

    setResult({
      attentionLevel,
      severity: `${attentionLevel}${adhdConsistency}`,
      partAScore,
      totalScore,
      percentageScore,
      maxScore: maxPossibleScore,
      recommendation,
      specificStrategies,
      detailedScores: {
        organization: answers.slice(0, 3).reduce((sum, answer) => sum + parseInt(answer, 10), 0),
        taskPersistence: answers.slice(3, 9).reduce((sum, answer) => sum + parseInt(answer, 10), 0),
        distractibility: answers.slice(9).reduce((sum, answer) => sum + parseInt(answer, 10), 0)
      }
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
      assessmentName: 'Attention and Focus Assessment',
      assessmentResult: result.severity,
      assessmentScore: `Total: ${result.totalScore}/${result.maxScore} (${Math.round(result.percentageScore)}%) | Organization: ${result.detailedScores.organization}/12 | Task Focus: ${result.detailedScores.taskPersistence}/24 | Distractibility: ${result.detailedScores.distractibility}/36`,
      recommendation: `${result.recommendation} Strategies: ${result.specificStrategies.join('; ')}`,
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
    <div className="assessment-container" ref={topRef}>
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm transition-opacity animate-fadeIn"></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 border border-gray-200 animate-scaleIn overflow-hidden">
            <div className="px-4 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-yellow-500">⚠️</span> Disclaimer
              </h3>
            </div>
            <div className="px-4 py-4 text-gray-700 text-sm leading-relaxed">
              <p>This assessment evaluates attention and focus patterns but cannot diagnose medical conditions.  
                It is a self-reporting scale.  
                For the most accurate results and to avoid any confusion about your own situation, it is always best to consult with a specialist.</p>
              <p className="mt-2 text-xs text-gray-500">Based on clinical screening tools including the ASRS-v1.1</p>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end space-x-2 border-t border-gray-200">
              <button
                className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-all shadow-sm"
                onClick={() => { setShowDisclaimer(false); navigate('/assessment'); }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md"
                onClick={() => setShowDisclaimer(false)}
                autoFocus
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`assessment-card${showDisclaimer ? ' pointer-events-none opacity-30' : ''}`}>
        <div className="assessment-header adhd px-4 py-4">
          <h2 className="assessment-title text-lg md:text-xl font-bold">Attention and Focus Assessment</h2>
          <p className="assessment-subtitle text-sm md:text-base">Rate your experiences over the past 6 months</p>
        </div>
        
        <div className="assessment-content px-4 py-4">
          {result ? (
            <div className="result-container space-y-4">
              <h3 className="result-title text-lg font-bold">Assessment Results</h3>
              
              <div className={`result-score text-lg font-bold ${
                result.percentageScore < 25 ? 'text-green-600' :
                result.percentageScore < 45 ? 'text-yellow-600' :
                result.percentageScore < 65 ? 'text-orange-600' :
                result.percentageScore < 85 ? 'text-red-600' : 'text-purple-800'
              }`}>
                {result.attentionLevel}
              </div>
              
              <div className="score-spectrum my-4">
                <div className="spectrum-bar-container h-3 bg-gray-200 rounded-full">
                  <div 
                    className="spectrum-bar h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                    style={{ width: `${result.percentageScore}%` }}
                  ></div>
                </div>
                <div className="spectrum-labels flex justify-between mt-1 text-xs text-gray-600">
                  <span>Strong Focus</span>
                  <span>Severe Challenges</span>
                </div>
              </div>
              
              <div className="result-details grid grid-cols-2 gap-3">
                <div className="detail-box bg-gray-50 p-3 rounded">
                  <h4 className="text-xs font-medium">Overall</h4>
                  <p className="text-sm">{result.totalScore}/{result.maxScore}</p>
                </div>
                <div className="detail-box bg-gray-50 p-3 rounded">
                  <h4 className="text-xs font-medium">Organization</h4>
                  <p className="text-sm">{result.detailedScores.organization}/12</p>
                </div>
                <div className="detail-box bg-gray-50 p-3 rounded">
                  <h4 className="text-xs font-medium">Task Focus</h4>
                  <p className="text-sm">{result.detailedScores.taskPersistence}/24</p>
                </div>
                <div className="detail-box bg-gray-50 p-3 rounded">
                  <h4 className="text-xs font-medium">Distractibility</h4>
                  <p className="text-sm">{result.detailedScores.distractibility}/36</p>
                </div>
              </div>

              {result.partAScore >= 2 && (
                <div className="adhd-note bg-blue-50 p-3 rounded">
                  <h4 className="text-sm font-medium text-blue-800">ADHD Screening Note</h4>
                  <p className="text-xs text-blue-700">Part A Score: {result.partAScore}/6</p>
                </div>
              )}

              <div className="result-recommendation bg-gray-50 p-4 rounded">
                <h4 className="text-sm font-bold mb-2">Recommendations</h4>
                <p className="text-xs mb-3">{result.recommendation}</p>
                
                <div className="specific-suggestions">
                  <h5 className="text-xs font-medium mb-1">Strategies:</h5>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    {result.specificStrategies.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>

                {result.percentageScore > 45 && (
                  <div className="professional-note mt-3 p-2 bg-yellow-50 rounded text-xs">
                    <p className="text-yellow-800">Consider professional consultation if these affect your daily life.</p>
                  </div>
                )}
              </div>

              <p className="disclaimer text-xs text-gray-500 mt-4">
                Note: This is a screening tool, not a diagnostic instrument.
              </p>

              <div className="mt-4">
                <button 
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                  onClick={handleSaveScore}
                >
                  Save Score
                </button>
                {saveStatus === 'saving' && <p className="text-blue-600 text-xs text-center mt-1">Saving...</p>}
                {saveStatus === 'success' && <p className="text-green-600 text-xs text-center mt-1">Saved successfully!</p>}
                {saveStatus === 'error' && <p className="text-red-600 text-xs text-center mt-1">Save failed. Try again.</p>}
              </div>
            </div>
          ) : (
            <>
              <div className="progress-container mb-3">
                <div className="progress-bar h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                <p className="text-xs text-gray-600 mt-1">
                  Question {currentQuestion + 1} of {asrsQuestions.length} ({Math.round(progress)}%)
                </p>
              </div>
              
              <div className="question text-sm md:text-base mb-4 font-medium">
                {asrsQuestions[currentQuestion]}
              </div>
              
              <div className="options-grid grid grid-cols-1 gap-2">
                {answerOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`option-item p-3 rounded-lg border ${
                      answers[currentQuestion] === option.value 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        checked={answers[currentQuestion] === option.value}
                        onChange={() => handleAnswer(option.value)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        
        <div className="assessment-footer px-4 py-3 bg-gray-50 border-t border-gray-200">
          {!result && (
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
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
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  answers[currentQuestion] === undefined
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion < asrsQuestions.length - 1 ? "Next" : "Submit"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}