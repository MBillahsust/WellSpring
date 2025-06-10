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
  // Filter states
  const [moodChecked, setMoodChecked] = useState(false);
  const [activityChecked, setActivityChecked] = useState(false);
  const [assessmentChecked, setAssessmentChecked] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);
  const [mood, setMood] = useState('');
  const [activity, setActivity] = useState('');
  const [assessment, setAssessment] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const navigate = useNavigate();
  const location = useLocation();
  const recommendTriggered = useRef(false);
  const [recommendLoading, setRecommendLoading] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState(null);
  const [recommendError, setRecommendError] = useState(null);
  const [filtersRestored, setFiltersRestored] = useState(false);
  const [combinedSummary, setCombinedSummary] = useState("");

  // 7 divisions for location
  const divisions = [
    'Dhaka', 'Chittagong', 'Khulna', 'Sylhet', 'Rajshahi', 'Rangpur', 'Barisal'
  ];
  // Example options for selects
  const moodOptions = ['Anxiety', 'Depression', 'Stress', 'Sleep', 'Anger'];
  const activityOptions = ['Therapy', 'Counseling', 'Medication', 'Group Session'];
  const assessmentOptions = ['Initial', 'Follow-up', 'Psychometric', 'Diagnosis'];

  useEffect(() => {
    setLoading(true);
    const url = `${process.env.REACT_APP_BACKEND_URL}/doctor/getallDoctor`;
    axios.get(url)
      .then(res => {
        console.log('Doctor API response:', res.data);
        let data = res.data;
        if (data && Array.isArray(data.doctors)) {
          setDoctors(data.doctors);
        } else if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          setDoctors([]);
          setApiError('Unexpected API response.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setApiError('Failed to load doctors.');
        setLoading(false);
      });
  }, []);

  // On mount, restore filter state from query params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('moodChecked')) setMoodChecked(params.get('moodChecked') === 'true');
    if (params.get('activityChecked')) setActivityChecked(params.get('activityChecked') === 'true');
    if (params.get('assessmentChecked')) setAssessmentChecked(params.get('assessmentChecked') === 'true');
    if (params.get('division')) setDivision(params.get('division'));
    setFiltersRestored(true);
  }, [location.search]);

  // Only auto-trigger recommend doctor POST ONCE after login if recommend=1 and token exists and filters are restored
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = localStorage.getItem('token');
    if (filtersRestored && params.get('recommend') === '1' && token && !recommendTriggered.current) {
      console.log('Auto-triggering recommend POST after login with filters:', {
        moodChecked, activityChecked, assessmentChecked, division, token
      });
      recommendTriggered.current = true;
      handleRecommend(true);
    }
  }, [filtersRestored, location.search, moodChecked, activityChecked, assessmentChecked, division]);

  // Filtering logic
  let filteredDoctors = Array.isArray(doctors) ? doctors : [];
  if (moodChecked && mood) {
    filteredDoctors = filteredDoctors.filter(doc => doc.mood && doc.mood.includes(mood));
  }
  if (activityChecked && activity) {
    filteredDoctors = filteredDoctors.filter(doc => doc.activity && doc.activity.includes(activity));
  }
  if (assessmentChecked && assessment) {
    filteredDoctors = filteredDoctors.filter(doc => doc.assessment && doc.assessment.includes(assessment));
  }
  if (locationChecked && division) {
    filteredDoctors = filteredDoctors.filter(doc => doc.division === division);
  }

  // Recommend Doctor handler
  const handleRecommend = async (auto = false) => {
    const token = localStorage.getItem('token');
    // If not logged in, redirect to login with filter state in query params
    if (!token) {
      recommendTriggered.current = false;
      const params = new URLSearchParams();
      params.set('moodChecked', moodChecked);
      params.set('activityChecked', activityChecked);
      params.set('assessmentChecked', assessmentChecked);
      params.set('division', division);
      params.set('recommend', '1');
      navigate(`/login?from=/counsellors&${params.toString()}`);
      return;
    }
    setRecommendLoading(true);
    setRecommendError(null);
    setRecommendedDoctors(null);
    setCombinedSummary("");
    const url = `${process.env.REACT_APP_BACKEND_URL}/doctor/recommandDoctor`;
    const payload = {
      assessmentData: assessmentChecked,
      moodData: moodChecked,
      activityData: activityChecked,
      city: division || 'Dhaka',
    };
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    // Log outgoing request for debugging
    console.log('Recommend Doctor POST', { url, payload, headers });
    try {
      const res = await axios.post(url, payload, { headers });
      console.log('Recommend Doctor RESPONSE:', res);
      let data = res.data;
      if (data && data.combinedSummary) {
        setCombinedSummary(data.combinedSummary);
      }
      if (data && Array.isArray(data.recommendedDoctors)) {
        setRecommendedDoctors(data.recommendedDoctors);
      } else if (data && Array.isArray(data.doctors)) {
        setRecommendedDoctors(data.doctors);
      } else if (Array.isArray(data)) {
        setRecommendedDoctors(data);
      } else {
        setRecommendedDoctors([]);
        setRecommendError('Unexpected API response.');
      }
      // After successful recommend, remove recommend=1 from URL
      if (auto) {
        const params = new URLSearchParams(location.search);
        params.delete('recommend');
        navigate(`/counsellors?${params.toString()}`, { replace: true });
      }
    } catch (err) {
      console.log('Recommend Doctor ERROR:', err);
      let errorMsg = 'Failed to recommend doctor.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      }
      toast.error(errorMsg, { autoClose: 8000 });
      if (err.response && err.response.status === 401) {
        setRecommendError('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        recommendTriggered.current = false;
        // Remove recommend=1 to prevent infinite loop
        const params = new URLSearchParams(location.search);
        params.delete('recommend');
        navigate(`/login?from=/counsellors&${params.toString()}`);
      } else {
        setRecommendError('Failed to recommend doctor.');
      }
    } finally {
      setRecommendLoading(false);
    }
  };

  return (
    <section className="py-10 px-4 md:px-10 bg-gradient-to-br from-blue-50 to-white min-h-screen font-sans">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-center mb-6 text-blue-900 drop-shadow-lg"
      >
        Our Psychiatrists
      </motion.h2>
      <div className="flex flex-wrap justify-center items-center gap-4 mb-8 p-2">
        {/* Custom Square Buttons with Rounded Corners */}
        {[
          { id: 'mood', label: 'Mood', checked: moodChecked, setChecked: setMoodChecked },
          { id: 'activity', label: 'Activity', checked: activityChecked, setChecked: setActivityChecked },
          { id: 'assessment', label: 'Assessments', checked: assessmentChecked, setChecked: setAssessmentChecked },
        ].map(({ id, label, checked, setChecked }) => (
          <button
            key={id}
            onClick={() => setChecked(!checked)}
            className={`w-20 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-200 select-none
        ${checked ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-400'}
        shadow-sm hover:shadow-md`}
          >
            {label}
          </button>
        ))}

        {/* Division Dropdown */}
        <div>
          <select
            value={division}
            onChange={e => setDivision(e.target.value)}
            className="text-sm px-2 py-1 rounded-md border border-blue-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none text-blue-900 bg-white"
          >
            <option value="">Select Division</option>
            {divisions.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Recommend Doctor Button */}
        <button
          type="button"
          onClick={() => handleRecommend(false)}
          disabled={recommendLoading}
          className="px-2 py-1 rounded font-semibold border border-green-500 bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 focus:outline-none text-xs w-auto mt-1"
          style={{ minWidth: 'unset', maxWidth: '160px' }}
        >
          {recommendLoading ? 'Recommending...' : 'Recommend Doctor'}
        </button>
      </div>



      {/* Combined Summary or Error Segment */}
      <div className="w-full flex justify-center items-center min-h-[40px] mb-4">
        {recommendLoading ? (
          <div className="flex items-center gap-2 text-blue-600 font-medium">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            Processing recommendation...
          </div>
        ) : recommendError ? (
          <div className="text-red-600 text-center font-medium w-full max-w-2xl bg-red-50 border border-red-200 rounded p-2">{recommendError}</div>
        ) : combinedSummary ? (
          <div className="text-blue-900 text-center font-medium w-full max-w-2xl bg-blue-50 border border-blue-200 rounded p-2 whitespace-pre-line">{combinedSummary}</div>
        ) : null}
      </div>

      {recommendError && <div className="text-red-600 text-center mb-4">{recommendError}</div>}
      {/* Show recommended doctors if present, else show filteredDoctors */}
      {recommendLoading ? (
        <div className="text-center text-blue-600 font-semibold">Recommending doctor...</div>
      ) : recommendedDoctors ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {recommendedDoctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No recommended doctors found.</div>
          ) : recommendedDoctors.map((profile, index) => (
            <motion.div
              key={profile._id || index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              className="rounded-2xl bg-white shadow-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">{profile.name}</h3>
                <p className="text-blue-600 font-medium mb-1">{profile.title}</p>
                <p className="text-gray-600 text-sm mb-1">{profile.position}</p>
                <p className="text-blue-500 text-sm flex items-center mb-1">
                  <MapPinIcon className="inline-block mr-1 text-blue-400" />
                  {profile.division || profile.city}
                </p>
                {profile.phone && (
                  <p className="text-blue-500 text-sm flex items-center mb-1">
                    <PhoneIcon className="inline-block mr-1 text-blue-400" />
                    {profile.phone}
                  </p>
                )}
                {/* Chambers field */}
                {profile.chambers && Array.isArray(profile.chambers) && profile.chambers.length > 0 && (
                  <div className="mt-3">
                    <div className="font-semibold text-blue-700 mb-1">Chambers:</div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {profile.chambers.map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : loading ? (
        <div className="text-center text-blue-600 font-semibold">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No doctors found.</div>
          ) : filteredDoctors.map((profile, index) => (
            <motion.div
              key={profile._id || index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              className="rounded-2xl bg-white shadow-lg p-6 border border-blue-100 transition-all duration-300 hover:shadow-2xl"
            >
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-1">{profile.name}</h3>
                <p className="text-blue-600 font-medium mb-1">{profile.title}</p>
                <p className="text-gray-600 text-sm mb-1">{profile.position}</p>
                <p className="text-blue-500 text-sm flex items-center mb-1">
                  <MapPinIcon className="inline-block mr-1 text-blue-400" />
                  {profile.division || profile.city}
                </p>
                {profile.phone && (
                  <p className="text-blue-500 text-sm flex items-center mb-1">
                    <PhoneIcon className="inline-block mr-1 text-blue-400" />
                    {profile.phone}
                  </p>
                )}
                {/* Chambers field */}
                {profile.chambers && Array.isArray(profile.chambers) && profile.chambers.length > 0 && (
                  <div className="mt-3">
                    <div className="font-semibold text-blue-700 mb-1">Chambers:</div>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      {profile.chambers.map((ch, i) => (
                        <li key={i}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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

function Collapsible({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className} ${isOpen ? 'open' : ''}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
}

function CollapsibleTrigger({ children, asChild, isOpen, setIsOpen }) {
  return (
    <div onClick={() => setIsOpen(!isOpen)}>
      {children}
    </div>
  );
}

function CollapsibleContent({ children, isOpen }) {
  return isOpen ? <div>{children}</div> : null;
}

function Button({ children, variant, className, ...props }) {
  return (
    <button className={`${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}





