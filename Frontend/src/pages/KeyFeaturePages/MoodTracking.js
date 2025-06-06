import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';

export default function MoodTracking() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [moodEntries, setMoodEntries] = useState([]);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/mood-tracking' } });
    } else {
      // Fetch mood history from backend
      const fetchMoodHistory = async () => {
        try {
          console.log('Fetching mood history with token:', userInfo.token);
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
            {
              headers: {
                Authorization: `Bearer ${userInfo.token}`
              }
            }
          );
          console.log('Mood history response:', res.data);
          const moodArray = Array.isArray(res.data)
            ? res.data
            : (res.data.moods || []);
          setMoodEntries(
            moodArray.map(entry => ({
              mood: entry.mood,
              notes: entry.notes,
              date: new Date(entry.time).toLocaleDateString()
            }))
          );
        } catch (err) {
          console.log('Error fetching mood history:', err);
        }
      };
      fetchMoodHistory();
    }
  }, [userInfo, navigate]);

  const handleMoodSubmit = async () => {
    if (mood) {
      const payload = {
        mood,
        notes,
        time: new Date().toISOString(),
      };
      try {
        console.log('Sending mood payload:', payload);
        console.log('Token used for Authorization:', userInfo && userInfo.token);
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/mood/addmood/`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        // Refetch mood history after successful POST
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/mood/getMood/`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        console.log('Mood history response:', res.data);
        const moodArray = Array.isArray(res.data)
          ? res.data
          : (res.data.moods || []);
        setMoodEntries(
          moodArray.map(entry => ({
            mood: entry.mood,
            notes: entry.notes,
            date: new Date(entry.time).toLocaleDateString()
          }))
        );
        setMood('');
        setNotes('');
      } catch (err) {
        console.log('Error adding mood:', err);
        alert('Failed to log mood. Please try again.');
      }
    }
  };

  return (
    <section className="w-full max-w-3xl mx-auto p-5 box-border">
      <h2 className="text-3xl font-bold mb-5 text-center">Mood Tracking</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-0 flex-1">
          <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full mt-2 p-2 rounded border border-gray-300 text-base"
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
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your mood..."
            className="w-full mt-5 p-2 rounded border border-gray-300 text-base min-h-[100px] resize-y"
          ></textarea>
          <button onClick={handleMoodSubmit} className="mt-5 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition">Log Mood</button>
        </div>
        <div className="mt-8 md:mt-0 flex-1">
          <h3 className="text-xl font-semibold mb-4">Your Mood History</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left bg-gray-100">Date</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Mood</th>
                  <th className="px-4 py-2 text-left bg-gray-100">Notes</th>
                </tr>
              </thead>
              <tbody>
                {moodEntries.map((entry, index) => (
                  <tr key={index} className="bg-gray-200 even:bg-gray-100">
                    <td className="px-4 py-2 rounded-l">{entry.date}</td>
                    <td className="px-4 py-2">{entry.mood}</td>
                    <td className="px-4 py-2 rounded-r">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
