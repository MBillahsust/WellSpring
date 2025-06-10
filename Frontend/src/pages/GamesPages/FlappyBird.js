import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlay, FaRedo, FaHeart, FaStar, FaSmile, FaThumbsUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FlappyBird = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [playScores, setPlayScores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const gameStateRef = useRef({
    bird: {
      x: 50,
      y: 150,
      velocity: 0,
      gravity: 0.5,
      jump: -8,
      size: 30,
      rotation: 0
    },
    pipes: {
      width: 60,
      gap: 150,
      speed: 2,
      positions: []
    }
  });
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [ranking, setRanking] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  // Encouraging messages
  const messages = [
    { text: "You're doing great! Keep going!", icon: <FaHeart className="text-red-500" /> },
    { text: "Focus on your breathing as you play.", icon: <FaSmile className="text-yellow-500" /> },
    { text: "Every small step counts toward progress.", icon: <FaStar className="text-yellow-500" /> },
    { text: "You're building resilience with each try!", icon: <FaThumbsUp className="text-blue-500" /> },
    { text: "Stay present in the moment.", icon: <FaHeart className="text-red-500" /> }
  ];

  // Change message periodically
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver]);

  // Change message when score changes
  useEffect(() => {
    if (gameStarted && !gameOver && score > 0) {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }
  }, [score, gameStarted, gameOver]);

  // Initialize canvas context
  useEffect(() => {
    if (gameRef.current) {
      const ctx = gameRef.current.getContext('2d');
      // Set initial background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, gameRef.current.width, gameRef.current.height);
    }
  }, []);

  // Game loop effect
  useEffect(() => {
    if (gameStarted && !gameOver) {
      startGame();
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    const { bird, pipes } = gameStateRef.current;
    bird.y = 150;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes.positions = [];
    setScore(0);
    setGameOver(false);
    gameLoop();
  };

  const gameLoop = () => {
    if (!gameRef.current || gameOver) return;

    const ctx = gameRef.current.getContext('2d');
    const { bird, pipes } = gameStateRef.current;

    // Clear canvas with background color
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, gameRef.current.width, gameRef.current.height);

    // Update bird position and rotation
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Update rotation based on velocity
    bird.rotation = Math.min(Math.max(bird.velocity * 2, -30), 30);

    // Draw Apple logo
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation * Math.PI / 180);

    // Draw apple body
    ctx.fillStyle = '#999';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    // Draw apple stem
    ctx.fillStyle = '#666';
    ctx.fillRect(-2, -15, 4, 5);

    // Draw apple leaf
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.ellipse(5, -15, 5, 3, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw bite
    ctx.fillStyle = '#87CEEB';
    ctx.beginPath();
    ctx.arc(10, 5, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Generate and update pipes
    if (pipes.positions.length === 0 || pipes.positions[pipes.positions.length - 1].x < gameRef.current.width - 200) {
      const height = Math.random() * (gameRef.current.height - pipes.gap - 100) + 50;
      pipes.positions.push({
        x: gameRef.current.width,
        topHeight: height,
        bottomHeight: gameRef.current.height - height - pipes.gap,
        passed: false
      });
    }

    // Draw and update pipes
    pipes.positions.forEach((pipe) => {
      pipe.x -= pipes.speed;

      // Draw top pipe
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(pipe.x, 0, pipes.width, pipe.topHeight);

      // Draw pipe cap
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(pipe.x - 5, pipe.topHeight - 10, pipes.width + 10, 10);

      // Draw bottom pipe
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(pipe.x, gameRef.current.height - pipe.bottomHeight, pipes.width, pipe.bottomHeight);

      // Draw pipe cap
      ctx.fillStyle = '#388E3C';
      ctx.fillRect(pipe.x - 5, gameRef.current.height - pipe.bottomHeight, pipes.width + 10, 10);

      // Check collision
      if (
        bird.x + 15 > pipe.x &&
        bird.x - 15 < pipe.x + pipes.width &&
        (bird.y - 15 < pipe.topHeight || bird.y + 15 > gameRef.current.height - pipe.bottomHeight)
      ) {
        setGameOver(true);
        return;
      }

      // Update score
      if (pipe.x + pipes.width < bird.x && !pipe.passed) {
        pipe.passed = true;
        setScore(prev => prev + 1);
      }
    });

    // Remove off-screen pipes
    pipes.positions = pipes.positions.filter(pipe => pipe.x > -pipes.width);

    // Check boundaries
    if (bird.y < 0 || bird.y > gameRef.current.height) {
      setGameOver(true);
      return;
    }

    if (!gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  const handleJump = () => {
    if (!userInfo || !userInfo.token) {
      navigate('/login', { state: { from: '/games/flappy-bird' } });
      return;
    }
    if (!gameStarted) {
      setGameStarted(true);
    } else if (!gameOver) {
      gameStateRef.current.bird.velocity = gameStateRef.current.bird.jump;
    }
  };

  const handleRestart = () => {
    setGameStarted(false);
    setGameOver(false);
    startGame();
  };

  // Add keyboard event listener for spacebar
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  // Update playScores on game over
  useEffect(() => {
    if (gameOver && gameStarted) {
      setPlayScores(prev => {
        let updated = [...prev, score];
        if (updated.length === 3) {
          // Send API request
          (async () => {
            try {
              setApiError(null);
              const res = await axios.post(
                `${BACKEND_URL}/game/gameScore/`,
                {
                  game_name: 'flappy bird',
                  game1Score: updated[0],
                  game2Score: updated[1],
                  game3Score: updated[2],
                },
                {
                  headers: {
                    Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : '',
                  },
                }
              );
              setApiResult(res.data);
              setModalOpen(true);
              setPlayScores([]); // reset after API call
            } catch (err) {
              setApiError('Failed to submit scores. Please try again.');
              setModalOpen(true);
              setPlayScores([]); // reset anyway
            }
          })();
        }
        if (updated.length > 3) updated = [score];
        return updated.length > 3 ? [score] : updated;
      });
    }
    // eslint-disable-next-line
  }, [gameOver]);

  // For display: fill with nulls for 'not played'
  const scores = [0, 1, 2].map(i => playScores[i] !== undefined ? playScores[i] : null);

  // Fetch latest rank from API
  const fetchLatestRank = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/game/gameRank/${encodeURIComponent('flappy bird')}`, {
        headers: {
          Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : '',
        },
      });
      if (res.data && typeof res.data.rank !== 'undefined') {
        setRanking(res.data.rank);
      }
    } catch (err) {
      setRanking(null);
    }
  };

  // Fetch rank on mount and when userInfo changes
  useEffect(() => {
    if (userInfo && userInfo.token) {
      fetchLatestRank();
    }
    // eslint-disable-next-line
  }, [userInfo]);

  // Helper to get the latest API data for submit
  const getAssessmentPayload = () => {
    const cr = apiResult?.cognitive_report || {};
    const meta = apiResult?.meta || {};
    return {
      game_name: 'flappy bird',
      recommendation: cr.recommendation || '',
      attention: cr.trait_scores?.attention ?? '',
      focus: cr.trait_scores?.focus ?? '',
      short_term_memory: cr.trait_scores?.short_term_memory ?? '',
      reaction_time: cr.trait_scores?.reaction_time ?? '',
      working_memory: cr.trait_scores?.working_memory ?? '',
      hand_eye_coordination: cr.trait_scores?.hand_eye_coordination ?? '',
      stress_response: cr.trait_scores?.stress_response ?? '',
      feedback: feedbackText || '',
    };
  };

  const handleSubmitAssessment = async () => {
    setSubmitStatus(null);
    try {
      await axios.post(`${BACKEND_URL}/game/gameassessment`, getAssessmentPayload(), {
        headers: {
          Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : '',
        },
      });
      //setSubmitStatus('Assessment submitted successfully!');
      setModalOpen(false);
      setFeedbackOpen(false);
      toast.success('Assessment submitted successfully!');
      fetchLatestRank();
    } catch (err) {
      setSubmitStatus('Failed to submit assessment. Please try again.');
    }
  };

  // AnimatedBar component for dynamic fill (animate only once per modal open)
  const AnimatedBar = ({ value, color, trigger }) => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
      setWidth(0); // reset on trigger change
      const timeout = setTimeout(() => setWidth(value), 100);
      return () => clearTimeout(timeout);
    }, [trigger, value]);
    return (
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    );
  };

  // Track modal open to trigger animation only once
  const [barAnimTrigger, setBarAnimTrigger] = useState(0);
  useEffect(() => {
    if (modalOpen) setBarAnimTrigger(prev => prev + 1);
  }, [modalOpen]);

  return (
    <div className="min-h-screen bg-gray-100 py-4 pt-0">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-auto p-6 z-50 overflow-visible">
            <DialogTitle className="text-2xl font-bold text-blue-800 text-center mb-4">Game Insights</DialogTitle>
            {apiError ? (
              <div className="text-red-600 font-semibold mb-3 text-center">{apiError}</div>
            ) : apiResult ? (
              <>
                {/* Meta Section */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Meta:</div>
                  <ul className="text-sm text-gray-700 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1">
                    {apiResult.meta
                      ? Object.entries(apiResult.meta)
                        .filter(([meta]) => meta !== 'rank')
                        .map(([meta, value]) => (
                          <li key={meta} className="capitalize flex justify-between">
                            <span>{meta.replace(/_/g, ' ')}:</span>
                            <span className="font-bold text-blue-700">{value ?? '-'}</span>
                          </li>
                        ))
                      : <li className="col-span-2 text-gray-400">No meta data available.</li>}
                  </ul>
                </div>

                {/* Trait Scores Section */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Trait Scores:</div>
                  <div className="space-y-3">
                    {apiResult.cognitive_report?.trait_scores ? (
                      Object.entries(apiResult.cognitive_report.trait_scores)
                        .slice(0, 5)
                        .map(([trait, value], idx) => {
                          const percent = Math.max(0, Math.min(100, Number(value)));
                          const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
                          const barColor = colors[idx % colors.length];
                          return (
                            <div key={trait} className="flex flex-col gap-1">
                              <div className="flex justify-between text-xs font-medium text-gray-700">
                                <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                                <span className="text-blue-700 font-bold">{percent}</span>
                              </div>
                              <AnimatedBar value={percent} color={barColor} trigger={barAnimTrigger} />
                            </div>
                          );
                        })
                    ) : (
                      <div className="text-gray-400">No trait scores available.</div>
                    )}
                  </div>
                </div>

                {/* Recommendation Section */}
                <div className="mb-4">
                  <div className="font-semibold text-gray-700 mb-1">Recommendation:</div>
                  <div className="text-gray-800 text-sm">{apiResult.cognitive_report?.recommendation || 'No recommendation available.'}</div>
                </div>

                {/* Status & Buttons */}
                {submitStatus && (
                  <div className={`mt-3 text-center text-sm font-semibold ${submitStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {submitStatus}
                  </div>
                )}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="w-1/2 bg-gray-200 text-blue-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                  >
                    Feedback
                  </button>
                  <button
                    onClick={handleSubmitAssessment}
                    className="w-1/2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                  >
                    Submit
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-600 text-center">Loading...</div>
            )}
          </div>
        </div>
      </Dialog>


      <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} className="fixed z-50 inset-0">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6 z-50 overflow-visible">
            <DialogTitle className="text-2xl font-bold text-blue-800 text-center mb-4">Feedback</DialogTitle>
            <textarea
              className="w-full min-h-[120px] p-3 border border-blue-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 text-base mb-4"
              placeholder="Share your thoughts, suggestions, or how you felt about the game..."
              value={feedbackText}
              onChange={e => setFeedbackText(e.target.value)}
              maxLength={500}
            />
            <div className="flex justify-end gap-4 mt-2">
              <button
                className="bg-gray-200 text-blue-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                onClick={() => setFeedbackOpen(false)}
              >Cancel</button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                onClick={() => { setFeedbackOpen(false); }}
                disabled={feedbackText.trim().length === 0}
              >Save</button>
            </div>
          </div>
        </div>
      </Dialog>

      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#6d8ded] p-3">
            <h1 className="text-xl font-bold text-white text-center">Flappy Apple</h1>
            <p className="text-white/80 text-center text-sm">Click or press space to jump!</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Scores and How to play */}
            <div className="w-full md:w-1/4 p-4 bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col gap-6">
              {/* Game Scores Card */}
              <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-blue-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg></span>
                  <h3 className="text-lg font-bold text-blue-900">Game Scores</h3>
                </div>
                <ul className="text-base text-blue-800 space-y-1 w-full">
                  <li>1st game score: {scores[0] !== null ? scores[0] : <span className="italic text-gray-500">not played</span>}</li>
                  <li>2nd game score: {scores[1] !== null ? scores[1] : <span className="italic text-gray-500">not played</span>}</li>
                  <li>3rd game score: {scores[2] !== null ? scores[2] : <span className="italic text-gray-500">not played</span>}</li>
                </ul>
              </div>
              {/* How to play Timeline */}
              <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-green-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></span>
                  <h4 className="text-md font-bold text-green-800">How to play</h4>
                </div>
                <ol className="relative border-l border-green-200 ml-3 mt-2 space-y-4">
                  <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Click the game area or press the spacebar to make the Apple logo jump.</li>
                  <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Avoid hitting the pipes or falling off the screen.</li>
                  <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Try to beat your high score!</li>
                </ol>
              </div>
            </div>

            {/* Center - Game */}
            <div className="w-full md:w-2/4 p-4">
              <div className="relative">
                <canvas
                  ref={gameRef}
                  width={320}
                  height={320}
                  className="w-full"
                  onClick={handleJump}
                  tabIndex={0}
                />

                {!gameStarted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={handleJump}
                      className="bg-[#6d8ded] text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#5a7ad9] transition-colors text-sm"
                    >
                      <FaPlay />
                      <span>Start Game</span>
                    </button>
                  </div>
                )}

                {gameOver && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                    <h2 className="text-xl font-bold text-white mb-2">Game Over!</h2>
                    <p className="text-white mb-2">Score: {score}</p>
                    <button
                      onClick={handleRestart}
                      className="bg-[#6d8ded] text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#5a7ad9] transition-colors text-sm"
                    >
                      <FaRedo />
                      <span>Play Again</span>
                    </button>
                  </div>
                )}

                <div className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded-lg">
                  <p className="text-base font-semibold">Score: {score}</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">Click or press space to make the Apple logo jump</p>
              </div>
            </div>

            {/* Right side - Ranking, Tips, Benefits */}
            <div className="w-full md:w-1/4 p-4 bg-gradient-to-b from-blue-50 to-blue-100 flex flex-col gap-6 items-center">
              {/* Ranking Card */}
              <div className="bg-white rounded-xl shadow-md p-5 w-full flex flex-col items-center border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-yellow-100 p-2 rounded-full">
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6 text-yellow-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
                  </span>
                  <h3 className="text-lg font-bold text-indigo-900">Your Ranking</h3>
                </div>
                <div className="flex items-center justify-center mt-2 mb-1">
                  <span className={`text-4xl font-extrabold ${ranking !== null && ranking <= 10 ? 'text-yellow-500 animate-pulse drop-shadow-lg' : 'text-indigo-600'}`}>{ranking !== null ? `#${ranking}` : '-'}</span>
                  {ranking !== null && ranking <= 10 && (
                    <span className="ml-2 text-yellow-400 animate-bounce"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z'/></svg></span>
                  )}
                </div>
                <div className="text-xs text-gray-500">(Top 10 get a special badge!)</div>
              </div>
              {/* Mental Health Tips Card */}
              <div className="bg-white rounded-xl shadow-md p-5 w-full border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-blue-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg></span>
                  <h3 className="text-md font-bold text-blue-800">Mental Health Tips</h3>
                </div>
                <div className="h-20 flex items-center justify-center">
                  <div className="text-center w-full">
                    <div className="flex justify-center mb-2 text-2xl">
                      {messages[messageIndex].icon}
                    </div>
                    <p className="text-blue-800 font-medium text-sm">
                      {messages[messageIndex].text}
                    </p>
                  </div>
                </div>
              </div>
              {/* Benefits of Gaming Card */}
              <div className="bg-white rounded-xl shadow-md p-5 w-full border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-block bg-green-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></span>
                  <h4 className="text-md font-bold text-green-800">Benefits of Gaming</h4>
                </div>
                <ul className="text-xs text-gray-600 space-y-1 mt-2">
                  <li>• Improves focus and concentration</li>
                  <li>• Reduces stress and anxiety</li>
                  <li>• Enhances problem-solving skills</li>
                  <li>• Provides a sense of accomplishment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird; 