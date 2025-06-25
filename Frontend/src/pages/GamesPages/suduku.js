// src/pages/GamesPages/GameSudoku.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SIZE = 3;
const GAME_NAME = 'sudoku';
const BASE = [
  [1, 2, 3],
  [3, 1, 2],
  [2, 3, 1],
];

// Fisher–Yates shuffle
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// build a random 3×3 Latin square
function generateSolution() {
  const mapping = shuffleArray([1, 2, 3]);
  const rows = shuffleArray([0, 1, 2]);
  const cols = shuffleArray([0, 1, 2]);
  const sol = Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
  rows.forEach((r, i) =>
    cols.forEach((c, j) => {
      sol[i][j] = mapping[BASE[r][c] - 1];
    })
  );
  return sol;
}

export default function GameSudoku() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // matrix builders
  const mkNum  = () => Array(SIZE).fill(0).map(() => Array(SIZE).fill(0));
  const mkStr  = () => Array(SIZE).fill(0).map(() => Array(SIZE).fill(''));
  const mkBool = () => Array(SIZE).fill(0).map(() => Array(SIZE).fill(false));

  // state
  const [solution, setSolution] = useState(mkNum);
  const [input,    setInput]    = useState(mkStr);
  const [visible,  setVisible]  = useState(mkBool);
  const [elapsed,  setElapsed]  = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef();

  // 3-round scores
  const [playScores, setPlayScores] = useState([]);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [apiResult,  setApiResult]  = useState(null);
  const [apiError,   setApiError]   = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ranking,     setRanking]       = useState(null);

  // on mount: require login
  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login', { state: { from: '/games/sudoku' } });
    } else {
      startGame();
    }
  }, [userInfo, navigate]);

  function startGame() {
    clearInterval(timerRef.current);

    // new puzzle
    const sol = generateSolution();
    setSolution(sol);

    // reveal exactly two clues
    const vis = mkBool();
    let count = 0;
    while (count < 2) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      if (!vis[r][c]) {
        vis[r][c] = true;
        count++;
      }
    }
    setVisible(vis);

    // initialize input: clues shown, rest blank
    setInput(
      sol.map((row, r) =>
        row.map((v, c) => (vis[r][c] ? v.toString() : ''))
      )
    );

    setElapsed(0);
    setGameOver(false);

    // start timer
    timerRef.current = setInterval(() => {
      setElapsed((e) => +(e + 0.1).toFixed(1));
    }, 100);
  }

  function handleChange(r, c, val) {
    if (gameOver || visible[r]?.[c]) return;
    if (!/^[1-3]?$/.test(val)) return;
    const nxt = input.map((row) => row.slice());
    nxt[r][c] = val;
    setInput(nxt);
  }

  // check every row & column is a permutation of [1,2,3]
  function checkSolution() {
    // all cells filled?
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (input[i][j] === '') {
          toast.error('Please fill all cells');
          return;
        }
      }
    }
    // rows & cols
    for (let i = 0; i < SIZE; i++) {
      const rowSet = new Set(input[i].map((v) => Number(v)));
      const colSet = new Set(input.map((row) => Number(row[i])));
      if (rowSet.size !== SIZE || colSet.size !== SIZE) {
        toast.error('Incorrect Sudoku...');
        return;
      }
      for (let n = 1; n <= SIZE; n++) {
        if (!rowSet.has(n) || !colSet.has(n)) {
          toast.error('Incorrect Sudoku...');
          return;
        }
      }
    }
    // passed!
    finishRound();
  }

  function finishRound() {
    clearInterval(timerRef.current);
    setGameOver(true);

    // inverted scoring: baseline 100 minus seconds taken
    const roundScore = Math.max(0, Math.round(1000 - elapsed));

    setPlayScores((prev) => {
      const upd = [...prev, roundScore];
      if (upd.length === 3) {
        // send all 3 at once
        (async () => {
          try {
            setApiError(null);
            const res = await axios.post(
              `${BACKEND_URL}/game/gameScore/`,
              {
                game_name:   GAME_NAME,
                game1Score:  upd[0],
                game2Score:  upd[1],
                game3Score:  upd[2],
              },
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            setApiResult(res.data);
            setModalOpen(true);
          } catch {
            setApiError('Failed to submit scores.');
            setModalOpen(true);
          }
        })();
        return [];
      }
      return upd;
    });
  }

  // fetch ranking
  async function fetchRank() {
    try {
      const res = await axios.get(
        `${BACKEND_URL}/game/gameRank/${encodeURIComponent(GAME_NAME)}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setRanking(res.data.rank ?? null);
    } catch {
      setRanking(null);
    }
  }
  useEffect(() => {
    if (userInfo?.token) fetchRank();
  }, [userInfo]);

  // prepare assessment payload
  function getAssessment() {
    return {
      game_name:      GAME_NAME,
      recommendation: apiResult?.cognitive_report?.recommendation || '',
      ...apiResult?.cognitive_report?.trait_scores,
      feedback:       feedbackText || '',
    };
  }
  async function handleSubmit() {
    setSubmitStatus(null);
    try {
      await axios.post(
        `${BACKEND_URL}/game/gameassessment`,
        getAssessment(),
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setModalOpen(false);
      setFeedbackOpen(false);
      toast.success('Assessment submitted!');
      fetchRank();
    } catch {
      setSubmitStatus('Submission failed.');
    }
  }

  const scores = [0, 1, 2].map((i) => playScores[i] ?? null);

  return (
    <div className="min-h-screen bg-green-50 py-4">
      <ToastContainer position="top-right" />

      {/* Insights Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full p-6 z-50 max-h-[80vh] overflow-auto">
            <DialogTitle className="text-2xl font-bold text-green-800 text-center mb-4">
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
                          <span className="font-bold text-green-700">{v ?? '-'}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                {/* Traits */}
                <div className="font-semibold text-gray-700 mb-1">Trait Scores:</div>
                <div className="space-y-3 max-h-[40vh] overflow-y-auto px-2">
                  {apiResult.cognitive_report?.trait_scores ? (
                    Object.entries(apiResult.cognitive_report.trait_scores)
                      .slice(0, 5)
                      .map(([t, v], i) => {
                        const pct = Math.max(0, Math.min(100, Number(v)));
                        const cols = ['bg-blue-500','bg-green-500','bg-yellow-500','bg-purple-500','bg-pink-500'];
                        return (
                          <div key={t} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-gray-700">
                              <span className="capitalize">{t.replace(/_/g, ' ')}</span>
                              <span className="text-green-700 font-bold">{pct}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`${cols[i % cols.length]} h-3 rounded-full`} style={{width:`${pct}%`}}/>
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
                {submitStatus && (
                  <div className={`mt-3 text-center text-sm font-semibold ${submitStatus.includes('success')?'text-green-600':'text-red-600'}`}>
                    {submitStatus}
                  </div>
                )}
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setFeedbackOpen(true)} className="w-1/2 bg-gray-200 text-green-800 py-2 rounded-lg hover:bg-gray-300 transition text-sm">Feedback</button>
                  <button onClick={handleSubmit} className="w-1/2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm">Submit</button>
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
            <DialogTitle className="text-2xl font-bold text-green-800 text-center mb-4">Feedback</DialogTitle>
            <textarea
              className="w-full min-h-[120px] p-3 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
              placeholder="Share your thoughts…"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setFeedbackOpen(false)} className="bg-gray-200 text-green-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm">Cancel</button>
              <button onClick={() => setFeedbackOpen(false)} disabled={!feedbackText.trim()} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Main UI */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-600 p-4 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Sudoku (3×3)</h1>
            <div className="text-sm">Time: {elapsed.toFixed(1)}s</div>
          </div>
          {/* grid */}
          <div className="p-6 grid grid-cols-3 gap-2">
            {input.map((row, r) =>
              row.map((val, c) => (
                <input
                  key={`${r}-${c}`}
                  type="text"
                  maxLength={1}
                  disabled={gameOver || visible[r][c]}
                  value={val}
                  onChange={(e) => handleChange(r, c, e.target.value)}
                  className="w-full h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
                />
              ))
            )}
          </div>
          {/* controls */}
          {!gameOver ? (
            <div className="text-center mb-4">
              <button onClick={checkSolution} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition text-sm">
                Check
              </button>
            </div>
          ) : (
            <div className="text-center mb-4">
              <button onClick={startGame} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition text-sm">
                Play Round
              </button>
            </div>
          )}
        </div>

        {/* Scores & Ranking */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-5">
            <h2 className="font-bold text-green-800 mb-2">Round Scores</h2>
            <ul className="space-y-1">
              {scores.map((s, i) => (
                <li key={i}>
                  {i + 1}ⁿᵈ: {s != null ? s : <span className="italic text-gray-400">not played</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-5 text-center">
            <h2 className="font-bold text-green-800 mb-2">Your Ranking</h2>
            <div className={`text-4xl font-extrabold ${
              ranking != null && ranking <= 10 ? 'text-green-500 animate-pulse' : 'text-gray-700'
            }`}>
              {ranking != null ? `#${ranking}` : '-'}
            </div>
            <p className="text-xs text-gray-500 mt-1">(Top 10 get a badge!)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
