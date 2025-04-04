import React, { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaTimes, 
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
  FaTasks
} from 'react-icons/fa';

const UserDashboard = () => {
  // Dummy user data
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    age: 28,
    joinDate: '2023-09-15',
    lastActive: '2024-03-10'
  });

  // Updated dummy assessment data with 6 assessments
  const [assessments] = useState([
    {
      id: 1,
      type: 'Depression Assessment',
      icon: <FaBrain className="w-6 h-6 text-blue-500" />,
      date: '2024-03-01',
      score: 12,
      severity: 'Mild',
      recommendations: 'Regular exercise and meditation recommended',
      nextAssessment: '2024-04-01'
    },
    {
      id: 2,
      type: 'Anxiety Screening',
      icon: <FaHeartbeat className="w-6 h-6 text-red-500" />,
      date: '2024-02-15',
      score: 8,
      severity: 'Moderate',
      recommendations: 'Consider breathing exercises and stress management techniques',
      nextAssessment: '2024-03-15'
    },
    {
      id: 3,
      type: 'Sleep Quality Assessment',
      icon: <FaBed className="w-6 h-6 text-purple-500" />,
      date: '2024-02-01',
      score: 15,
      severity: 'Poor',
      recommendations: 'Establish consistent sleep schedule and bedtime routine',
      nextAssessment: '2024-03-01'
    },
    {
      id: 4,
      type: 'Mental Wellbeing Check',
      icon: <FaSmile className="w-6 h-6 text-yellow-500" />,
      date: '2024-02-20',
      score: 18,
      severity: 'Good',
      recommendations: 'Continue current wellness practices and social activities',
      nextAssessment: '2024-03-20'
    },
    {
      id: 5,
      type: 'Physical Activity Level',
      icon: <FaRunning className="w-6 h-6 text-green-500" />,
      date: '2024-02-10',
      score: 7,
      severity: 'Moderate',
      recommendations: 'Increase daily physical activity and set exercise goals',
      nextAssessment: '2024-03-10'
    },
    {
      id: 6,
      type: 'Work-Life Balance',
      icon: <FaBalanceScale className="w-6 h-6 text-teal-500" />,
      date: '2024-02-05',
      score: 6,
      severity: 'Needs Improvement',
      recommendations: 'Set clear boundaries between work and personal time',
      nextAssessment: '2024-03-05'
    }
  ]);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeleteAssessment = (id) => {
    // Handle deletion logic here
    console.log('Delete assessment:', id);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <FaUser className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                  <p className="text-teal-100">Member since {userData.joinDate}</p>
                </div>
              </div>
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 backdrop-blur-sm transition-colors">
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <FaEnvelope className="text-teal-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-700">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaPhone className="text-teal-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-700">{userData.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FaCalendarAlt className="text-teal-500 w-5 h-5" />
              <div>
                <p className="text-sm text-gray-500">Last Active</p>
                <p className="text-gray-700">{userData.lastActive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessments Section - 6 tables in two rows */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {assessment.icon}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{assessment.type}</h3>
                        <p className="text-sm text-gray-500">Taken on {assessment.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAssessment(assessment.id)}
                      className="w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Score</p>
                      <p className="text-lg font-semibold text-gray-800">{assessment.score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Severity</p>
                      <p className="text-lg font-semibold text-gray-800">{assessment.severity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Assessment</p>
                      <p className="text-lg font-semibold text-gray-800">{assessment.nextAssessment}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Recommendations</p>
                    <p className="text-gray-700">{assessment.recommendations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Tracking Section - Chart and Table side by side */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Mood Trends</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart Card */}
            <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
              <div className="flex justify-between mb-5">
                <div>
                  <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">{averageMood.toFixed(1)}</h5>
                  <p className="text-base font-normal text-gray-500 dark:text-gray-400">Average Mood Score</p>
                </div>
                <div className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                  {moodChange}%
                  <FaArrowUp className="w-3 h-3 ms-1" />
                </div>
              </div>
              
              {/* Pie Chart */}
              <div className="h-64 w-full flex items-center justify-center mb-4">
                <div className="relative w-48 h-48">
                  {pieChartData.map((item, index) => {
                    const percentage = parseFloat(item.percentage);
                    const offset = pieChartData
                      .slice(0, index)
                      .reduce((sum, curr) => sum + parseFloat(curr.percentage), 0);
                    
                    return (
                      <div 
                        key={index}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((offset * 3.6) * Math.PI / 180) * 50}% ${50 + Math.sin((offset * 3.6) * Math.PI / 180) * 50}%, ${50 + Math.cos(((offset + percentage) * 3.6) * Math.PI / 180) * 50}% ${50 + Math.sin(((offset + percentage) * 3.6) * Math.PI / 180) * 50}%)`,
                          backgroundColor: pieColors[index % pieColors.length],
                          transform: `rotate(${offset * 3.6}deg)`,
                        }}
                      >
                        {percentage > 10 && (
                          <span className="text-white text-xs font-bold">
                            {item.percentage}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {pieChartData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: pieColors[index % pieColors.length] }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.mood}</span>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-5">
                <div className="flex justify-between items-center pt-5">
                  <button
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                    type="button">
                    Last 7 days
                    <svg className="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                  </button>
                  <a
                    href="#"
                    className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                    View Report
                    <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Mood History Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Mood History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mood</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {moodData.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.mood}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.score}/10</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{entry.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
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