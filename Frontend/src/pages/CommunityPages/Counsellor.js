import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function PhoneIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function Counsellor() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [moodChecked, setMoodChecked] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);
  const [assessmentChecked, setAssessmentChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [division, setDivision] = useState('Dhaka');
  const navigate = useNavigate();
  const location = useLocation();
  const recommendTriggered = useRef(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState(null);
  const [recommendError, setRecommendError] = useState(null);
  const [filtersRestored, setFiltersRestored] = useState(false);
  const [combinedSummary, setCombinedSummary] = useState("");
  const [recommendClicked, setRecommendClicked] = useState(false);
  const [recommendSuccess, setRecommendSuccess] = useState(false);

  const divisions = ['Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Rangpur', 'Barisal'];

  useEffect(() => {
    setLoading(true);
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/doctor/getallDoctor`)
      .then(res => {
        const data = res.data;
        setDoctors(Array.isArray(data.doctors) ? data.doctors : Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => { setApiError('Failed to load doctors.'); setLoading(false); });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('moodChecked')) setMoodChecked(params.get('moodChecked') === 'true');
    if (params.get('activityChecked')) setActivityChecked(params.get('activityChecked') === 'true');
    if (params.get('assessmentChecked')) setAssessmentChecked(params.get('assessmentChecked') === 'true');
    if (params.get('division')) setDivision(params.get('division'));
    setFiltersRestored(true);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = localStorage.getItem('token');
    if (filtersRestored && params.get('recommend') === '1' && token && !recommendTriggered.current) {
      recommendTriggered.current = true;
      handleRecommend(true);
    }
  }, [filtersRestored, location.search, moodChecked, activityChecked, assessmentChecked, division]);

  let filteredDoctors = doctors;
  if (moodChecked) filteredDoctors = filteredDoctors.filter(d => d.mood?.includes(moodChecked));
  if (activityChecked) filteredDoctors = filteredDoctors.filter(d => d.activity?.includes(activityChecked));
  if (assessmentChecked) filteredDoctors = filteredDoctors.filter(d => d.assessment?.includes(assessmentChecked));
  if (locationChecked) filteredDoctors = filteredDoctors.filter(d => d.division === division);

  const handleRecommend = async (auto = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      recommendTriggered.current = false;
      const params = new URLSearchParams({ moodChecked, activityChecked, assessmentChecked, division, recommend: '1' });
      return navigate(`/login?from=/counsellors&${params.toString()}`);
    }

    setRecommendClicked(true);
    setRecommendSuccess(false);
    setRecommendLoading(true);
    setRecommendError(null);
    setRecommendedDoctors(null);
    setCombinedSummary("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/doctor/recommandDoctor`,
        { assessmentData: assessmentChecked, moodData: moodChecked, activityData: activityChecked, city: division },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      if (data.combinedSummary) setCombinedSummary(data.combinedSummary);
      setRecommendedDoctors(Array.isArray(data.recommendedDoctors) ? data.recommendedDoctors : []);
      setRecommendSuccess(true);
      setTimeout(() => setRecommendSuccess(false), 2500);
      if (auto) {
        const params = new URLSearchParams(location.search);
        params.delete('recommend');
        navigate(`/counsellors?${params.toString()}`, { replace: true });
      }
    } catch (err) {
      const msg = 'Failed to recommend doctors. Please provide entries about your mood, activities, or assessments to receive a recommendation.';
      toast.error(msg, { autoClose: 8000 });
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        recommendTriggered.current = false;
        const params = new URLSearchParams(location.search);
        params.delete('recommend');
        navigate(`/login?from=/counsellors&${params.toString()}`);
      } else {
        setRecommendError(msg);
      }
    } finally {
      setRecommendClicked(false);
      setRecommendLoading(false);
    }
  };

  return (
    <section className="py-10 px-4 md:px-10 bg-gradient-to-br from-blue-50 to-white min-h-screen font-sans">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold text-center mb-8 text-blue-900 drop-shadow-lg"
      >
        Our Psychiatrists
      </motion.h2>

      <div className="flex flex-wrap justify-center items-center gap-6 mb-10 p-2">
        {[
          { id: 'mood', label: 'Mood', checked: moodChecked, setChecked: setMoodChecked },
          { id: 'activity', label: 'Activity', checked: activityChecked, setChecked: setActivityChecked },
          { id: 'assessment', label: 'Assessments', checked: assessmentChecked, setChecked: setAssessmentChecked },
        ].map(({ id, label, checked, setChecked }) => (
          <button
            key={id}
            onClick={() => setChecked(!checked)}
            className={
              `relative w-24 h-10 flex items-center justify-center rounded-lg text-sm font-semibold select-none
              transition-transform duration-300 ease-in-out
              ${checked
                ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-400 shadow-sm hover:shadow-md'}
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1`
            }
          >
            {checked && (
              <svg className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
            {label}
          </button>
        ))}

        <select
          value={division}
          onChange={e => setDivision(e.target.value)}
          className="text-base px-3 py-2 rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none text-blue-900 bg-white"
        >
          <option value="">Select Division</option>
          {divisions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>

        <button
          type="button"
          onClick={() => handleRecommend(false)}
          disabled={recommendLoading || recommendSuccess}
          className={
            `px-4 py-2 rounded font-semibold border transition-colors duration-200 text-base w-auto mt-2
              ${recommendLoading
                ? 'bg-green-400 border-green-400 text-white cursor-wait'
                : recommendSuccess
                  ? 'bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-green-500 border-green-500 text-white hover:bg-green-600'}
          `}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {recommendLoading ? 'Recommending...' : recommendSuccess ? 'Done!' : 'Recommend Doctor'}
        </button>
      </div>

      <div className="w-full flex justify-center items-center min-h-[40px] mb-6">
        {recommendLoading
          ? <div className="text-base text-blue-600 font-medium">Processing recommendation...</div>
          : recommendError
            ? <div className="text-base text-red-600 text-center font-medium max-w-2xl bg-red-50 border border-red-200 rounded p-2">{recommendError}</div>
            : combinedSummary
              ? <div className="text-base text-blue-900 text-center font-medium max-w-2xl bg-blue-50 border border-blue-200 rounded p-2 whitespace-pre-line">{combinedSummary}</div>
              : null
        }
      </div>

      {(recommendedDoctors || !loading) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {((recommendedDoctors ?? filteredDoctors).length === 0) ? (
            <div className="col-span-full text-center text-gray-500 text-base">No doctors found.</div>
          ) : (recommendedDoctors ?? filteredDoctors).map((profile, idx) => (
            <motion.div
              key={profile._id || idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              className="rounded-2xl bg-white shadow-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-blue-800 mb-2">{profile.name}</h3>
              <p className="text-base font-medium text-blue-600 mb-2">{profile.title}</p>
              <p className="text-base text-gray-600 mb-2">{profile.position}</p>
              <p className="text-base text-blue-500 flex items-center mb-2">
                <MapPinIcon className="inline-block mr-1 text-blue-400" />
                {profile.division || profile.city}
              </p>
              {profile.phone && (
                <p className="text-base text-blue-500 flex items-center mb-2">
                  <PhoneIcon className="inline-block mr-1 text-blue-400" />
                  {profile.phone}
                </p>
              )}
              {Array.isArray(profile.chambers) && profile.chambers.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-blue-700 mb-2 text-base">Chambers:</p>
                  <ul className="list-disc list-inside text-base text-gray-700">
                    {profile.chambers.map((ch, i) => <li key={i}>{ch}</li>)}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MapPinIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
