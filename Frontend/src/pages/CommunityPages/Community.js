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
                setFeedbacks(res.data.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
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
        <div className="max-w-4xl mx-auto py-12 px-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                    Community Feedback
                </h1>
                <button
                    onClick={handleGiveFeedback}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-2 rounded-full font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition duration-200"
                >
                    + Give Feedback
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="text-center text-gray-500 animate-pulse">Loading feedback...</div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : feedbacks.length === 0 ? (
                <div className="text-center text-gray-400 italic">
                    No feedback yet. Be the first to share your experience!
                </div>
            ) : (
                <div className="space-y-8">
                    {feedbacks.map((fb) => (
                        <div
                            key={fb._id}
                            className="relative bg-white/60 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl px-6 py-5 transition hover:shadow-xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-full rounded-2xl bg-gradient-to-br from-blue-50/10 to-indigo-50/10 pointer-events-none z-0" />

                            {/* Time Top Right */}
                            <div className="absolute top-3 right-4 text-xs text-gray-500 z-10">
                                🕒 {new Date(fb.submittedAt).toLocaleString()}
                            </div>

                            <div className="relative z-10 space-y-3 text-gray-800">
                                <p><span className="font-semibold"> Was it helpful?</span> {fb.wasHelpful}</p>
                                <p><span className="font-semibold"> Liked Features:</span> {fb.likedFeatures}</p>
                                <p><span className="font-semibold"> Disliked Features:</span> {fb.dislikedFeatures}</p>
                                <p><span className="font-semibold"> Suggested Improvements:</span> {fb.suggestedImprovements}</p>
                                <p><span className="font-semibold"> Better Understanding:</span> {fb.betterUnderstanding}</p>
                            </div>
                        </div>

                    ))}
                </div>
            )}
        </div>
    );
}
