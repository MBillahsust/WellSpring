// src/pages/GamesPages/SequenceSimon.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// the four color buttons
const BUTTONS = [
  { id: 'red',    color: 'bg-red-500',    active: 'bg-red-300' },
  { id: 'green',  color: 'bg-green-500',  active: 'bg-green-300' },
  { id: 'blue',   color: 'bg-blue-500',   active: 'bg-blue-300' },
  { id: 'yellow', color: 'bg-yellow-400', active: 'bg-yellow-200' },
];

function getRandomButton() {
  return BUTTONS[Math.floor(Math.random() * BUTTONS.length)].id;
}

export default function SequenceSimon() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // game state
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState('start');    // 'start' → 'show' → 'input' → 'done'
  const [showIndex, setShowIndex] = useState(-1);
  const [input, setInput] = useState([]);
  const [rounds, setRounds] = useState(0);
  const [finalScore, setFinalScore] = useState(null);

  // API & modal state
  const [playScores, setPlayScores]     = useState([]);
  const [modalOpen, setModalOpen]       = useState(false);
  const [apiResult, setApiResult]       = useState(null);
  const [apiError, setApiError]         = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ranking, setRanking]           = useState(null);

  // require login
  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login', { state: { from: '/games/sequence-simon' } });
    }
  }, [userInfo, navigate]);

  // start new game
  const startGame = () => {
    setSequence([ getRandomButton() ]);
    setRounds(0);
    setFinalScore(null);
    setPhase('show');
    setInput([]);
  };

  // show sequence one by one
  useEffect(() => {
    if (phase !== 'show') return;
    let idx = 0;
    setShowIndex(-1);
    const timer = setInterval(() => {
      if (idx >= sequence.length) {
        clearInterval(timer);
        setShowIndex(-1);
        setPhase('input');
      } else {
        setShowIndex(sequence[idx]);
        setTimeout(() => setShowIndex(-1), 500);
        idx += 1;
      }
    }, 800);
    return () => clearInterval(timer);
  }, [phase, sequence]);

  // handle user click
  const handleClick = (id) => {
    if (phase !== 'input') return;
    setShowIndex(id);
    setTimeout(() => setShowIndex(-1), 300);
    setInput(prev => {
      const next = [...prev, id];
      if (next.length === sequence.length) {
        const correct = next.every((btn, i) => btn === sequence[i]);
        if (correct) {
          setRounds(r => r + 1);
          setSequence(seq => [ ...seq, getRandomButton() ]);
          setInput([]);
          setPhase('show');
        } else {
          const S = rounds * 10;
          setFinalScore(S);
          setPhase('done');
        }
      }
      return next;
    });
  };

  // batch-send scores
  useEffect(() => {
    if (phase !== 'done') return;
    setPlayScores(prev => {
      const updated = [...prev, finalScore];
      if (updated.length === 3) {
        (async () => {
          try {
            setApiError(null);
            const res = await axios.post(
              `${BACKEND_URL}/game/gameScore/`,
              {
                game_name:    'sequence simon',
                game1Score:   updated[0],
                game2Score:   updated[1],
                game3Score:   updated[2],
              },
              { headers: { Authorization:`Bearer ${userInfo.token}` } }
            );
            setApiResult(res.data);
            setModalOpen(true);
          } catch {
            setApiError('Failed to submit scores. Please try again.');
            setModalOpen(true);
          }
        })();
        return [];
      }
      return updated;
    });
  }, [phase, finalScore, BACKEND_URL, userInfo]);

  // fetch ranking
  const fetchRank = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/game/gameRank/${encodeURIComponent('sequence simon')}`,
        { headers: { Authorization:`Bearer ${userInfo.token}` } }
      );
      if (res.data.rank != null) setRanking(res.data.rank);
    } catch {
      setRanking(null);
    }
  };
  useEffect(() => {
    if (userInfo?.token) fetchRank();
  }, [userInfo]);

  // submit feedback/assessment
  const getAssessment = () => ({
    game_name:      'sequence simon',
    recommendation: apiResult?.cognitive_report?.recommendation || '',
    ...apiResult?.cognitive_report?.trait_scores,
    feedback:       feedbackText || ''
  });
  const handleSubmit = async () => {
    setSubmitStatus(null);
    try {
      await axios.post(`${BACKEND_URL}/game/gameassessment`, getAssessment(), {
        headers: { Authorization:`Bearer ${userInfo.token}` }
      });
      setModalOpen(false);
      setFeedbackOpen(false);
      toast.success('Assessment submitted successfully!');
      fetchRank();
    } catch {
      setSubmitStatus('Failed to submit assessment. Please try again.');
    }
  };

  const scores = [0,1,2].map(i => playScores[i] ?? null);

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <ToastContainer position="top-right" />

      {/* Insights Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 max-h-[80vh] overflow-auto">
            <DialogTitle className="text-2xl font-bold text-indigo-800 text-center mb-4">
              Game Insights
            </DialogTitle>
            {apiError ? (
              <div className="text-red-600 font-semibold mb-3 text-center">{apiError}</div>
            ) : apiResult ? (
              <>
                {/* Meta */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Meta:</div>
                  <ul className="text-sm text-gray-700 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(apiResult.meta || {})
                      .filter(([k]) => k !== 'rank')
                      .map(([k, v]) => (
                        <li key={k} className="capitalize flex justify-between">
                          <span>{k.replace(/_/g, ' ')}</span>
                          <span className="font-bold text-indigo-600">{v ?? '-'}</span>
                        </li>
                      ))
                    }
                  </ul>
                </div>

                {/* Trait Scores */}
                <div className="font-semibold text-gray-700 mb-1">Trait Scores:</div>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto px-2">
                  {apiResult.cognitive_report?.trait_scores ? (
                    Object.entries(apiResult.cognitive_report.trait_scores)
                      .slice(0, 5)
                      .map(([trait, val], i) => {
                        const pct = Math.max(0, Math.min(100, Number(val)));
                        const cols = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-pink-500'];
                        return (
                          <div key={trait} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-gray-700">
                              <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                              <span className="text-indigo-600 font-bold">{pct}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`${cols[i % cols.length]} h-3 rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-gray-400">No trait scores available.</div>
                  )}
                </div>

                {/* Recommendation */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Recommendation:</div>
                  <div className="text-gray-800 text-sm">
                    {apiResult.cognitive_report?.recommendation || 'No recommendation available.'}
                  </div>
                </div>

                {/* Status & Buttons */}
                {submitStatus && (
                  <div className={`mt-3 text-center text-sm font-semibold ${
                    submitStatus.includes('success') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {submitStatus}
                  </div>
                )}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="w-1/2 bg-gray-200 text-indigo-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                  >Feedback</button>
                  <button
                    onClick={handleSubmit}
                    className="w-1/2 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm"
                  >Submit</button>
                </div>
              </>
            ) : (
              <div className="text-gray-600 text-center">Loading...</div>
            )}
          </div>
        </div>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[70vh] overflow-auto">
            <DialogTitle className="text-2xl font-bold text-indigo-800 text-center mb-4">
              Feedback
            </DialogTitle>
            <textarea
              className="w-full min-h-[120px] p-3 border border-indigo-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
              placeholder="Share your thoughts…"
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setFeedbackOpen(false)}
                className="bg-gray-200 text-indigo-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
              >Cancel</button>
              <button
                onClick={handleSubmit}
                disabled={!feedbackText.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm disabled:opacity-50"
              >Save</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Main UI */}
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white text-center">
            <h1 className="text-xl font-bold">Sequence Simon</h1>
            <p className="mt-1">
              {phase === 'start' && 'Press Start to begin'}
              {phase === 'show'  && 'Watch the sequence…'}
              {phase === 'input' && 'Repeat the sequence!'}
              {phase === 'done'  && `Game Over—Score: ${finalScore}`}
            </p>
          </div>

          <div className="p-6 flex flex-col items-center space-y-4">
            {phase === 'start' && (
              <button
                onClick={startGame}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >Start</button>
            )}

            {phase !== 'start' && (
              <div className="grid grid-cols-2 gap-4 w-full">
                {BUTTONS.map(btn => (
                  <button
                    key={btn.id}
                    disabled={phase !== 'input'}
                    onClick={() => handleClick(btn.id)}
                    className={`
                      h-20 rounded-lg transition
                      ${showIndex === btn.id
                        ? btn.active
                        : phase === 'show'
                          ? 'bg-transparent'
                          : btn.color}
                      ${phase === 'input' ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  />
                ))}
              </div>
            )}

            {phase === 'done' && (
              <button
                onClick={startGame}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >Play Again</button>
            )}
          </div>
        </div>

        {/* Scores & Ranking */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-5">
            <h2 className="font-bold text-indigo-800 mb-2">Game Scores</h2>
            <ul className="space-y-1">
              {[0,1,2].map(i => (
                <li key={i}>
                  {i+1}ⁿᵈ score: {scores[i] ?? <span className="italic text-gray-400">not played</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-5 text-center">
            <h2 className="font-bold text-indigo-800 mb-2">Your Ranking</h2>
            <div className={`text-4xl font-extrabold ${
              ranking != null && ranking <= 10 ? 'text-indigo-600 animate-pulse' : 'text-gray-700'
            }`}>
              {ranking != null ? `#${ranking}` : '-'}
            </div>
            <p className="text-xs text-gray-500 mt-1">(Top 10 get a special badge!)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
