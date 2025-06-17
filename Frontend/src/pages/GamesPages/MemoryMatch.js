import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const shapes = [
    { type: 'circle', color: '#4CAF50' },
    { type: 'triangle', color: '#2196F3' },
    { type: 'square', color: '#FFC107' },
    { type: 'hexagon', color: '#FF5722' },
    { type: 'pentagon', color: '#9C27B0' },
    { type: 'star', color: '#E91E63' },
];

function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function drawShape(ctx, shape, x, y, size) {
    ctx.save();
    ctx.translate(x + size / 2, y + size / 2);
    ctx.fillStyle = shape.color;
    switch (shape.type) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, size / 2 - 5, 0, 2 * Math.PI);
            ctx.fill();
            break;
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -size / 2 + 5);
            ctx.lineTo(size / 2 - 5, size / 2 - 5);
            ctx.lineTo(-size / 2 + 5, size / 2 - 5);
            ctx.closePath();
            ctx.fill();
            break;
        case 'square':
            ctx.fillRect(-size / 2 + 5, -size / 2 + 5, size - 10, size - 10);
            break;
        case 'hexagon':
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(
                    (size / 2 - 5) * Math.cos((Math.PI / 3) * i),
                    (size / 2 - 5) * Math.sin((Math.PI / 3) * i)
                );
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'pentagon':
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                    (size / 2 - 5) * Math.cos((2 * Math.PI * i) / 5 - Math.PI / 2),
                    (size / 2 - 5) * Math.sin((2 * Math.PI * i) / 5 - Math.PI / 2)
                );
            }
            ctx.closePath();
            ctx.fill();
            break;
        case 'star':
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const r = i % 2 === 0 ? size / 2 - 5 : size / 4;
                ctx.lineTo(
                    r * Math.cos((Math.PI / 5) * i - Math.PI / 2),
                    r * Math.sin((Math.PI / 5) * i - Math.PI / 2)
                );
            }
            ctx.closePath();
            ctx.fill();
            break;
        default:
            break;
    }
    ctx.restore();
}

const gridSize = 4; // 4x4 grid
const totalCards = gridSize * gridSize;
const cardSize = 70;

const generateCards = () => {
    let pairs = shuffle([...shapes, ...shapes]);
    if (pairs.length > totalCards) pairs = pairs.slice(0, totalCards);
    return shuffle(pairs.map((shape, i) => ({ ...shape, id: i })));
};

const T_TOTAL = 10; // seconds

