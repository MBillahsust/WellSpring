import React, { useState, useEffect, useContext } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import {
  FaEdit,
  FaTrash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaLeaf,
  FaArrowUp,
  FaBrain,
  FaHeartbeat,
  FaBed,
  FaSmile,
  FaRunning,
  FaBalanceScale,
  FaClock,
  FaCheck,
  FaTasks,
  FaUsers,
  FaBolt,
  FaClipboardCheck,
  FaSync,
  FaShieldAlt
} from 'react-icons/fa';
import { UserContext } from '../UserContext';
import axios from 'axios';
import MoodChart from '../Components/MoodChart';
import ActivityPieChart from '../Components/ActivityPieChart';

const UserDashboard = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [assessments, setAssessments] = useState([]);

  // Sample mood data - replace with actual data from your backend
  const [moodData] = useState([
    { date: '2024-03-01', mood: 'Happy', score: 7, notes: 'Had a great day at work' },
    { date: '2024-03-02', mood: 'Anxious', score: 4, notes: 'Upcoming presentation' },
    { date: '2024-03-03', mood: 'Calm', score: 6, notes: 'Meditation helped' },
    { date: '2024-03-04', mood: 'Stressed', score: 3, notes: 'Deadline pressure' },
    { date: '2024-03-05', mood: 'Content', score: 6, notes: 'Regular day' },
    { date: '2024-03-06', mood: 'Happy', score: 8, notes: 'Weekend plans' },
    { date: '2024-03-07', mood: 'Tired', score: 5, notes: 'Poor sleep' }
  ]);

  // Dummy routine data
  const [routineData] = useState([
    {
      id: 1,
      time: '06:00 AM',
      activity: 'Morning Meditation',
      duration: '15 mins',
      status: 'Completed',
      category: 'Wellness',
      priority: 'High'
    },
    {
      id: 2,
      time: '07:00 AM',
      activity: 'Exercise',
      duration: '45 mins',
      status: 'Pending',
      category: 'Physical Health',
      priority: 'High'
    },
    {
      id: 3,
      time: '09:00 AM',
      activity: 'Work Focus Block',
      duration: '2 hours',
      status: 'In Progress',
      category: 'Work',
      priority: 'High'
    },
    {
      id: 4,
      time: '12:00 PM',
      activity: 'Lunch Break & Short Walk',
      duration: '45 mins',
      status: 'Pending',
      category: 'Health',
      priority: 'Medium'
    },
    {
      id: 5,
      time: '03:00 PM',
      activity: 'Therapy Session',
      duration: '1 hour',
      status: 'Scheduled',
      category: 'Mental Health',
      priority: 'High'
    },
    {
      id: 6,
      time: '05:00 PM',
      activity: 'Evening Journal',
      duration: '15 mins',
      status: 'Pending',
      category: 'Wellness',
      priority: 'Medium'
    }
  ]);

  const [isClient, setIsClient] = useState(false);
  const [moodEntries, setMoodEntries] = useState([]);
  const [activityEntries, setActivityEntries] = useState([]);

  // Pagination state for mood and activity tables
  const [moodPage, setMoodPage] = useState(0);
  const [activityPage, setActivityPage] = useState(0);
  const pageSize = 8;

  // Use backend URL from env
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const [assessmentPage, setAssessmentPage] = useState(0);

  // Mood score mapping
  const moodScoreMap = {
    happy: 1,
    content: 2,
    calm: 3,
    relaxed: 4,
    grateful: 5,
    hopeful: 6,
    confident: 7,
    energetic: 8,
    excited: 9,
    bored: -1,
    meh: -2,
    indifferent: -3,
    numb: -4,
    tired: -5,
    sad: -6,
    lonely: -7,
    anxious: -8,
    stressed: -9,
    frustrated: -10,
    overwhelmed: -11,
    angry: -12,
    guilty: -13,
    insecure: -14,
    embarrassed: -15,
    jealous: -16
  };

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/dashboard' } });
      return;
    }
    setIsClient(true);
    const fetchUserProfile = async () => {
      setLoadingUser(true);
      try {
        console.log('Fetching user profile from:', `${BACKEND_URL}/auth/User`);
        console.log('Token used:', userInfo.token);
        const res = await axios.get(
          `${BACKEND_URL}/auth/User`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        console.log('User profile raw response:', res.data);
        // Try both possible response shapes
        setUserData(res.data.user || res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setUserData(null);
      } finally {
        setLoadingUser(false);
      }
    };
    // Fetch mood history
    const fetchMoodHistory = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/mood/getMood/`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const moodArray = Array.isArray(res.data) ? res.data : (res.data.moods || []);
        setMoodEntries(
          moodArray.map(entry => {
            const d = new Date(entry.time);
            return {
              id: entry.id,
              mood: entry.mood,
              notes: entry.notes,
              date: d.toLocaleDateString(),
              time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          })
        );
      } catch (err) {
        setMoodEntries([]);
      }
    };
    // Fetch activity history
    const fetchActivityHistory = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/activity/getactivity/`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        const arr = Array.isArray(res.data) ? res.data : (res.data.activities || []);
        setActivityEntries(
          arr.map(entry => {
            const d = new Date(entry.time);
            return {
              id: entry.id,
              activity: entry.activity,
              notes: entry.notes,
              date: d.toLocaleDateString(),
              time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          })
        );
      } catch (err) {
        setActivityEntries([]);
      }
    };
    const fetchAssessments = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/addassesment/getassessments`,
          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        console.log('Assessment raw response:', res.data);
        // Accept both array and object responses
        let arr = Array.isArray(res.data) ? res.data : (res.data.assessments || []);
        if (!Array.isArray(arr)) arr = [];
        setAssessments(arr.map(a => {
          // Exact icon mapping as in assessment pages
          let icon = null;
          const typeName = (a.assessmentName || a.title || a.type || a.assessmentType || '').toLowerCase();
          if (typeName.includes('anxiety') && !typeName.includes('social')) icon = <FaHeartbeat className="w-7 h-7 text-indigo-500" title="Anxiety" />;
          else if (typeName.includes('depression')) icon = <FaBrain className="w-7 h-7 text-indigo-500" title="Depression" />;
          else if (typeName.includes('stress')) icon = <FaBalanceScale className="w-7 h-7 text-indigo-500" title="Stress" />;
          else if (typeName.includes('social')) icon = <FaUsers className="w-7 h-7 text-indigo-500" title="Social Anxiety" />;
          else if (typeName.includes('panic')) icon = <FaBolt className="w-7 h-7 text-indigo-500" title="Panic" />;
          else if (typeName.includes('adhd')) icon = <FaClipboardCheck className="w-7 h-7 text-indigo-500" title="ADHD" />;
          else if (typeName.includes('ocd')) icon = <FaSync className="w-7 h-7 text-indigo-500" title="OCD" />;
          else if (typeName.includes('ptsd')) icon = <FaShieldAlt className="w-7 h-7 text-indigo-500" title="PTSD" />;
          else icon = <FaTasks className="w-7 h-7 text-indigo-400" title="Assessment" />;

          // Date and time formatting
          let dateStr = '-';
          let timeStr = '';
          if (a.takenAt || a.createdAt) {
            const d = new Date(a.takenAt || a.createdAt);
            dateStr = d.toLocaleDateString();
            timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } else if (a.date) {
            dateStr = a.date;
          }

          return {
            id: a.id,
            type: a.assessmentName || a.title || a.type || a.assessmentType || 'Assessment',
            icon,
            date: dateStr,
            time: timeStr,
            score: a.assessmentScore !== undefined ? (a.assessmentMaxScore ? `${a.assessmentScore} / ${a.assessmentMaxScore}` : a.assessmentScore) : (a.score || '-'),
            severity: a.assessmentResult || a.severity || '-',
            recommendations: a.recommendation || a.assessmentRecommendation || a.recommendations || '-'
          };
        }));
      } catch (err) {
        console.error('Error fetching assessments:', err);
        setAssessments([]);
      }
    };
    fetchUserProfile();
    fetchMoodHistory();
    fetchActivityHistory();
    fetchAssessments();
  }, [userInfo, navigate]);

  // Reset assessmentPage if assessments change and current page is out of range
  useEffect(() => {
    if (assessmentPage * 6 >= assessments.length) {
      setAssessmentPage(0);
    }
  }, [assessments]);

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    try {
      await axios.delete(
        `${BACKEND_URL}/addassesment/assessments/${id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      // Refetch assessments after delete
      const res = await axios.get(
        `${BACKEND_URL}/addassesment/getassessments`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      let arr = Array.isArray(res.data) ? res.data : (res.data.assessments || []);
      if (!Array.isArray(arr)) arr = [];
      setAssessments(arr.map(a => {
        // Exact icon mapping as in assessment pages
        let icon = null;
        const typeName = (a.assessmentName || a.title || a.type || a.assessmentType || '').toLowerCase();
        if (typeName.includes('anxiety') && !typeName.includes('social')) icon = <FaHeartbeat className="w-7 h-7 text-indigo-500" title="Anxiety" />;
        else if (typeName.includes('depression')) icon = <FaBrain className="w-7 h-7 text-indigo-500" title="Depression" />;
        else if (typeName.includes('stress')) icon = <FaBalanceScale className="w-7 h-7 text-indigo-500" title="Stress" />;
        else if (typeName.includes('social')) icon = <FaUsers className="w-7 h-7 text-indigo-500" title="Social Anxiety" />;
        else if (typeName.includes('panic')) icon = <FaBolt className="w-7 h-7 text-indigo-500" title="Panic" />;
        else if (typeName.includes('adhd')) icon = <FaClipboardCheck className="w-7 h-7 text-indigo-500" title="ADHD" />;
        else if (typeName.includes('ocd')) icon = <FaSync className="w-7 h-7 text-indigo-500" title="OCD" />;
        else if (typeName.includes('ptsd')) icon = <FaShieldAlt className="w-7 h-7 text-indigo-500" title="PTSD" />;
        else icon = <FaTasks className="w-7 h-7 text-indigo-400" title="Assessment" />;
        // Date and time formatting
        let dateStr = '-';
        let timeStr = '';
        if (a.takenAt || a.createdAt) {
          const d = new Date(a.takenAt || a.createdAt);
          dateStr = d.toLocaleDateString();
          timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (a.date) {
          dateStr = a.date;
        }
        return {
          id: a.id,
          type: a.assessmentName || a.title || a.type || a.assessmentType || 'Assessment',
          icon,
          date: dateStr,
          time: timeStr,
          score: a.assessmentScore !== undefined ? (a.assessmentMaxScore ? `${a.assessmentScore} / ${a.assessmentMaxScore}` : a.assessmentScore) : (a.score || '-'),
          severity: a.assessmentResult || a.severity || '-',
          recommendations: a.recommendation || a.assessmentRecommendation || a.recommendations || '-'
        };
      }));
    } catch (err) {
      alert('Failed to delete assessment. Please try again.');
    }
  };

  // Calculate average mood score
  const averageMood = moodData.reduce((acc, curr) => acc + curr.score, 0) / moodData.length;
  const moodChange = ((moodData[moodData.length - 1].score - moodData[0].score) / moodData[0].score * 100).toFixed(1);

  // Generate pie chart data
  const moodCounts = moodData.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: ((count / moodData.length) * 100).toFixed(1)
  }));

  // Colors for pie chart
  const pieColors = [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#6B7280'  // gray
  ];

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get priority color
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  // Add categorization helper (same as backend)
  function categorizeActivity(title) {
    const t = title?.toLowerCase?.() || '';
    const mental = [
      'study', 'problem', 'read', 'plan', 'work', 'computer', 'teach', 'meeting', 'decision', 'analyz', 'manage emotion', 'learn', 'reason', 'think'
    ];
    const physical = [
      'walk', 'exercise', 'sport', 'lift', 'clean', 'garden', 'dance', 'cook', 'commute', 'labor', 'run', 'jog', 'swim', 'yoga', 'bike', 'cycling'
    ];
    const spiritual = [
      'prayer', 'meditat', 'religious', 'spiritual', 'mindful', 'contemplat', 'compassion', 'worship', 'faith', 'reflection'
    ];
    const social = [
      'convers', 'gather', 'team', 'call', 'family', 'help', 'group', 'event', 'social media', 'friend', 'meet', 'chat', 'party', 'hangout', 'neighbor'
    ];
    const emotional = [
      'journal', 'emotional', 'therapy', 'cry', 'laugh', 'love', 'anger', 'feel', 'express', 'vent', 'counsel', 'support', 'session'
    ];
    const creative = [
      'draw', 'write', 'paint', 'design', 'play instrument', 'sing', 'act', 'craft', 'create', 'art', 'music', 'compose', 'sculpt', 'photograph', 'film'
    ];
    if (mental.some(k => t.includes(k))) return 'Mental Activities';
    if (physical.some(k => t.includes(k))) return 'Physical Activities';
    if (spiritual.some(k => t.includes(k))) return 'Spiritual Activities';
    if (social.some(k => t.includes(k))) return 'Social Activities';
    if (emotional.some(k => t.includes(k))) return 'Emotional Activities';
    if (creative.some(k => t.includes(k))) return 'Creative Activities';
    return 'Other';
  }

  // Compute pie chart data from last 10 activity entries (most recent first)
  const last10 = activityEntries.slice(0, 10);
  console.log('Last 10 activities (most recent first):', last10.map(a => ({ title: a.activity, category: categorizeActivity(a.activity) })));
  const counts = {
    'Mental Activities': 0,
    'Physical Activities': 0,
    'Spiritual Activities': 0,
    'Social Activities': 0,
    'Emotional Activities': 0,
    'Creative Activities': 0,
    'Other': 0
  };
  last10.forEach(a => {
    const cat = categorizeActivity(a.activity);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  const activityPieData = Object.entries(counts).map(([category, value]) => ({ category, value }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-indigo-100">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6">
            <div className="flex flex-wrap items-start justify-start gap-4">
              {/* User Info Section */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaUser className="w-10 h-10 text-white" />
                </div>
                <div>
                  {loadingUser ? (
                    <div className="h-6 w-32 bg-white/30 rounded animate-pulse mb-2"></div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-white">{userData?.name || '-'}</h1>
                      <p className="text-teal-100">
                        Member since{' '}
                        {userData?.createdAt
                          ? new Date(userData.createdAt).toLocaleDateString()
                          : '-'}
                      </p>
                    </>
                  )}
                </div>
              </div>

              

            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {userData === null && !loadingUser && (
              <div className="col-span-4 text-red-600 font-semibold">
                Failed to load user profile. Check console for details.
              </div>
            )}

            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-indigo-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700">
                  {loadingUser ? (
                    <span className="h-4 w-24 bg-gray-100 rounded animate-pulse inline-block"></span>
                  ) : (
                    userData?.email || '-'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaLeaf className="text-indigo-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="text-gray-700">
                  {loadingUser ? (
                    <span className="h-4 w-10 bg-gray-100 rounded animate-pulse inline-block"></span>
                  ) : userData?.weight ? (
                    `${userData.weight} kg`
                  ) : (
                    '-'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaLeaf className="text-indigo-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-gray-700">
                  {loadingUser ? (
                    <span className="h-4 w-10 bg-gray-100 rounded animate-pulse inline-block"></span>
                  ) : (
                    userData?.age || '-'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-indigo-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="text-gray-700">
                  {loadingUser ? (
                    <span className="h-4 w-16 bg-gray-100 rounded animate-pulse inline-block"></span>
                  ) : userData?.createdAt ? (
                    new Date(userData.createdAt).toLocaleDateString()
                  ) : (
                    '-'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Assessments Section - 6 tables in two rows */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessments.length === 0 ? (
              <div className="col-span-3 text-gray-400 text-center py-8">No assessments found.</div>
            ) : (
              assessments.slice(assessmentPage * 6, (assessmentPage + 1) * 6).map((assessment) => (
                <div key={assessment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        {assessment.icon}
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{assessment.type}</h3>
                          <p className="text-sm text-gray-500">Taken on {assessment.date} {assessment.time}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="w-9 h-9 flex items-center justify-center bg-indigo-50 hover:bg-indigo-200 text-indigo-500 hover:text-indigo-700 rounded-full transition group-hover:scale-110 shadow-sm border border-indigo-100"
                        title="Delete this assessment"
                      >
                        <FaTrash className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Score</p>
                        <p className="text-lg font-semibold text-gray-800">{assessment.score}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Result</p>
                        <p className="text-lg font-semibold text-gray-800">{assessment.severity}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Recommendations</p>
                      <div
                        className="text-gray-700 text-sm overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50"
                        style={{
                          maxHeight: '3rem',        // allows 2 lines max (1.5rem * 2)
                          lineHeight: '1.5rem',     // adjust to your font size
                          maxWidth: '320px',        // wider for more words per row
                          minWidth: '180px',
                          whiteSpace: 'normal',     // allow line wrapping
                          wordBreak: 'break-word',  // prevent overflow from long words
                          direction: 'ltr',         // ensure scrollbar is on the right
                        }}
                        title={assessment.recommendations}
                      >
                        {assessment.recommendations}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Assessment Pagination Controls */}
          {assessments.length > 6 && (
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setAssessmentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                disabled={assessmentPage === 0}
              >
                Previous
              </button>
              <button
                onClick={() => setAssessmentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                disabled={(assessmentPage + 1) * 6 >= assessments.length}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Mood Trends Section - replaced with two tables */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Mood & Activity Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Tracking Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <h2 className="text-xl font-bold text-gray-800 mb-4 p-4">Mood Tracking</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mood</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {moodEntries.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-gray-400 py-8">No mood logs yet.</td></tr>
                    ) : (
                      moodEntries.slice(moodPage * pageSize, (moodPage + 1) * pageSize).map((entry, index) => (
                        <tr key={entry.id || index} className="hover:bg-indigo-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.date} {entry.time}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">{entry.mood}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.notes}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {moodEntries.length > 0 && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setMoodPage(moodPage - 1)}
                      className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                      disabled={moodPage === 0}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setMoodPage(moodPage + 1)}
                      className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                      disabled={(moodPage + 1) * pageSize >= moodEntries.length}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Activity Logging Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <h2 className="text-xl font-bold text-gray-800 mb-4 p-4">Activity Logging</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activityEntries.length === 0 ? (
                      <tr><td colSpan="3" className="text-center text-gray-400 py-8">No activity logs yet.</td></tr>
                    ) : (
                      activityEntries.slice(activityPage * pageSize, (activityPage + 1) * pageSize).map((entry, index) => (
                        <tr key={entry.id || index} className="hover:bg-indigo-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.date} {entry.time}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 capitalize">{entry.activity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.notes}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {activityEntries.length > 0 && (
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setActivityPage(activityPage - 1)}
                      className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                      disabled={activityPage === 0}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setActivityPage(activityPage + 1)}
                      className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
                      disabled={(activityPage + 1) * pageSize >= activityEntries.length}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Mood Tracking Graph Segment - separate card */}
          <div className="bg-white rounded-xl shadow p-6 mt-8 mb-8">
            
              <h3 className="text-2xl font-bold mb-4 text-indigo-700">Mood Tracking Graph</h3>
              {(() => {
                // Sort by time descending (most recent first)
                const sorted = [...moodEntries].sort((a, b) => {
                  const da = new Date(a.date + ' ' + (a.time || ''));
                  const db = new Date(b.date + ' ' + (b.time || ''));
                  return db - da;
                });
                const chartData = sorted
                  .slice(0, 10)
                  .reverse()
                  .map(entry => {
                    const d = new Date(entry.date + ' ' + (entry.time || ''));
                    // Format as 'MMM DD' (e.g., Jun 07)
                    const dateLabel = !isNaN(d) ? d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' }) : String(entry.date);
                    // Format as 'HH:mm'
                    const timeLabel = !isNaN(d) ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (entry.time || '');
                    return {
                      date: dateLabel,
                      time: timeLabel,
                      score: Number(moodScoreMap[entry.mood?.toLowerCase()] ?? 0)
                    };
                  });
                return <MoodChart moodData={chartData} width={700} height={350} showTimeBelowDate={true} />;
              })()}
            </div>
          
        </div>


        {/* Activity Pie Chart Section */}
        <div className="bg-white rounded-xl shadow p-6 mt-10 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">Activity Pie Chart</h2>
          <ActivityPieChart data={activityPieData} />
        </div>

        {/* Daily Routine Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Daily Routine</h2>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FaEdit className="w-4 h-4" />
              <span>Edit Routine</span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {routineData.map((routine) => (
                      <tr key={routine.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex items-center space-x-2">
                            <FaClock className="text-gray-400" />
                            <span>{routine.time}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">{routine.activity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{routine.duration}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{routine.category}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`font-medium ${getPriorityColor(routine.priority)}`}>
                            {routine.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(routine.status)}`}>
                            {routine.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-green-500 transition-colors">
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-blue-500 transition-colors">
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                              <FaTimes className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        
        
      </div>
    </div>
  );
};

export default UserDashboard; 