import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { FaTrash, FaBriefcase, FaGamepad, FaDumbbell, FaBook, FaCode, FaUtensils, FaBed, FaRegClock } from 'react-icons/fa';

export default function ActivityLogging() {
  const { userInfo } = useContext(UserContext);
  const [activity, setActivity] = useState('');
  const [notes, setNotes] = useState('');
  const [activityEntries, setActivityEntries] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 8;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/activity-logging' } });
    } else {
      const fetchActivityHistory = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          const arr = Array.isArray(res.data) ? res.data : res.data.activities || [];
          setActivityEntries(
            arr.map(entry => {
              const d = new Date(entry.time);
              return {
                id: entry._id,
                activity: entry.activity,
                notes: entry.notes,
                date: d.toLocaleDateString(),
                time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            })
          );
        } catch (err) {
          console.error('Error fetching activity history:', err);
        }
      };
      fetchActivityHistory();
    }
  }, [userInfo, navigate]);

  const handleActivitySubmit = async () => {
    if (!activity) return;
    const payload = { activity, notes, time: new Date().toISOString() };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/activity/addactivity/`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      // refresh list
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const arr = Array.isArray(res.data) ? res.data : res.data.activities || [];
      setActivityEntries(
        arr.map(entry => {
          const d = new Date(entry.time);
          return {
            id: entry._id,
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
  };

  const handleDeleteActivity = async id => {
    if (!window.confirm('Delete this activity log?')) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/activity/delactivity/${id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/activity/getactivity/`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const arr = Array.isArray(res.data) ? res.data : res.data.activities || [];
      setActivityEntries(
        arr.map(entry => {
          const d = new Date(entry.time);
          return {
            id: entry._id,
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
    <section className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-8 px-4 sm:px-2 md:px-0 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight">
        Activity Logging
      </h2>
      <div className="flex flex-wrap justify-center gap-6 mb-6 mt-2">
        {[
          { icon: <FaBriefcase />, label: 'Work' },
          { icon: <FaGamepad />, label: 'Play' },
          { icon: <FaDumbbell />, label: 'Workout' },
          { icon: <FaBook />, label: 'Study' },
          { icon: <FaCode />, label: 'Coding' },
          { icon: <FaUtensils />, label: 'Eating' },
          { icon: <FaBed />, label: 'Sleeping' },
          { icon: <FaRegClock />, label: 'Idle' }
        ].map(({ icon, label }, idx) => (
          <div key={idx} className="flex flex-col items-center group w-16">
            {React.cloneElement(icon, { className: 'w-6 h-6 text-indigo-600 group-hover:text-indigo-800 transition' })}
            <span className="text-xs text-gray-500 mt-1 truncate">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-base sm:text-lg text-gray-500 mb-8 text-center max-w-md sm:max-w-2xl">
        Log your daily activities and keep track of your productivity and habits.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Form */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100 w-full max-w-sm">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-indigo-600 text-center">
            What did you do?
          </h3>
          <input
            type="text"
            value={activity}
            onChange={e => setActivity(e.target.value)}
            placeholder="Activity Title"
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-indigo-400 transition mb-4"
          />
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Activity Notes (You must add both Title and Notes)"
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-base min-h-[70px] resize-y focus:ring-2 focus:ring-indigo-400 transition mb-4"
          />
          <button
            onClick={handleActivitySubmit}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-base shadow-md"
          >
            Log Activity
          </button>
        </div>

        {/* History */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-indigo-600">
              Activity History
            </h3>
            <p className="text-gray-500 text-sm">
              Your recent logs
            </p>
          </div>
          <div className="overflow-x-auto">
            {activityEntries.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-base">
                No activity logs yet.
              </div>
            ) : (
              <>
                <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-100">
                  <thead className="sticky top-0 z-10 bg-indigo-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left text-indigo-700 font-semibold text-sm">
                        Date & Time
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-left text-indigo-700 font-semibold text-sm">
                        Activity
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-left text-indigo-700 font-semibold text-sm max-w-[120px] sm:max-w-xs">
                        Notes
                      </th>
                      <th className="px-2 sm:px-4 py-2 text-center text-indigo-700 font-semibold text-sm">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityEntries.slice(page * pageSize, (page + 1) * pageSize).map((entry, idx) => (
                      <tr key={idx} className="bg-white even:bg-indigo-50 hover:bg-indigo-100 transition-all duration-200">
                        <td className="px-2 sm:px-4 py-2 text-gray-700 text-sm whitespace-nowrap">
                          {entry.date} {entry.time}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-gray-600 text-sm capitalize">
                          {entry.activity}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-gray-500 text-sm max-w-[120px] sm:max-w-xs overflow-hidden truncate" title={entry.notes}>
                          {entry.notes}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          <button onClick={() => handleDeleteActivity(entry.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition shadow-sm border border-red-100">
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-between mt-4">
                  <button onClick={() => setPage(page - 1)} disabled={page === 0} className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm disabled:opacity-50">
                    Previous
                  </button>
                  <button onClick={() => setPage(page + 1)} disabled={(page + 1) * pageSize >= activityEntries.length} className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm disabled:opacity-50">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
