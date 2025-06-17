// src/pages/GamesPages/WordRecall.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// A sample word bank — replace with whatever you like
const WORD_BANK = [
  'ocean', 'forest', 'mountain', 'desert', 'river', 'valley', 'island', 'volcano',
  'jungle', 'canyon', 'waterfall', 'glacier', 'lagoon', 'reef', 'savanna', 'tundra',
  'prairie', 'wetland', 'plateau', 'delta', 'archipelago', 'bay', 'cape', 'hill',
  'peninsula', 'fjord', 'marsh', 'swamp', 'steppe', 'atoll', 'oasis', 'butte',
  'mesa', 'gorge', 'ravine', 'dune', 'sinkhole', 'cave', 'cliff', 'ridge',
  'valley', 'gulch', 'sea', 'strait', 'sound', 'estuary', 'basin', 'loch',
  'volcano', 'watershed', 'quagmire', 'moor', 'fen', 'cataract', 'spit', 'arch',
  'escarpment', 'inlet', 'lagoon', 'rift'
];
function shuffle(array) {
  let a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function WordRecall() {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserContext);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // --- Game state ---
  const [phase, setPhase]       = useState('show'); // 'show' → 'select' → 'done'
  const [targets, setTargets]   = useState([]);     // 8 words to remember
  const [options, setOptions]   = useState([]);     // 16 words displayed
  const [selected, setSelected] = useState(new Set());
  const [finalScore, setFinalScore] = useState(null);

  // --- Timer state ---
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef();

  // --- API & modal state (same as MemoryMatch) ---
  const [playScores, setPlayScores]     = useState([]);
  const [modalOpen, setModalOpen]       = useState(false);
  const [apiResult, setApiResult]       = useState(null);
  const [apiError, setApiError]         = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ranking, setRanking]           = useState(null);

  // Kick off or reset a round
  const startNewGame = () => {
    setPhase('show');
    setSelected(new Set());
    setFinalScore(null);
    setTimeLeft(30);
    // choose 8 targets
    const chosen = shuffle(WORD_BANK).slice(0,8);
    const rest = WORD_BANK.filter(w => !chosen.includes(w));
    const distractors = shuffle(rest).slice(0,8);
    setTargets(chosen);
    setOptions(shuffle([...chosen, ...distractors]));
    // After 4s, move to select
    setTimeout(() => setPhase('select'), 4000);
  };

  // On mount & user-ready, start first round
  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login',{state:{from:'/games/word-recall'}});
      return;
    }
    startNewGame();
  }, [userInfo, navigate]);

  // Countdown during selection
  useEffect(() => {
    if (phase === 'select') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finish();      // auto‐submit
            return 0;
          }
          return t-1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [phase]);

  // Handle selection toggles
  const toggle = word => {
    if (phase !== 'select') return;
    setSelected(s => {
      const copy = new Set(s);
      copy.has(word) ? copy.delete(word) : copy.add(word);
      return copy;
    });
  };

  // End game & compute score (with time‐bonus)
  const finish = () => {
    clearInterval(timerRef.current);
    let correct = 0, wrong = 0;
    selected.forEach(w => targets.includes(w) ? correct++ : wrong++);
    // base: +10/correct, –5/wrong, + timeLeft bonus
    const S = Math.max(0, correct*10 - wrong*5 + timeLeft);
    setFinalScore(S);
    setPhase('done');
  };

  // Batch‐send scores exactly like MemoryMatch
  useEffect(() => {
    if (phase==='done') {
      setPlayScores(prev => {
        const updated = [...prev, finalScore];
        if (updated.length === 3) {
          (async() => {
            try {
              setApiError(null);
              const res = await axios.post(
                `${BACKEND_URL}/game/gameScore/`,
                {
                  game_name: 'word recall',
                  game1Score: updated[0],
                  game2Score: updated[1],
                  game3Score: updated[2],
                },
                { headers:{Authorization:`Bearer ${userInfo.token}`}}
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
    }
  }, [phase, finalScore, userInfo, BACKEND_URL]);

  // Fetch ranking
  const fetchRank = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/game/gameRank/${encodeURIComponent('word recall')}`,
        { headers:{Authorization:`Bearer ${userInfo.token}`}}
      );
      if (res.data.rank != null) setRanking(res.data.rank);
    } catch {
      setRanking(null);
    }
  };
  useEffect(() => { if (userInfo?.token) fetchRank(); }, [userInfo]);

  // Submit feedback/assessment
  const getAssessment = () => ({
    game_name: 'word recall',
    recommendation: apiResult?.cognitive_report?.recommendation || '',
    ...apiResult?.cognitive_report?.trait_scores,
    feedback: feedbackText || ''
  });
  const handleSubmit = async () => {
    setSubmitStatus(null);
    try {
      await axios.post(
        `${BACKEND_URL}/game/gameassessment`,
        getAssessment(),
        { headers:{Authorization:`Bearer ${userInfo.token}`}}
      );
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
    <div className="min-h-screen bg-yellow-50 py-4">
      <ToastContainer position="top-right"/>

      {/* Insights Modal (same as MemoryMatch) */}
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30"/>
          <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-auto p-6 z-50 max-h-[80vh] overflow-auto">
            <DialogTitle className="text-2xl font-bold text-yellow-800 text-center mb-4">
              Game Insights
            </DialogTitle>
            {apiError
              ? <div className="text-red-600 font-semibold mb-3 text-center">{apiError}</div>
              : apiResult ? (
                <>
                  {/* Meta */}
                  <div className="mb-4">
                    <div className="font-semibold text-gray-700 mb-1">Meta:</div>
                    <ul className="text-sm text-gray-700 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(apiResult.meta||{})
                        .filter(([k])=>k!=='rank')
                        .map(([k,v])=>(
                          <li key={k} className="capitalize flex justify-between">
                            <span>{k.replace(/_/g,' ')}</span>
                            <span className="font-bold text-yellow-700">{v??'-'}</span>
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
                        .slice(0,5).map(([t,val],i)=>{
                          const pct = Math.max(0,Math.min(100,Number(val)));
                          const cols = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-pink-500'];
                          return (
                            <div key={t} className="flex flex-col gap-1">
                              <div className="flex justify-between text-xs font-medium text-gray-700">
                                <span className="capitalize">{t.replace(/_/g,' ')}</span>
                                <span className="text-yellow-700 font-bold">{pct}</span>
                              </div>
                              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`${cols[i%cols.length]} h-3 rounded-full`} style={{width:`${pct}%`}}/>
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
                  {/* Submit */}
                  {submitStatus && (
                    <div className={`mt-3 text-center text-sm font-semibold ${submitStatus.includes('success')?'text-green-600':'text-red-600'}`}>
                      {submitStatus}
                    </div>
                  )}
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={()=>setFeedbackOpen(true)}
                      className="w-1/2 bg-gray-200 text-yellow-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                    >Feedback</button>
                    <button
                      onClick={handleSubmit}
                      className="w-1/2 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition text-sm"
                    >Submit</button>
                  </div>
                </>
              ) : (
                <div className="text-gray-600 text-center">Loading...</div>
              )
            }
          </div>
        </div>
      </Dialog>

      {/* Feedback Modal */}
      <Dialog open={feedbackOpen} onClose={()=>setFeedbackOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30"/>
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6 z-50 max-h-[70vh] overflow-auto">
            <DialogTitle className="text-2xl font-bold text-yellow-800 text-center mb-4">Feedback</DialogTitle>
            <textarea
              className="w-full min-h-[120px] p-3 border border-yellow-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-4"
              placeholder="Share your thoughts…"
              value={feedbackText}
              onChange={e=>setFeedbackText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={()=>setFeedbackOpen(false)}
                className="bg-gray-200 text-yellow-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm"
              >Cancel</button>
              <button
                onClick={()=>setFeedbackOpen(false)}
                disabled={!feedbackText.trim()}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition text-sm disabled:opacity-50"
              >Save</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Main Game UI */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-yellow-600 p-4 text-white text-center flex flex-col sm:flex-row sm:justify-between items-center">
            <h1 className="text-xl font-bold">Word Recall</h1>
            {phase === 'select' && (
              <div className="mt-2 sm:mt-0 text-sm">
                Time Left: <span className="font-semibold">{timeLeft}s</span>
              </div>
            )}
          </div>
          <div className="p-6">
            {phase==='show' && (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                {targets.map(w=>(
                  <li key={w} className="p-3 bg-yellow-100 rounded">{w}</li>
                ))}
              </ul>
            )}
            {phase!=='show' && (
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {options.map(w=>(
                  <li
                    key={w}
                    onClick={()=>toggle(w)}
                    className={`p-3 text-center rounded cursor-pointer select-none
                      ${ selected.has(w)
                        ? targets.includes(w)
                          ? 'bg-green-200 border-2 border-green-600'
                          : 'bg-red-200 border-2 border-red-600'
                        : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                  >{w}</li>
                ))}
              </ul>
            )}
            {phase==='select' && (
              <div className="mt-6 text-center">
                <button
                  onClick={finish}
                  className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
                >Submit</button>
              </div>
            )}
            {phase==='done' && (
              <div className="mt-6 text-center space-y-4">
                <div className="text-lg">Your Score: <span className="font-bold">{finalScore}</span></div>
                <button
                  onClick={startNewGame}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                >Play Again</button>
              </div>
            )}
          </div>
        </div>

        {/* Scores & Ranking */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-5">
            <h2 className="font-bold text-yellow-800 mb-2">Game Scores</h2>
            <ul className="space-y-1">
              {[0,1,2].map(i=>(
                <li key={i}>
                  {i+1}ⁿᵈ score: {scores[i] ?? <span className="italic text-gray-400">not played</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-5 text-center">
            <h2 className="font-bold text-yellow-800 mb-2">Your Ranking</h2>
            <div className={`text-4xl font-extrabold ${
              ranking!=null && ranking<=10 ? 'text-yellow-500 animate-pulse' : 'text-gray-700'
            }`}>
              {ranking!=null ? `#${ranking}` : '-'}
            </div>
            <p className="text-xs text-gray-500 mt-1">(Top 10 get a special badge!)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
