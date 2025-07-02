// src/pages/CombinedReducedSurvey.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Allcss/AssessmentPages/Assessment.css';
import { toast } from 'react-toastify';

// Define question groups with their scales and mappings
const questionGroups = [
  {
    title: 'Tech Usage Factors',
    scale: [
      { value: '1', label: 'Strongly Disagree' },
      { value: '2', label: 'Disagree' },
      { value: '3', label: 'Neutral' },
      { value: '4', label: 'Agree' },
      { value: '5', label: 'Strongly Agree' }
    ],
    questions: [
      { key: 'Q1', label: 'I spend several hours daily watching short-form videos on TikTok, Instagram Reels, or YouTube Shorts.', map: [1,4,5] },
      { key: 'Q2', label: 'I often scroll through social media feeds longer than I originally intended.', map: [2,9] },
      { key: 'Q3', label: 'I feel the urge to check my social media notifications as soon as they appear.', map: [3,10,14] },
      { key: 'Q6', label: 'I frequently use apps like Snapchat, Instagram, or WhatsApp which can do disappearing message.', map: [6] },
      { key: 'Q7', label: 'I feel anxious when my posts do not receive likes, comments, or shares quickly.', map: [7,13,22,23] },
      { key: 'Q8', label: 'Social media notifications often distract me from work, studies, or real-life activities.', map: [8,28,32,33] },
      { key: 'Q11', label: 'I feel mentally exhausted after spending a long time on social media.', map: [11] },
      { key: 'Q12', label: 'I use social media as a way to escape from stress or negative emotions.', map: [12] },
      { key: 'Q15', label: 'After using social media, I find it difficult to focus on real-world tasks.', map: [15] }
    ]
  },
  {
    title: 'Lifestyle & Psychosocial Factors',
    scale: [
      { value: '1', label: 'Never' },
      { value: '2', label: 'Rarely' },
      { value: '3', label: 'Sometimes' },
      { value: '4', label: 'Often' },
      { value: '5', label: 'Always' }
    ],
    questions: [
      { key: 'Q16', label: 'I get at least 7-8 hours of sleep on most nights. (Reverse Scored)', map: [16] },
      { key: 'Q17', label: 'I have trouble sleeping when I use screens before bedtime.', map: [17] },
      { key: 'Q18', label: 'I engage in regular physical activity, such as exercise or sports. (Reverse Scored)', map: [18] },
      { key: 'Q19', label: 'I believe my diet and nutrition impact my mental well-being.', map: [19] },
      { key: 'Q20', label: 'I frequently experience high levels of stress due to academic, work, or personal pressures.', map: [20, 21] },
      { key: 'Q24', label: 'Over the past month, I have felt emotionally stable and in good mental health. (Reverse Scored)', map: [24] },
      { key: 'Q25', label: 'I feel that social media or digital interactions have negatively affected my real-life relationships.', map: [25] }
    ]
  },
  {
    title: 'Attention and Focus Scale',
    scale: [
      { value: '1', label: 'Never' },
      { value: '2', label: 'Rarely' },
      { value: '3', label: 'Sometimes' },
      { value: '4', label: 'Often' },
      { value: '5', label: 'Very Often' }
    ],
    questions: [
      { key: 'Q26', label: 'I have trouble keeping my attention on tasks that are boring or repetitive.', map: [26, 30] },
      { key: 'Q27', label: 'I often start tasks but leave them unfinished.', map: [27,31] },
      { key: 'Q29', label: 'I frequently lose or misplace items needed for daily tasks (e.g., keys, phone, notes).', map: [29] },
      { key: 'Q34', label: 'I make careless mistakes on tasks that require full attention.', map: [34] },
      { key: 'Q35', label: 'I forget appointments or obligations even after planning for them.', map: [35] }
    ]
  },
  {
    title: 'Cognitive Load Scale',
    scale: [
      { value: '1', label: 'Strongly Disagree' },
      { value: '2', label: 'Disagree' },
      { value: '3', label: 'Neutral' },
      { value: '4', label: 'Agree' },
      { value: '5', label: 'Strongly Agree' }
    ],
    questions: [
      { key: 'Q36', label: 'I get tired very quickly when doing mentally demanding tasks.', map: [36,38,39] },
      { key: 'Q37', label: 'I have problems thinking clearly when I’m mentally overwhelmed.', map: [37] },
      { key: 'Q40', label: 'I have trouble starting tasks that require a lot of thought.', map: [40] },
      { key: 'Q41', label: 'I feel rested and mentally fresh. (Reversed Scored)', map: [41] },
      { key: 'Q42', label: 'I find it difficult to maintain focus when switching between tasks.', map: [42] },
      { key: 'Q43', label: 'I find that my thoughts wander when I try to concentrate.', map: [43, 45] },
      { key: 'Q44', label: 'I can concentrate quite well when I need to. (Reversed Scored)', map: [44] }
    ]
  },
  {
    title: 'Behavioral Impulsivity Scale',
    scale: [
      { value: '1', label: 'Never' },
      { value: '2', label: 'Rarely' },
      { value: '3', label: 'Sometimes' },
      { value: '4', label: 'Often' },
      { value: '5', label: 'Very Often' }
    ],
    questions: [
      { key: 'Q46', label: 'I do things without thinking.', map: [46,48, 49] },
      { key: 'Q47', label: 'I act on the spur of the moment.', map: [47] },
      { key: 'Q50', label: 'I get easily bored when I am working on thought problems or repetitive tasks.', map: [50] },
      { key: 'Q51', label: 'In the last month, I felt nervous and stressed.', map: [51,52,54] },
      { key: 'Q53', label: 'I am more interested in the present than the future.', map: [53] },
      { key: 'Q55', label: 'I usually think carefully before making decisions. (Reversed Scored)', map: [55] }
    ]
  }
];

