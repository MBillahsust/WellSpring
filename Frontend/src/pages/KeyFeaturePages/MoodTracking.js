import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

export default function MoodTracking() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 8;

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/mood-tracking' } });
    } else {
      const fetchMoodHistory = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          const moodArray = Array.isArray(res.data) ? res.data : res.data.moods || [];
          setMoodEntries(
            moodArray.map(entry => {
              const d = new Date(entry.time);
              return {
                id: entry._id,
                mood: entry.mood,
                notes: entry.notes,
                date: d.toLocaleDateString(),
                time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
            })
          );
        } catch (err) {
          console.log('Error fetching mood history:', err);
        }
      };
      fetchMoodHistory();
    }
  }, [userInfo, navigate]);

  const handleMoodSubmit = async () => {
    if (!mood) return;
    const payload = { mood, notes, time: new Date().toISOString() };
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/mood/addmood/`,
        payload,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const moodArray = Array.isArray(res.data) ? res.data : res.data.moods || [];
      setMoodEntries(
        moodArray.map(entry => {
          const d = new Date(entry.time);
          return {
            id: entry._id,
            mood: entry.mood,
            notes: entry.notes,
            date: d.toLocaleDateString(),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        })
      );
      setMood('');
      setNotes('');
    } catch (err) {
      console.log('Error adding mood:', err);
      alert('Failed to log mood. Please try again.');
    }
  };

  const handleDeleteMood = async id => {
    if (!window.confirm('Delete this mood log?')) return;
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/mood/delmood/${id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      const moodArray = Array.isArray(res.data) ? res.data : res.data.moods || [];
      setMoodEntries(
        moodArray.map(entry => {
          const d = new Date(entry.time);
          return {
            id: entry._id,
            mood: entry.mood,
            notes: entry.notes,
            date: d.toLocaleDateString(),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        })
      );
    } catch (err) {
      console.log('Error deleting mood log:', err);
      alert('Failed to delete mood log. Please try again.');
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 py-8 px-4 sm:px-2 md:px-0 flex flex-col items-center">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-2 text-center text-indigo-700 tracking-tight">
        Mood Tracking
      </h2>
      <p className="text-base sm:text-lg text-gray-500 mb-8 text-center max-w-md sm:max-w-2xl">
        Log your mood and keep track of your emotional well-being.
      </p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-100 w-full max-w-sm">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-indigo-600 text-center">
            How are you feeling now?
          </h3>
          <select
            value={mood}
            onChange={e => setMood(e.target.value)}
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-base focus:ring-2 focus:ring-indigo-400 transition mb-4"
          >
            <option value="" disabled>Select your mood...</option>
            <option value="happy">Happy</option>
            <option value="excited">Excited</option>
            <option value="content">Content</option>
            <option value="grateful">Grateful</option>
            <option value="relaxed">Relaxed</option>
            <option value="energetic">Energetic</option>
            <option value="confident">Confident</option>
            <option value="hopeful">Hopeful</option>
            <option value="calm">Calm</option>
            <option value="bored">Bored</option>
            <option value="indifferent">Indifferent</option>
            <option value="tired">Tired</option>
            <option value="numb">Numb</option>
            <option value="meh">Meh</option>
            <option value="sad">Sad</option>
            <option value="anxious">Anxious</option>
            <option value="angry">Angry</option>
            <option value="stressed">Stressed</option>
            <option value="frustrated">Frustrated</option>
            <option value="lonely">Lonely</option>
            <option value="overwhelmed">Overwhelmed</option>
            <option value="guilty">Guilty</option>
            <option value="insecure">Insecure</option>
            <option value="embarrassed">Embarrassed</option>
            <option value="jealous">Jealous</option>
          </select>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Add notes about your mood..."
            className="w-full p-2 sm:p-3 rounded-lg border border-gray-300 text-base min-h-[70px] resize-y focus:ring-2 focus:ring-indigo-400 transition mb-4"
          />
          <button
            onClick={handleMoodSubmit}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 sm:py-3 rounded-lg transition text-base shadow-md"
          >
            Log Mood
          </button>
        </div>

        <div className="bg-white p-5 sm:p-8 rounded-2xl shadow-xl border border-indigo-100 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-indigo-600">
                Mood History
              </h3>
              <p className="text-gray-500 text-sm">
                Your recent mood logs
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            {moodEntries.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-base">
                No mood logs yet. Start by logging your mood!
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
                        Mood
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
                    {moodEntries.slice(page * pageSize, (page + 1) * pageSize).map((entry, idx) => (
                      <tr
                        key={entry.id || idx}
                        className="bg-white even:bg-indigo-50 hover:bg-indigo-100 transition-all duration-200"
                      >
                        <td className="px-2 sm:px-4 py-2 text-gray-700 text-sm">
                          {entry.date} {entry.time || ''}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-gray-600 text-sm capitalize">
                          {entry.mood}
                        </td>
                        <td
                          className="px-2 sm:px-4 py-2 text-gray-500 text-sm max-w-[120px] sm:max-w-xs overflow-hidden truncate"
                          title={entry.notes}
                        >
                          {entry.notes}
                        </td>
                        <td className="px-2 sm:px-4 py-2 text-center">
                          <button
                            onClick={() => handleDeleteMood(entry.id)}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition shadow-sm border border-red-100"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 0}
                    className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={(page + 1) * pageSize >= moodEntries.length}
                    className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-sm disabled:opacity-50"
                  >
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
