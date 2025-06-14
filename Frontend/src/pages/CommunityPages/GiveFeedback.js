import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function GiveFeedback() {
    const [form, setForm] = useState({
        wasHelpful: '',
        likedFeatures: '',
        dislikedFeatures: '',
        suggestedImprovements: '',
        betterUnderstanding: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { userInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/community/feedback`,
                form,
                {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            setSuccess(true);
            setTimeout(() => navigate('/community'), 1200);
        } catch (err) {
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">We value your feedback</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
            >
                {/* Helpful Question */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Was this experience helpful?
                    </label>
                    <select
                        name="wasHelpful"
                        value={form.wasHelpful}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="" disabled>Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="Somewhat">Somewhat</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* Liked Features */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What did you like the most?</label>
                    <textarea
                        name="likedFeatures"
                        value={form.likedFeatures}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="e.g. Clean UI, fast response, etc."
                        required
                    />
                </div>

                {/* Disliked Features */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">What didn't work well?</label>
                    <textarea
                        name="dislikedFeatures"
                        value={form.dislikedFeatures}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="e.g. Confusing layout, slow navigation..."
                        required
                    />
                </div>

                {/* Suggestions */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Any suggestions to improve?</label>
                    <textarea
                        name="suggestedImprovements"
                        value={form.suggestedImprovements}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Share any ideas..."
                        required
                    />
                </div>

                {/* Better Understanding */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Did you gain better understanding?</label>
                    <textarea
                        name="betterUnderstanding"
                        value={form.betterUnderstanding}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="How did it help your understanding?"
                        required
                    />
                </div>

                {/* Feedback Messages */}
                {error && <div className="text-red-600 text-sm">{error}</div>}
                {success && <div className="text-green-600 text-sm">✅ Feedback submitted! Redirecting...</div>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}