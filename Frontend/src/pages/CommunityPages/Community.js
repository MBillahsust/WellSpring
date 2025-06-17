import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function Community() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/community/allfeedback`);
        setFeedbacks(
          res.data.sort(
            (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
          )
        );
      } catch (err) {
        setError('Failed to load community feedback.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleGiveFeedback = () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/community' } });
    } else {
      navigate('/community/give-feedback');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight">
          Community Feedback
        </h1>
        <button
          onClick={handleGiveFeedback}
          className="self-stretch sm:self-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200 text-sm sm:text-base"
        >
          + Give Feedback
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse py-12">
          Loading feedback...
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : feedbacks.length === 0 ? (
        <div className="text-center text-gray-400 italic py-12">
          No feedback yet. Be the first to share your experience!
        </div>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb._id}
              className="relative bg-white/60 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-4 sm:p-6 transition hover:shadow-xl"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/10 to-indigo-50/10 pointer-events-none" />

              {/* Time Top Right */}
              <div className="absolute top-3 right-3 text-xs text-gray-500">
                🕒 {new Date(fb.submittedAt).toLocaleString()}
              </div>

              <div className="relative space-y-2 text-gray-800 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">Was it helpful?</span> {fb.wasHelpful}
                </p>
                <p>
                  <span className="font-semibold">Liked Features:</span> {fb.likedFeatures}
                </p>
                <p>
                  <span className="font-semibold">Disliked Features:</span> {fb.dislikedFeatures}
                </p>
                <p>
                  <span className="font-semibold">Suggested Improvements:</span> {fb.suggestedImprovements}
                </p>
                <p>
                  <span className="font-semibold">Better Understanding:</span> {fb.betterUnderstanding}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
