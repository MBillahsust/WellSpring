import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaRobot, FaPaperPlane, FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaCalendarAlt, FaHistory, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';
import { XCircle, SendHorizonal, RotateCcw } from 'lucide-react';
import { Navigate } from "react-router-dom";




const AICounselor = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // State for assessments (fetched from backend)
  const [assessments, setAssessments] = useState([]);
  const [loadingAssessments, setLoadingAssessments] = useState(true);

  // State for mood tracking
  const [moodData, setMoodData] = useState([
    { id: 1, date: '2023-09-15', mood: 'Happy', score: 8, notes: 'Had a great day at work' },
    { id: 2, date: '2023-09-14', mood: 'Calm', score: 7, notes: 'Meditation helped a lot' },
    { id: 3, date: '2023-09-13', mood: 'Anxious', score: 4, notes: 'Stressed about upcoming deadline' },
    { id: 4, date: '2023-09-12', mood: 'Sad', score: 3, notes: 'Missing family' },
    { id: 5, date: '2023-09-11', mood: 'Neutral', score: 5, notes: 'Regular day' },
    { id: 6, date: '2023-09-10', mood: 'Happy', score: 8, notes: 'Spent time with friends' },
    { id: 7, date: '2023-09-09', mood: 'Calm', score: 7, notes: 'Weekend relaxation' },
  ]);

  // State for chat
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! I\'m your AI counselor. How can I help you today?' },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [expandedMood, setExpandedMood] = useState(false);
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [processingSummary, setProcessingSummary] = useState('');

  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatHistories, setChatHistories] = useState([
    {
      id: 1,
      title: 'Depression Discussion',
      date: '2023-09-10',
      messages: [
        { id: 1, sender: 'ai', text: 'Hello! How are you feeling today?' },
        { id: 2, sender: 'user', text: 'I\'ve been feeling down lately.' },
        { id: 3, sender: 'ai', text: 'I\'m sorry to hear that. Can you tell me more about what\'s been contributing to these feelings?' },
        { id: 4, sender: 'user', text: 'Work has been stressful and I\'m having trouble sleeping.' },
        { id: 5, sender: 'ai', text: 'Sleep issues can definitely impact mood. Have you tried any relaxation techniques before bed?' }
      ]
    },
    {
      id: 2,
      title: 'Anxiety Management',
      date: '2023-09-05',
      messages: [
        { id: 1, sender: 'ai', text: 'Hello! What brings you here today?' },
        { id: 2, sender: 'user', text: 'I\'ve been feeling anxious about an upcoming presentation.' },
        { id: 3, sender: 'ai', text: 'Public speaking can be challenging for many people. What specific aspects of the presentation are causing you the most anxiety?' },
        { id: 4, sender: 'user', text: 'I\'m worried about making mistakes or freezing up.' },
        { id: 5, sender: 'ai', text: 'Those are common concerns. Would you like to practice some breathing exercises that can help during your presentation?' }
      ]
    },
    {
      id: 3,
      title: 'Stress Relief Session',
      date: '2023-08-28',
      messages: [
        { id: 1, sender: 'ai', text: 'Hi there! How can I assist you today?' },
        { id: 2, sender: 'user', text: 'I\'m feeling overwhelmed with all my responsibilities.' },
        { id: 3, sender: 'ai', text: 'That sounds challenging. Sometimes breaking things down can help. Would you like to discuss what\'s on your plate?' },
        { id: 4, sender: 'user', text: 'Yes, I have work deadlines, family obligations, and personal projects all competing for my time.' },
        { id: 5, sender: 'ai', text: 'That\'s a lot to manage. Let\'s explore some time management strategies that might help you feel more in control.' }
      ]
    }
  ]);

  // State for mood and activity history (fetched from backend)
  const [moodHistory, setMoodHistory] = useState([]);
  const [loadingMood, setLoadingMood] = useState(true);
  const [activityHistory, setActivityHistory] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // State for game history (fetched from backend)
  const [gameHistory, setGameHistory] = useState([]);
  const [loadingGame, setLoadingGame] = useState(true);

  // Filter selectors for mood and activity
  const [moodDays, setMoodDays] = useState(7);
  const [activityDays, setActivityDays] = useState(7);

  // Helper to filter by days
  function filterByDays(data, days, dateKey = 'date') {
    if (!days) return data;
    const now = new Date();
    return data.filter(item => {
      const d = new Date(item[dateKey]);
      return (now - d) / (1000 * 60 * 60 * 24) < days;
    });
  }

  // State for summary
  const [summary, setSummary] = useState("");
  const [uiStage, setUiStage] = useState('default'); // 'default' | 'processing' | 'private'

  // On mount, check login and fetch assessments
  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/ai-counselor' } });
      return;
    }
    const fetchAssessments = async () => {
      setLoadingAssessments(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/addassesment/getassessments`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        let arr = Array.isArray(res.data) ? res.data : (res.data.assessments || []);
        if (!Array.isArray(arr)) arr = [];
        setAssessments(arr.map(a => ({
          id: a._id || a.id,
          name: a.assessmentName || a.title || a.type || a.assessmentType || 'Assessment',
          date: a.takenAt || a.createdAt ? new Date(a.takenAt || a.createdAt).toLocaleDateString() : (a.date || '-'),
          selected: false
        })));
      } catch (err) {
        setAssessments([]);
      } finally {
        setLoadingAssessments(false);
      }
    };
    const fetchMoodHistory = async () => {
      setLoadingMood(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const moodArray = Array.isArray(res.data) ? res.data : (res.data.moods || []);
        setMoodHistory(moodArray.map(entry => ({
          id: entry.id || entry._id,
          date: entry.time ? new Date(entry.time).toLocaleDateString() : '-',
          mood: entry.mood || '-',
        })));
      } catch (err) {
        setMoodHistory([]);
      } finally {
        setLoadingMood(false);
      }
    };
    const fetchActivityHistory = async () => {
      setLoadingActivity(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/activity/getActivity/`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const arr = Array.isArray(res.data) ? res.data : (res.data.activities || []);
        setActivityHistory(arr.map(entry => ({
          id: entry.id || entry._id,
          date: entry.time ? new Date(entry.time).toLocaleDateString() : '-',
          activity: entry.activity || '-',
        })));
      } catch (err) {
        setActivityHistory([]);
      } finally {
        setLoadingActivity(false);
      }
    };
    const fetchGameHistory = async () => {
      setLoadingGame(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/game/gameassessmentData`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        let arr = Array.isArray(res.data.assessments) ? res.data.assessments : (res.data || []);
        setGameHistory(arr.map(g => ({
          id: g._id || g.id,
          date: g.createdAt ? new Date(g.createdAt).toLocaleDateString() : '-',
          game_name: g.game_name || '-',
          selected: false
        })));
      } catch (err) {
        setGameHistory([]);
      } finally {
        setLoadingGame(false);
      }
    };
    fetchAssessments();
    fetchMoodHistory();
    fetchActivityHistory();
    fetchGameHistory();
  }, [userInfo, navigate]);

  // Toggle assessment selection
  const toggleAssessment = (id) => {
    setAssessments(assessments.map(assessment =>
      assessment.id === id ? { ...assessment, selected: !assessment.selected } : assessment
    ));
  };

  // Toggle mood table expansion
  const toggleMoodExpansion = () => {
    setExpandedMood(!expandedMood);
  };

  // Toggle chat history
  const toggleChatHistory = () => {
    setShowChatHistory(!showChatHistory);
  };

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Thank you for sharing that. I\'m here to support you. Would you like to discuss specific coping strategies or explore your feelings further?'
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  // Load chat history
  const loadChatHistory = (id) => {
    // Implementation of loadChatHistory function
  };

  const [gameCount, setGameCount] = useState(5);

  const lines = [
    "AI Counselor",
    "Your personal mental health assistant",
    "Always here to listen and guide."
  ];

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };



  const handleTypewriterDone = () => {
    setTimeout(() => setUiStage('private'), 7000); // Wait 7 seconds after summary is typed
  };

  const resetProcessing = () => {
    setUiStage('default');
    setSummary("");
  };

  const handleSubmit = async () => {
    setUiStage('private'); // Switch UI state if needed
    setSummary("");
    setProcessingSummary('');
    setLoading(true);

    const selectedAssessmentsId = assessments.filter(a => a.selected).map(a => a.id);
    const payload = {
      selectedAssessmentsId,
      moodHistory: moodDays,
      activityHistory: activityDays,
      gameHistory: gameCount
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/counselor/context`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      if (res.data && res.data.summary) {
        setProcessingSummary(res.data.summary);
      }

      // Show the summary for 10 seconds, then navigate
      setTimeout(() => {
        setLoading(false);
        navigate('/counsellor-bot', { 
          state: { 
            summary: res.data.summary,
            context: res.data.context 
          }
        });
      }, 7000);

    } catch (err) {
      console.error("Submission failed", err);
      setProcessingSummary("Sorry, there was an error processing your request.");
      setLoading(false); // Stop loading right away if error
    }
  };

  function AnimatedProcessingText() {
    const [dots, setDots] = React.useState("");
    React.useEffect(() => {
      const interval = setInterval(() => {
        setDots(d => (d.length < 3 ? d + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    }, []);

    return (
      <span className="text-blue-600 font-semibold text-lg tracking-wide">
        Processing your request{dots}
      </span>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 py-4">

      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-60 flex flex-col items-center justify-center z-50">
          {/* Enhanced spinner with dual border colors */}
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4 border-blue-400"></div>

          <div className="mt-6 max-w-lg w-full bg-white p-6 rounded-lg shadow-lg text-center">
            {processingSummary ? (
              <Typewriter
                words={[processingSummary]}
                loop={1}
                cursor
                cursorStyle="_"
                typeSpeed={20}
                deleteSpeed={0}
                delaySpeed={500}
              />
            ) : (
              <AnimatedProcessingText />
            )}
          </div>
        </div>
      )}



      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {uiStage === 'processing' ? (
            <Navigate to="/counsellor-bot" replace />


          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white border-b border-gray-200 p-10 rounded-b-xl shadow-md"
              >
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center space-y-3"
                >
                  {lines.map((line, i) => (
                    <motion.p
                      key={i}
                      variants={item}
                      className={`text-center ${i === 0
                        ? "text-3xl font-bold text-gray-900 tracking-wide"
                        : i === 1
                          ? "text-lg text-gray-700"
                          : "text-sm text-gray-500 italic"
                        }`}
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              </motion.div>
              <div className="flex flex-col md:flex-row">
                {/* Left side - Assessments and Game History */}
                <div className="w-full md:w-1/3 min-w-[340px] max-w-[420px] p-4 bg-blue-50">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center justify-between">
                      <span>Your Assessments</span>
                    </h3>
                    <div className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className="w-full">
                        {/* Table Header */}
                        <div className="flex bg-blue-100 text-sm w-full">
                          <div className="w-[60px] py-2 px-2 text-left text-blue-900 font-medium">Select</div>
                          <div className="w-[150px] py-2 px-2 text-left text-blue-900 font-medium">Assessment</div>
                          <div className="w-[100px] py-2 px-2 text-left text-blue-900 font-medium">Date</div>
                        </div>

                        {/* Table Body with vertical scroll */}
                        <div className="overflow-y-auto" style={{ maxHeight: '176px' /* 44px x 4 rows */ }}>
                          {loadingAssessments ? (
                            <div className="text-center text-gray-400 py-8">Loading...</div>
                          ) : assessments.length === 0 ? (
                            <div className="text-center text-gray-400 py-8">No assessments found.</div>
                          ) : (
                            assessments.map((assessment) => (
                              <div key={assessment.id} className="flex w-full hover:bg-gray-50 border-b last:border-none">
                                <div className="w-[60px] py-2 px-2">
                                  <input
                                    type="checkbox"
                                    checked={assessment.selected}
                                    onChange={() => toggleAssessment(assessment.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                </div>
                                <div className="w-[150px] py-2 px-2 text-gray-700 break-words">
                                  {assessment.name}
                                </div>
                                <div className="w-[100px] py-2 px-2 text-gray-500">{assessment.date}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game History moved here */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-blue-900">Game History</h3>
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={gameCount}
                        onChange={e => setGameCount(Number(e.target.value))}
                      >
                        <option value={3}>3 games</option>
                        <option value={5}>5 games</option>
                        <option value={8}>8 games</option>
                        <option value={10}>10 games</option>
                      </select>
                    </div>
                    <div className="overflow-x-auto">
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Date</th>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Game Name</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {loadingGame ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">Loading...</td></tr>
                            ) : gameHistory.length === 0 ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">No game history found.</td></tr>
                            ) : (
                              [...gameHistory]
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0, gameCount)
                                .map((game) => (
                                  <tr key={game.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 text-sm text-gray-700">{game.date}</td>
                                    <td className="py-2 px-3 text-sm text-gray-700">{game.game_name}</td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center - AI Chat */}
                <div className="w-full md:w-1/3 min-w-[320px] max-w-[480px] p-4">
                  <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={toggleChatHistory}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                            title="View Chat History"
                          >
                            <FaHistory size={16} />
                          </button>
                          <div className="flex items-center">
                            <FaRobot className="text-white mr-2" size={20} />
                            <h3 className="text-lg font-semibold text-white whitespace-nowrap">AI Counselor Chat</h3>
                          </div>
                        </div>
                        <div className="text-xs text-white/80">
                          {showChatHistory ? "Select a conversation" : "Active session"}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      <div className="max-w-[80%] bg-white text-gray-800 p-4 rounded-lg shadow border border-gray-100 text-sm">
                        <span>
                          <Typewriter
                            words={[
                              'Select your recent mood, activity, assessments, and game performance to help the AI counselor deliver personalized and research-backed support. Then click "Start Chat" to begin your session'
                            ]}
                            loop={false}
                            cursor
                            cursorStyle="_"
                            typeSpeed={40}
                            deleteSpeed={0}
                            delaySpeed={1000}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="bg-white p-3 border-t border-gray-200">
                      <form onSubmit={sendMessage} className="flex items-center">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white p-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center"
                          style={{ width: '48px' }}
                        >
                          <FaPaperPlane size={16} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Right side - Mood Tracking & Routine */}
                <div className="w-full md:w-1/3 min-w-[340px] max-w-[420px] p-4 bg-blue-50">
                  {/* 1st part: Mood History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-blue-900">Mood History</h3>
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={moodDays}
                        onChange={e => setMoodDays(Number(e.target.value))}
                      >
                        <option value={2}>2 days</option>
                        <option value={5}>5 days</option>
                        <option value={7}>7 days</option>
                        <option value={10}>10 days</option>
                      </select>
                    </div>
                    <div className="overflow-x-auto">
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Date</th>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Mood</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {loadingMood ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">Loading...</td></tr>
                            ) : filterByDays(moodHistory, moodDays).length === 0 ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">No mood logs found.</td></tr>
                            ) : (
                              filterByDays(moodHistory, moodDays).map((mood) => (
                                <tr key={mood.id} className="hover:bg-gray-50">
                                  <td className="py-2 px-3 text-sm text-gray-700">{mood.date}</td>
                                  <td className="py-2 px-3 text-sm text-gray-700">{mood.mood}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* 2nd part: Activity History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-blue-900">Activity History</h3>
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                        value={activityDays}
                        onChange={e => setActivityDays(Number(e.target.value))}
                      >
                        <option value={2}>2 days</option>
                        <option value={5}>5 days</option>
                        <option value={7}>7 days</option>
                        <option value={10}>10 days</option>
                      </select>
                    </div>
                    <div className="overflow-x-auto">
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Date</th>
                              <th className="py-2 px-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">Activity</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {loadingActivity ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">Loading...</td></tr>
                            ) : filterByDays(activityHistory, activityDays).length === 0 ? (
                              <tr><td colSpan="2" className="text-center text-gray-400 py-4">No activity logs found.</td></tr>
                            ) : (
                              filterByDays(activityHistory, activityDays).map((activity) => (
                                <tr key={activity.id} className="hover:bg-gray-50">
                                  <td className="py-2 px-3 text-sm text-gray-700">{activity.date}</td>
                                  <td className="py-2 px-3 text-sm text-gray-700">{activity.activity}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={handleSubmit}
                    >
                      Start Chat
                    </button>
                    <p className="text-xs text-gray-600 text-center mt-2">
                      Get personalized routine based on your assessments and mood
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AICounselor; 