const CombinedReducedSurvey = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalQuestions = questionGroups.reduce((sum, grp) => sum + grp.questions.length, 0);
  const answeredQuestions = Object.keys(responses).length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const handleSelect = (key, value) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmitClick = () => setShowConfirmation(true);

  const handleConfirm = async () => {
    setLoading(true);
    // build payload
    const payload = {
      email: localStorage.getItem('techUsageEmail') || '',
      gender: localStorage.getItem('techUsageGender') || '',
      age: localStorage.getItem('techUsageAge') || ''
    };
    questionGroups.forEach(grp => {
      grp.questions.forEach(q => {
        const ans = responses[q.key] || 0;
        q.map.forEach(orig => { payload[`Q${orig}`] = Number(ans); });
      });
    });

    console.log(payload);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/research/research`, payload);
      toast.success('Submission Successful!');
      navigate('/');
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('Submission Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-container">
      <div className="assessment-card">
        <div className="assessment-header adhd" style={{ background: 'linear-gradient(135deg, #0284c7, #0ea5e9)' }}>
          <h2 className="assessment-title">Reduced Technology Usage Survey</h2>
          <p className="assessment-subtitle">Question {answeredQuestions} of {totalQuestions}</p>
          <div className="mt-4 w-full px-4">
            <div className="w-full h-1.5 bg-gray-200/30 rounded-full overflow-hidden">
              <div className="h-full bg-purple-800 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="assessment-content">
          {questionGroups.map((grp, gi) => (
            <div key={gi} className="scale-section">
              <h3 className="scale-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {grp.title}
                <p className="text-sm text-gray-600 mt-2 font-normal">
                  Please rate the following
                </p>
              </h3>
              {grp.questions.map((q, qi) => (
                <div key={q.key} className="question-block" style={{ marginBottom: '2rem' }}>
                  <p className="question-text" style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '1rem' }}>
                    {q.label}
                  </p>
                  <div className="options-grid">
                    {grp.scale.map(option => (
                      <label key={option.value} className={`option-item ${responses[q.key] === option.value ? 'selected' : ''}`}>
                        <input type="radio" name={q.key} value={option.value} checked={responses[q.key] === option.value} onChange={() => handleSelect(q.key, option.value)} className="radio-input" />
                        <span className="option-label">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="assessment-footer">
          <button onClick={handleSubmitClick} className="next-button" disabled={answeredQuestions < totalQuestions}>
            Submit Survey
          </button>
          {answeredQuestions < totalQuestions && (
            <p className="text-sm text-gray-500 mt-2">Please answer all questions to proceed</p>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Confirm Your Responses</h3>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-800 font-medium mb-1">Ready to submit?</p>
                  <p className="text-gray-600 text-sm">Please ensure you have reviewed all your answers before submitting.</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button onClick={() => setShowConfirmation(false)} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors" disabled={loading}>Review Answers</button>
              <button onClick={handleConfirm} className={`px-4 py-2 rounded-md font-medium transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`} disabled={loading}>
                {loading ? 'Submitting...' : 'Complete Survey'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedReducedSurvey;
