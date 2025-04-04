import React, { useState } from 'react';
import { FaArrowLeft, FaCheck, FaClock, FaHeart, FaBrain, FaRunning, FaMoon, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Routine = () => {
  // Dummy routine data based on user's assessments and mood
  const [routine, setRoutine] = useState({
    title: 'Personalized Wellness Routine',
    description: 'This routine is tailored based on your depression screening results, anxiety assessment, and recent mood tracking data.',
    dailySchedule: [
      { 
        id: 1, 
        time: '7:00 AM', 
        activity: 'Morning Meditation', 
        duration: '15 minutes',
        icon: <FaBrain className="text-purple-500" />,
        description: 'Start your day with mindfulness meditation to reduce anxiety and improve focus.',
        completed: false
      },
      { 
        id: 2, 
        time: '8:00 AM', 
        activity: 'Light Exercise', 
        duration: '30 minutes',
        icon: <FaRunning className="text-green-500" />,
        description: 'Gentle cardio to boost your mood and energy levels for the day.',
        completed: false
      },
      { 
        id: 3, 
        time: '12:30 PM', 
        activity: 'Mindful Lunch Break', 
        duration: '45 minutes',
        icon: <FaHeart className="text-red-500" />,
        description: 'Take a proper break from work to eat mindfully and practice gratitude.',
        completed: false
      },
      { 
        id: 4, 
        time: '3:00 PM', 
        activity: 'Stress Relief Session', 
        duration: '20 minutes',
        icon: <FaBrain className="text-blue-500" />,
        description: 'Deep breathing exercises and progressive muscle relaxation to manage afternoon stress.',
        completed: false
      },
      { 
        id: 5, 
        time: '6:00 PM', 
        activity: 'Evening Walk', 
        duration: '30 minutes',
        icon: <FaRunning className="text-green-500" />,
        description: 'A relaxing walk to decompress from the day and improve sleep quality.',
        completed: false
      },
      { 
        id: 6, 
        time: '9:00 PM', 
        activity: 'Sleep Preparation', 
        duration: '30 minutes',
        icon: <FaMoon className="text-indigo-500" />,
        description: 'Screen-free time with light stretching and reading to prepare for restful sleep.',
        completed: false
      }
    ],
    weeklyGoals: [
      { id: 1, text: 'Complete 5 meditation sessions', completed: false },
      { id: 2, text: 'Log mood 3 times daily', completed: false },
      { id: 3, text: 'Exercise for at least 150 minutes', completed: false },
      { id: 4, text: 'Practice gratitude journaling', completed: false },
      { id: 5, text: 'Get 7-8 hours of sleep 5 nights', completed: false }
    ]
  });

  // Toggle activity completion
  const toggleActivity = (id) => {
    setRoutine({
      ...routine,
      dailySchedule: routine.dailySchedule.map(activity => 
        activity.id === id ? { ...activity, completed: !activity.completed } : activity
      )
    });
  };

  // Toggle goal completion
  const toggleGoal = (id) => {
    setRoutine({
      ...routine,
      weeklyGoals: routine.weeklyGoals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 p-4">
            <div className="flex items-center">
              <Link to="/ai-counselor" className="text-white mr-4">
                <FaArrowLeft />
              </Link>
              <h1 className="text-2xl font-bold text-white">Your Personalized Routine</h1>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{routine.title}</h2>
              <p className="text-gray-600">{routine.description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaClock className="mr-2 text-green-600" />
                Daily Schedule
              </h3>
              
              <div className="space-y-4">
                {routine.dailySchedule.map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`p-4 rounded-lg border ${
                      activity.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    } shadow-sm`}
                  >
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-800">{activity.activity}</h4>
                            <p className="text-sm text-gray-500">{activity.time} • {activity.duration}</p>
                          </div>
                          <button 
                            onClick={() => toggleActivity(activity.id)}
                            className={`p-1 rounded-full ${
                              activity.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            <FaCheck size={14} />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaSun className="mr-2 text-yellow-500" />
                Weekly Goals
              </h3>
              
              <div className="space-y-2">
                {routine.weeklyGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className={`p-3 rounded-lg border ${
                      goal.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-gray-200'
                    } shadow-sm flex items-center`}
                  >
                    <button 
                      onClick={() => toggleGoal(goal.id)}
                      className={`mr-3 p-1 rounded-full ${
                        goal.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <FaCheck size={14} />
                    </button>
                    <span className={`text-sm ${
                      goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                    }`}>
                      {goal.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routine; 