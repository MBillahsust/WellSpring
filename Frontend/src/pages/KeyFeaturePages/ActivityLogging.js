import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { UserContext } from '../../UserContext';
import '../../Allcss/KeyFeaturePages/ActivityLogging.css';

export default function ActivityLogging() {
  const { userInfo } = useContext(UserContext); 
  const [activity, setActivity] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [activityEntries, setActivityEntries] = useState([]);
  const navigate = useNavigate();

  const handleActivitySubmit = () => {
    if (activity && category && duration) {
      const newEntry = { 
        activity, 
        category, 
        duration, 
        notes, 
        date: new Date().toLocaleDateString() 
      };
      setActivityEntries([newEntry, ...activityEntries]);
      setActivity('');
      setCategory('');
      setDuration('');
      setNotes('');
    }
  };

  return userInfo ? (
    <section className="activity-logging-section">
      <h2 className="heading">Activity Logging</h2>
      <div className="activity-entry">
        <h3>Log Your Activity</h3>
        <input
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="Activity Name"
          className="activity-input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="activity-select"
        >
          <option value="" disabled>Select Category</option>
          <option value="exercise">Exercise</option>
          <option value="work">Work</option>
          <option value="social">Social</option>
          <option value="relaxation">Relaxation</option>
        </select>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g., 1 hour)"
          className="activity-input"
        />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional Notes..."
          className="activity-notes"
        ></textarea>
        <button onClick={handleActivitySubmit} className="button">Log Activity</button>
      </div>

      <div className="activity-history">
        <h3>Your Activity History</h3>
        <ul>
          {activityEntries.map((entry, index) => (
            <li key={index} className="activity-entry-item">
              <span>{entry.date} - {entry.activity} ({entry.duration})</span>
              <p>{entry.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  ) : (
    <section className="auth-required-section">
      <h2 className="heading">You need to log in to log your activity</h2>
      <p>Please log in or sign up to access activity logging features.</p>
      <div className="auth-options">
        <Link to="/login" className="auth-button">Log In</Link>
        <Link to="/signup" className="auth-button signup-button">Sign Up</Link>
      </div>
    </section>
  );
}
