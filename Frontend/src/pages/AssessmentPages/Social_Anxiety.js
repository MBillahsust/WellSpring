// The Liebowitz Social Anxiety Scale (LSAS) is a widely used instrument designed to assess the fear and avoidance associated with social anxiety disorder (SAD). The LSAS consists of 24 items, divided into two subscales: 12 items measuring fear and 12 items measuring avoidance in social situations. Each item is scored on a scale from 0 to 3, where higher scores indicate greater levels of fear or avoidance.

import React, { useState } from 'react';
import '../../Allcss/AssessmentPages/AnxietyAssessment.css';

const lsasQuestions = {
  fear: [
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
    "How afraid are you to attend social events?"
  ],
  avoidance: [
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
  ]
};

const answerOptions = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Mildly" },
  { value: "2", label: "Moderately" },
  { value: "3", label: "Severely" }
];

export default function Social_Anxiety() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [fearAnswers, setFearAnswers] = useState(Array(12).fill(undefined));
  const [avoidanceAnswers, setAvoidanceAnswers] = useState(Array(12).fill(undefined));
  const [result, setResult] = useState(null);
  const [subscale, setSubscale] = useState('fear');

  const handleAnswer = (value) => {
    if (subscale === 'fear') {
      setFearAnswers([...fearAnswers.slice(0, currentQuestion), value]);
    } else {
      setAvoidanceAnswers([...avoidanceAnswers.slice(0, currentQuestion), value]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < 11) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      if (subscale === 'fear') {
        setSubscale('avoidance');
        setCurrentQuestion(0);
      } else {
        calculateResult();
      }
    }
  };

  const calculateResult = () => {
    const fearScore = fearAnswers.reduce((sum, answer) => sum + (answer !== undefined ? parseInt(answer, 10) : 0), 0);
    const avoidanceScore = avoidanceAnswers.reduce((sum, answer) => sum + (answer !== undefined ? parseInt(answer, 10) : 0), 0);
    const totalScore = fearScore + avoidanceScore;

    let severity;
    if (totalScore <= 30) {
      severity = "Low likelihood of social anxiety disorder.";
    } else if (totalScore <= 60) {
      severity = "Moderate likelihood of social anxiety disorder.";
    } else {
      severity = "High likelihood of social anxiety disorder.";
    }

    setResult({
      severity,
      totalScore,
      fearScore,
      avoidanceScore,
      maxScore: 72 // Max possible score
    });
  };

  const progress = ((currentQuestion + 1) / (subscale === 'fear' ? 12 : 12)) * 100;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="card shadow-lg">
        <div className="card-header bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-t-lg">
          <h2 className="text-2xl font-bold">Liebowitz Social Anxiety Scale (LSAS)</h2>
          <p className="text-gray-100">Answer the following questions to assess your social anxiety.</p>
        </div>
        <div className="card-content pt-6">
          {result ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-purple-600">
                LSAS Likelihood: {result.severity}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Total Score: {result.totalScore} / {result.maxScore}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Fear Score: {result.fearScore} / 36
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Avoidance Score: {result.avoidanceScore} / 36
              </p>
              <p className="text-sm text-gray-600">
                Note: This is a screening tool, not a diagnostic instrument. Consult a professional for proper evaluation.
              </p>
            </div>
          ) : (
            <>
              <div className="progress mb-4 h-2" style={{ width: `${progress}%` }}></div>
              <p className="text-sm text-gray-600 mb-4">Question {currentQuestion + 1} of 12</p>
              <div className="mb-6">
                <label className="text-lg font-medium mb-4 block text-gray-800">
                  {subscale === 'fear' ? lsasQuestions.fear[currentQuestion] : lsasQuestions.avoidance[currentQuestion]}
                </label>
                <div className="space-y-2">
                  {answerOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="answer"
                        value={option.value}
                        id={`q-${subscale}-${currentQuestion}-${option.value}`}
                        checked={(subscale === 'fear' ? fearAnswers : avoidanceAnswers)[currentQuestion] === option.value}
                        onChange={() => handleAnswer(option.value)}
                      />
                      <label htmlFor={`q-${subscale}-${currentQuestion}-${option.value}`} className="ml-2 text-gray-700">{option.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="card-footer">
          {!result && (
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center"
              disabled={(subscale === 'fear' ? fearAnswers : avoidanceAnswers)[currentQuestion] === undefined}
            >
              {currentQuestion < 11 ? "Next Question" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