const MemoryMatch = () => {
    const [cards, setCards] = useState(generateCards());
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [score, setScore] = useState(0); // pairs matched
    const [moves, setMoves] = useState(0);
    const [lock, setLock] = useState(true); // locked during initial reveal
    const [initialReveal, setInitialReveal] = useState(true);
    const [timer, setTimer] = useState(T_TOTAL);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [finalScore, setFinalScore] = useState(null);
    const timerRef = React.useRef();
    const matchedRef = React.useRef(matched);
    const movesRef = React.useRef(moves);
    const { userInfo } = React.useContext(UserContext);
    const navigate = useNavigate();
    const [playScores, setPlayScores] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [apiResult, setApiResult] = useState(null);
    const [apiError, setApiError] = useState(null);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [submitStatus, setSubmitStatus] = useState(null);
    const [ranking, setRanking] = useState(null);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    // Keep refs updated
    useEffect(() => {
        matchedRef.current = matched;
    }, [matched]);

    useEffect(() => {
        movesRef.current = moves;
    }, [moves]);

    // Initial reveal effect
    useEffect(() => {
        setFlipped(cards.map((_, idx) => idx));
        setLock(true);
        setInitialReveal(true);
        setTimer(T_TOTAL);
        setGameStarted(false);
        setGameOver(false);
        setFinalScore(null);
        clearInterval(timerRef.current);
        const timerId = setTimeout(() => {
            setFlipped([]);
            setLock(false);
            setInitialReveal(false);
        }, 2000);
        return () => clearTimeout(timerId);
    }, [cards]);

    // Timer effect
    useEffect(() => {
        if (gameStarted && !gameOver) {
            timerRef.current = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 0.05) {
                        clearInterval(timerRef.current);
                        handleGameEnd();
                        return 0;
                    }
                    return +(prev - 0.05).toFixed(2);
                });
            }, 50);
            return () => clearInterval(timerRef.current);
        }
    }, [gameStarted, gameOver]);

    // End game if all pairs matched
    useEffect(() => {
        if (matched.length === cards.length && !gameOver && gameStarted) {
            clearInterval(timerRef.current);
            handleGameEnd();
        }
    }, [matched, cards, gameStarted, gameOver]);

    // Matching logic
    useEffect(() => {
        if (flipped.length === 2 && !initialReveal && !gameOver) {
            setLock(true);
            setTimeout(() => {
                const [i, j] = flipped;
                if (
                    cards[i].type === cards[j].type &&
                    cards[i].color === cards[j].color
                ) {
                    setMatched((prev) => [...prev, i, j]);
                    setScore((s) => s + 1);
                }
                setFlipped([]);
                setMoves((m) => m + 1);
                setLock(false);
            }, 800);
        }
    }, [flipped, cards, initialReveal, gameOver]);

    // Require login to play
    useEffect(() => {
        if (!userInfo || !userInfo.token) {
            navigate('/login', { state: { from: '/games/memory-match' } });
        }
    }, [userInfo, navigate]);

    // Update playScores on game over
    useEffect(() => {
        if (gameOver && gameStarted) {
            setPlayScores(prev => {
                let updated = [...prev, finalScore];
                if (updated.length === 3) {
                    // Send API request
                    (async () => {
                        try {
                            setApiError(null);
                            const res = await axios.post(
                                `${BACKEND_URL}/game/gameScore/`,
                                {
                                    game_name: 'memory match',
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
                if (updated.length > 3) updated = [finalScore];
                return updated.length > 3 ? [finalScore] : updated;
            });
        }
        // eslint-disable-next-line
    }, [gameOver]);

    // For display: fill with nulls for 'not played'
    const scores = [0, 1, 2].map(i => playScores[i] !== undefined ? playScores[i] : null);

    // Fetch latest rank from API
    const fetchLatestRank = async () => {
        try {
            const res = await axios.get(`${BACKEND_URL}/game/gameRank/${encodeURIComponent('memory match')}`,
                {
                    headers: {
                        Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : '',
                    },
                }
            );
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
            game_name: 'memory match',
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

    const handleCardClick = (idx) => {
        if (lock || flipped.includes(idx) || matched.includes(idx) || gameOver) return;
        if (!gameStarted && !initialReveal) {
            setGameStarted(true);
        }
        setFlipped((prev) => [...prev, idx]);
    };

    const handleRestart = () => {
        clearInterval(timerRef.current);
        setCards([]); // Clear old cards to force DOM clean

        setTimeout(() => {
            const newCards = generateCards();
            setCards(newCards);
            setFlipped(newCards.map((_, idx) => idx)); // Initial reveal
            setMatched([]);
            setScore(0);
            setMoves(0);
            setLock(true);
            setInitialReveal(true);
            setTimer(T_TOTAL);
            setGameStarted(false);
            setGameOver(false);
            setFinalScore(null);

            setTimeout(() => {
                setFlipped([]);
                setLock(false);
                setInitialReveal(false);
            }, 2000);
        }, 50); // short delay ensures visual reset
    };


    const handleGameEnd = () => {
        setGameOver(true);
        clearInterval(timerRef.current);

        const P = Math.floor(matchedRef.current.length / 2); // pairs matched
        // Simple scoring: 10 points per pair minus moves
        const S = P > 0 ? P * 10 - movesRef.current : 0;
        setFinalScore(S >= 0 ? S : 0);
    };

    return (
        <div className="min-h-screen bg-green-100 py-4 pt-0">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            
            
            {/* Game Insights Modal */}
                <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black opacity-30" />
                    <div
                    className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full mx-auto p-6 z-50
                                max-h-[80vh] overflow-auto"
                    >
                    <DialogTitle className="text-2xl font-bold text-green-800 text-center mb-4">
                        Game Insights
                    </DialogTitle>

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
                                        <span className="font-bold text-green-700">{value ?? '-'}</span>
                                    </li>
                                    ))
                                : <li className="col-span-2 text-gray-400">No meta data available.</li>}
                            </ul>
                        </div>

                        {/* Trait Scores Section */}
                        <div className="font-semibold text-gray-700 mb-1">Trait Scores:</div>
                        <div className="space-y-3">
                            {apiResult.cognitive_report?.trait_scores ? (
                            Object.entries(apiResult.cognitive_report.trait_scores)
                                .slice(0, 5)
                                .map(([trait, value], idx) => {
                                const percent = Math.max(0, Math.min(100, Number(value)));
                                const colors = [
                                    'bg-blue-500',
                                    'bg-green-500',
                                    'bg-yellow-500',
                                    'bg-purple-500',
                                    'bg-pink-500',
                                ];
                                const barColor = colors[idx % colors.length];
                                return (
                                    <div key={trait} className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs font-medium text-gray-700">
                                        <span className="capitalize">{trait.replace(/_/g, ' ')}</span>
                                        <span className="text-green-700 font-bold">{percent}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${barColor}`}
                                        style={{ width: `${percent}%` }}
                                        ></div>
                                    </div>
                                    </div>
                                );
                                })
                            ) : (
                            <div className="text-gray-400">No trait scores available.</div>
                            )}
                        </div>

                        {/* Recommendation Section */}
                        <div className="mb-4">
                            <div className="font-semibold text-gray-700 mb-1">Recommendation:</div>
                            <div className="text-gray-800 text-sm">
                            {apiResult.cognitive_report?.recommendation || 'No recommendation available.'}
                            </div>
                        </div>

                        {/* Status & Buttons */}
                        <div
                            className={`mt-3 text-center text-sm font-semibold ${
                            submitStatus && submitStatus.includes('success')
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                        >
                            {submitStatus}
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                            onClick={() => setFeedbackOpen(true)}
                            className="w-1/2 bg-gray-200 text-green-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                            >
                            Feedback
                            </button>
                            <button
                            onClick={handleSubmitAssessment}
                            className="w-1/2 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm"
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

                {/* Feedback Modal */}
                <Dialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} className="fixed inset-0 z-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-black opacity-30" />
                    <div
                    className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto p-6 z-50
                                max-h-[70vh] overflow-auto"
                    >
                    <DialogTitle className="text-2xl font-bold text-green-800 text-center mb-4">
                        Feedback
                    </DialogTitle>
                    <textarea
                        className="w-full min-h-[120px] p-3 border border-green-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400 text-base mb-4"
                        placeholder="Share your thoughts, suggestions, or how you felt about the game..."
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        maxLength={500}
                    />
                    <div className="flex justify-end gap-4 mt-2">
                        <button
                        className="bg-gray-200 text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
                        onClick={() => setFeedbackOpen(false)}
                        >
                        Cancel
                        </button>
                        <button
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm"
                        onClick={() => setFeedbackOpen(false)}
                        disabled={feedbackText.trim().length === 0}
                        >
                        Save
                        </button>
                    </div>
                    </div>
                </div>
                </Dialog>





            
            <div className="max-w-6xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#4caf50] p-3">
                        <h1 className="text-xl font-bold text-white text-center">Memory Match</h1>
                        <p className="text-white/80 text-center text-sm">Flip cards to find all matching pairs! You have 10 seconds.</p>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        {/* Left side - Scores and Last Result */}
                        <div className="w-full md:w-1/4 p-4 bg-gradient-to-b from-green-50 to-green-100 flex flex-col gap-6">
                            {/* Game Scores Card */}
                            <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center border border-green-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block bg-green-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z' /></svg></span>
                                    <h3 className="text-lg font-bold text-green-900">Game Scores</h3>
                                </div>
                                <ul className="text-base text-green-800 space-y-1 w-full">
                                    <li>1st game score: {scores[0] !== null ? scores[0] : <span className="italic text-gray-500">not played</span>}</li>
                                    <li>2nd game score: {scores[1] !== null ? scores[1] : <span className="italic text-gray-500">not played</span>}</li>
                                    <li>3rd game score: {scores[2] !== null ? scores[2] : <span className="italic text-gray-500">not played</span>}</li>
                                </ul>
                            </div>
                            {/* Last Game Result */}
                            {gameOver && (
                                <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center border border-green-100 mt-4">
                                    <div className="text-lg font-bold text-green-800 mb-2">Last Game Result</div>
                                    <div className="text-green-700 text-base">Time's up!</div>
                                    <div className="text-green-700 text-base">Final Score: {finalScore}</div>
                                    <div className="text-green-700 text-base">Pairs matched: {Math.floor(matched.length / 2)}</div>
                                    <div className="text-green-700 text-base">Moves: {moves}</div>
                                </div>
                            )}
                        </div>
                        {/* Center - Game */}
                        <div className="w-full md:w-2/4 flex flex-col items-center justify-center p-4">
                            {/* Timer and Restart */}
                            <div className="flex items-center gap-8 mb-4">
                                <div className="text-lg text-green-800 font-semibold">Timer: {timer.toFixed(2)}s</div>
                                <button
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
                                    onClick={handleRestart}
                                >Restart</button>
                            </div>
                            <div
                                className="grid grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-lg"
                                style={{ width: gridSize * (cardSize + 16) }}
                            >
                                {cards.map((card, idx) => (
                                    <div
                                        key={card.id}
                                        className={`relative cursor-pointer select-none border-2 rounded-lg flex items-center justify-center bg-green-50 ${flipped.includes(idx) || matched.includes(idx)
                                            ? 'border-green-500'
                                            : 'border-green-200'
                                            }`}
                                        onClick={() => handleCardClick(idx)}
                                        style={{ width: cardSize, height: cardSize }}
                                    >
                                        {(flipped.includes(idx) || matched.includes(idx)) ? (
                                            <canvas
                                                width={cardSize}
                                                height={cardSize}
                                                ref={el => {
                                                    if (el) drawShape(el.getContext('2d'), card, 0, 0, cardSize);
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl text-green-400">?</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {matched.length === cards.length && !gameOver && (
                                <div className="mt-6 text-2xl text-green-700 font-bold">Congratulations! You matched all pairs!</div>
                            )}
                        </div>
                        {/* Right side - Ranking and How to Play */}
                        <div className="w-full md:w-1/4 p-4 bg-gradient-to-b from-green-50 to-green-100 flex flex-col gap-6 items-center">
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
                                        <span className="ml-2 text-yellow-400 animate-bounce"><svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='currentColor' viewBox='0 0 20 20'><path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.049 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z' /></svg></span>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500">(Top 10 get a special badge!)</div>
                            </div>
                            {/* How to play Timeline */}
                            <div className="bg-white rounded-xl shadow-md p-5 w-full border border-green-100 mt-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-block bg-green-100 p-2 rounded-full"><svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 text-green-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12h6m-3-3v6m9 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg></span>
                                    <h4 className="text-md font-bold text-green-800">How to play</h4>
                                </div>
                                <ol className="relative border-l border-green-200 ml-3 mt-2 space-y-4">
                                    <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Click any card to flip it over.</li>
                                    <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Find and match all pairs before time runs out.</li>
                                    <li className="ml-4"><span className="absolute -left-2 top-1 w-3 h-3 bg-green-400 rounded-full"></span>Try to beat your high score and improve your memory!</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryMatch;
