import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-gray-900">
        <h1 className="text-4xl font-bold text-center mb-8">How to Use Our Platform</h1>
        <ol className="list-decimal list-inside space-y-6 text-lg">
          <li>
            <strong>Sign Up</strong><br />
            Create a account by visiting <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>.If you have any concerns, you can use dummy information. Our platform doesn’t verify your email addresses or personal information or uses personal information.
          </li>
          <li>
            <strong>Log In</strong><br />
            Access your dashboard anytime through <Link to="/login" className="text-blue-600 hover:underline">Log In</Link>.
          </li>
          <li>
            <strong>Do Assessments</strong><br />
            Choose from our range of standardized assessments (e.g., GAD-7, PHQ-9) under the <Link to="/assessments" className="text-blue-600 hover:underline">Assessments</Link> section. Choose the ones you think you need to do.
          </li>
          <li>
            <strong>Track Your Mood & Activity</strong><br />
            For 1–2 days, record your mood in <Link to="/mood-tracking" className="text-blue-600 hover:underline">Mood Tracking</Link> and log daily activities in <Link to="/activity-logging" className="text-blue-600 hover:underline">Activity Logging</Link>.
          </li>
          <li>
            <strong>Play Mental Health Games</strong><br />
            Explore fun, evidence-based games under <Link to="/games" className="text-blue-600 hover:underline">Games</Link>. Store your results and submit feedback to help us improve.
          </li>
          <li>
            <strong>Review Your Dashboard</strong><br />
            All your data—assessments, mood logs, activities, and game results—appear in your <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link> for easy tracking over time.
          </li>
          <li>
            <strong>Use the AI Counselor</strong><br />
            Generate personalized insights by combining your mood, activity, assessment, and game data—powered by our AI counselor at <Link to="/ai-counselor" className="text-blue-600 hover:underline">AI Counselor</Link>.
          </li>
          <li>
            <strong>Get Psychiatrist Recommendations</strong><br />
            Based on your own data, receive tailored recommendations for psychiatrists in your region under <Link to="/counsellors" className="text-blue-600 hover:underline">Connect with Experts</Link>.
          </li>
        </ol>
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Watch the User Guide Video</h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full rounded-lg shadow-md"
              src="https://www.youtube.com/embed/ccU09vo9Tpc"
              title="WellSpring User Guide"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}