import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPlay, FaRedo, FaHeart, FaStar, FaSmile, FaThumbsUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

const FlappyBird = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
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

  // Replace dummy scores with stateful playScores
  const [playScores, setPlayScores] = useState([]);
  // Update playScores on game over
  useEffect(() => {
    if (gameOver && gameStarted) {
      setPlayScores(prev => {
        let updated = [...prev, score];
        if (updated.length > 3) updated = [score]; // reset after 3 plays
        return updated;
      });
    }
    // eslint-disable-next-line
  }, [gameOver]);

  // For display: fill with nulls for 'not played'
  const scores = [0, 1, 2].map(i => playScores[i] !== undefined ? playScores[i] : null);
  // Dummy ranking (animated)
  const [ranking, setRanking] = useState(42);
  useEffect(() => {
    // Animate ranking for demo
    let frame = 0;
    const interval = setInterval(() => {
      setRanking(40 + Math.floor(Math.abs(Math.sin(frame / 10)) * 5));
      frame++;
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-4 pt-0">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#6d8ded] p-3">
            <h1 className="text-xl font-bold text-white text-center">Flappy Apple</h1>
            <p className="text-white/80 text-center text-sm">Click or press space to jump!</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Scores and How to play */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Game Scores</h3>
                <ul className="text-base text-blue-800 space-y-1">
                  <li>1st game score: {scores[0] !== null ? scores[0] : <span className="italic text-gray-500">not played</span>}</li>
                  <li>2nd game score: {scores[1] !== null ? scores[1] : <span className="italic text-gray-500">not played</span>}</li>
                  <li>3rd game score: {scores[2] !== null ? scores[2] : <span className="italic text-gray-500">not played</span>}</li>
                </ul>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">How to play</h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Click the game area or press the spacebar to make the Apple logo jump.</li>
                  <li>Avoid hitting the pipes or falling off the screen.</li>
                  <li>Try to beat your high score!</li>
                </ul>
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
                    <p className="text-white mb-4">High Score: {highScore}</p>
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
                  <p className="text-xs text-gray-600">High Score: {highScore}</p>
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-500">Click or press space to make the Apple logo jump</p>
              </div>
            </div>

            {/* Right side - Ranking, Tips, Benefits */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50 flex flex-col items-center">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Ranking</h3>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600 animate-bounce">#{ranking}</span>
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Mental Health Tips</h3>
                <div className="h-24 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-2 text-2xl">
                      {messages[messageIndex].icon}
                    </div>
                    <p className="text-blue-800 font-medium">
                      {messages[messageIndex].text}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg shadow-sm w-full">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Benefits of Gaming</h4>
                <ul className="text-xs text-gray-600 space-y-1">
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