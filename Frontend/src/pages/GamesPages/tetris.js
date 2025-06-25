// src/pages/GamesPages/GameTetris.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import { Dialog, DialogTitle } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const GAME_NAME = 'tetris';
// Tetromino shapes
const SHAPES = [
  [[1,1,1,1]], // I
  [[1,1],[1,1]], // O
  [[0,1,1],[1,1,0]], // Z
  [[1,1,0],[0,1,1]], // S
  [[1,0,0],[1,1,1]], // J
  [[0,0,1],[1,1,1]], // L
  [[0,1,0],[1,1,1]]  // T
];
function rotate(shape) {
  if (!shape) return shape;
  const H = shape.length, W = shape[0].length;
  const res = Array(W).fill(0).map(() => Array(H).fill(0));
  for (let r = 0; r < H; r++)
    for (let c = 0; c < W; c++)
      res[c][H - 1 - r] = shape[r][c];
  return res;
}

export default function GameTetris() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const dropRef = useRef(null);

  const [grid, setGrid] = useState(
    Array(ROWS).fill(0).map(() => Array(COLS).fill(0))
  );
  const [piece, setPiece] = useState(null);
  const [pos, setPos] = useState({ r: 0, c: 3 });
  const [elapsed, setElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // scoring rounds
  const [playScores, setPlayScores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [apiResult, setApiResult] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);
  const [ranking, setRanking] = useState(null);

  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login', { state: { from: '/games/tetris' } });
    } else {
      startGame();
    }
    return () => {
      clearInterval(dropRef.current);
      clearInterval(timerRef.current);
    };
  }, [userInfo, navigate]);

  function startGame() {
    clearInterval(dropRef.current);
    clearInterval(timerRef.current);
    setGrid(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
    spawnPiece();
    setElapsed(0);
    setGameOver(false);
    dropRef.current = setInterval(() => drop(), 500);
    timerRef.current = setInterval(() => {
      setElapsed(e => +(e + 0.1).toFixed(1));
    }, 100);
  }

  function spawnPiece() {
    const shp = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    setPiece(shp);
    setPos({ r: 0, c: Math.floor((COLS - shp[0].length) / 2) });
  }

  function collide(rOff, cOff, shp) {
    if (!shp) return false;
    for (let r = 0; r < shp.length; r++) {
      for (let c = 0; c < shp[0].length; c++) {
        if (shp[r][c]) {
          const nr = rOff + r, nc = cOff + c;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || grid[nr][nc]) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function lockPiece() {
    const newGrid = grid.map(row => row.slice());
    piece.forEach((row, dr) =>
      row.forEach((v, dc) => {
        if (v) newGrid[pos.r + dr][pos.c + dc] = 1;
      })
    );
    const filtered = newGrid.filter(row => !row.every(x => x));
    const cleared = ROWS - filtered.length;
    const fresh = Array(cleared).fill(0).map(() => Array(COLS).fill(0));
    setGrid([...fresh, ...filtered]);
    spawnPiece();
  }

  function drop() {
    if (gameOver || !piece) return;
    const { r, c } = pos;
    if (!collide(r + 1, c, piece)) {
      setPos({ r: r + 1, c });
    } else {
      lockPiece();
      if (collide(pos.r, pos.c, piece)) {
        endGame();
      }
    }
  }

  function endGame() {
    clearInterval(dropRef.current);
    clearInterval(timerRef.current);
    setGameOver(true);
    const sc = Math.round(elapsed);
    setPlayScores(prev => {
      const upd = [...prev, sc];
      if (upd.length === 3) {
        (async () => {
          try {
            setApiError(null);
            const res = await axios.post(
              `${BACKEND_URL}/game/gameScore/`,
              { game_name: GAME_NAME, game1Score: upd[0], game2Score: upd[1], game3Score: upd[2] },
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

  // keyboard + manual controls
  useEffect(() => {
    function handler(e) {
      if (gameOver || !piece) return;
      const { r, c } = pos;
      if (e.key === 'ArrowLeft' && !collide(r, c - 1, piece)) setPos({ r, c: c - 1 });
      if (e.key === 'ArrowRight' && !collide(r, c + 1, piece)) setPos({ r, c: c + 1 });
      if (e.key === 'ArrowDown') drop();
      if (e.key === 'ArrowUp') {
        const rot = rotate(piece);
        if (!collide(r, c, rot)) setPiece(rot);
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [pos, piece, grid, gameOver]);

  // draw grid & piece
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, COLS * BLOCK_SIZE, ROWS * BLOCK_SIZE);
    grid.forEach((row, r) => row.forEach((v, c) => {
      if (v) {
        ctx.fillStyle = '#666';
        ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
      }
    }));
    if (piece) {
      piece.forEach((row, dr) => row.forEach((v, dc) => {
        if (v) {
          ctx.fillStyle = '#999';
          ctx.fillRect((pos.c + dc) * BLOCK_SIZE, (pos.r + dr) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }));
    }
  }, [grid, piece, pos]);

  // fetch ranking, handle assessment omitted for brevity
  // ... (same as Sudoku)

  // manual button actions
  const moveLeft = () => { if (!collide(pos.r, pos.c - 1, piece)) setPos(p => ({ r: p.r, c: p.c - 1 })); };
  const moveRight = () => { if (!collide(pos.r, pos.c + 1, piece)) setPos(p => ({ r: p.r, c: p.c + 1 })); };
  const rotatePiece = () => {
    const rot = rotate(piece);
    if (!collide(pos.r, pos.c, rot)) setPiece(rot);
  };

  const scores = [0,1,2].map(i => playScores[i] ?? null);

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <ToastContainer position="top-right" />
      {/* Modals same as other games */}
      <div className="max-w-md mx-auto">
        <canvas ref={canvasRef} width={COLS * BLOCK_SIZE} height={ROWS * BLOCK_SIZE} className="border mx-auto" />
        <div className="flex justify-center gap-4 mt-2">
          <button onClick={moveLeft} className="bg-teal-500 text-white px-4 py-2 rounded">◀️</button>
          <button onClick={rotatePiece} className="bg-teal-500 text-white px-4 py-2 rounded">🔄</button>
          <button onClick={moveRight} className="bg-teal-500 text-white px-4 py-2 rounded">▶️</button>
        </div>
        {!gameOver ? (
          <div className="text-center mt-2">Playing… Time: {elapsed.toFixed(1)}s</div>
        ) : (
          <div className="text-center mt-2">
            <button onClick={startGame} className="bg-teal-600 text-white px-4 py-2 rounded">Play Again</button>
          </div>
        )}
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-bold text-teal-800">Scores</h3>
          <ul className="list-disc list-inside">
            {scores.map((s,i)=>(<li key={i}>{i+1}ⁿᵈ: {s!=null?s:'-'}</li>))}
          </ul>
        </div>
        <div className="mt-4 bg-white p-4 rounded text-center shadow">
          <h3 className="font-bold text-teal-800">Your Ranking</h3>
          <div className={`text-2xl font-bold ${ranking!=null&&ranking<=10?'text-teal-500 animate-pulse':'text-gray-700'}`}>
            {ranking!=null?`#${ranking}`:'-'}
          </div>
          <p className="text-xs text-gray-500">(Top 10 get a badge!)</p>
        </div>
      </div>
    </div>
  );
}
