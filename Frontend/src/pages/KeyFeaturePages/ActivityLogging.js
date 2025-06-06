import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { FaTrash, FaBriefcase, FaGamepad, FaDumbbell, FaBook, FaCode, FaUtensils, FaBed, FaRegClock } from 'react-icons/fa';

export default function ActivityLogging() {
  const { userInfo } = useContext(UserContext);
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [activityEntries, setActivityEntries] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/activity-logging' } });
    } else {
      // Fetch activity history from backend
      const fetchActivityHistory = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`
              }
            }
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
          // Optionally handle error
        }
      };
      fetchActivityHistory();
    }
  }, [userInfo, navigate]);

  const handleActivitySubmit = async () => {
    if (activity) {
      const payload = {
        activity,
        notes,
        time: new Date().toISOString(),
      };
      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/activity/addactivity/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        // Refetch activity history after successful POST
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
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
        setActivity('');
        setNotes('');
      } catch (err) {
        alert('Failed to log activity. Please try again.');
      }
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity log?')) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/activity/delactivity/${activityId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      // Refetch activity history after delete
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
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
      alert('Failed to delete activity log. Please try again.');
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-10 px-2 md:px-0 flex flex-col items-center">
      <h2 className="text-4xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight drop-shadow">Activity Logging</h2>
      {/* Icon Row */}
      <div className="flex flex-row justify-center items-center gap-6 mb-6 mt-2">
        <div className="flex flex-col items-center group">
          <FaBriefcase className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Work" />
          <span className="text-xs text-gray-500 mt-1">Work</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaGamepad className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Play" />
          <span className="text-xs text-gray-500 mt-1">Play</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaDumbbell className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Workout" />
          <span className="text-xs text-gray-500 mt-1">Workout</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaBook className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Study" />
          <span className="text-xs text-gray-500 mt-1">Study</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaCode className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Coding" />
          <span className="text-xs text-gray-500 mt-1">Coding</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaUtensils className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Eating" />
          <span className="text-xs text-gray-500 mt-1">Eating</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaBed className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Sleeping" />
          <span className="text-xs text-gray-500 mt-1">Sleeping</span>
        </div>
        <div className="flex flex-col items-center group">
          <FaRegClock className="w-7 h-7 text-indigo-600 group-hover:text-indigo-800 transition" title="Idle" />
          <span className="text-xs text-gray-500 mt-1">Idle</span>
        </div>
      </div>
      <p className="text-lg text-gray-500 mb-8 text-center max-w-2xl">Log your daily activities and keep track of your productivity and habits. Review your activity history to see your progress over time.</p>
      <div className="flex flex-col md:flex-row gap-10 w-full max-w-5xl items-start">
        {/* Activity Log Form */}
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-indigo-100 w-full max-w-sm flex flex-col items-stretch md:mb-0 mb-8">
          <h3 className="text-2xl font-semibold mb-3 text-indigo-600 text-center">What did you do?</h3>
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            placeholder="Activity Title"
            className="w-full p-2 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-2"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Activity Notes"
            className="w-full p-2 rounded-lg border border-gray-300 text-base min-h-[70px] resize-y focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition mb-2"
          ></textarea>
          <button onClick={handleActivitySubmit} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition text-base shadow-md">Log Activity</button>
        </div>
        {/* Activity History Table */}
        <div className="bg-white p-8 rounded-2xl shadow-xl flex-1 border border-indigo-100 min-w-[420px] max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
            <div>
              <h3 className="text-2xl font-semibold text-indigo-600">Activity History</h3>
              <p className="text-gray-500 text-sm">Your recent activity logs</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            {activityEntries.length === 0 ? (
              <div className="text-center text-gray-400 py-12 text-lg">No activity logs yet. Start by logging your activity!</div>
            ) : (
              <table className="w-full bg-white rounded-lg shadow-md border border-gray-100">
                <thead className="sticky top-0 z-10 bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-indigo-700 font-semibold">Date & Time</th>
                    <th className="px-4 py-3 text-left text-indigo-700 font-semibold">Activity</th>
                    <th className="px-4 py-3 text-left text-indigo-700 font-semibold max-w-xs">Notes</th>
                    <th className="px-4 py-3 text-center text-indigo-700 font-semibold">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {activityEntries.map((entry, index) => (
                    <tr
                      key={entry.id || index}
                      className="bg-white even:bg-indigo-50 hover:bg-indigo-100 transition-all duration-200 group"
                    >
                      <td className="px-4 py-3 rounded-l-lg text-gray-700 font-medium align-middle whitespace-nowrap">{entry.date} {entry.time || ''}</td>
                      <td className="px-4 py-3 text-gray-600 align-middle capitalize">{entry.activity}</td>
                      <td className="px-4 py-3 rounded-r-lg text-gray-500 align-middle max-w-xs overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-indigo-50" style={{maxWidth:'180px'}} title={entry.notes}>{entry.notes}</td>
                      <td className="px-4 py-3 text-center align-middle">
                        <button
                          onClick={() => handleDeleteActivity(entry.id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition group-hover:scale-110 shadow-sm border border-red-100"
                          title="Delete this activity log"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
