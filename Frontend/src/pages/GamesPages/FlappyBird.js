import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaRedo, FaHeart, FaStar, FaSmile, FaThumbsUp } from 'react-icons/fa';

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

  // Animation for the right side
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Draw raindrop animation
  const drawCalmingAnimation = (ctx, width, height) => {
    // Clear background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw raindrops
    const time = animationFrame / 10;
    const numDrops = 9;
    
    for (let i = 0; i < numDrops; i++) {
      const duration = 2 + Math.random() * 1; // 2-3 seconds
      const delay = Math.random() * 4; // 0-4 seconds
      const xOffset = (Math.random() - 0.5) * 40; // -20 to 20
      const yOffset = (Math.random() - 0.5) * 40; // -20 to 20
      const scale = 0.9 + Math.random() * 0.4; // 0.9 to 1.3
      
      // Calculate position based on time and animation parameters
      const dropX = width / 2 + xOffset;
      const dropY = height / 2 + yOffset;
      
      // Draw drop
      const dropProgress = ((time + delay) % duration) / duration;
      if (dropProgress < 0.45) {
        // Falling drop
        const dropY = height / 2 + yOffset - (dropProgress / 0.45) * height;
        ctx.fillStyle = '#fff';
        ctx.fillRect(dropX - 1.5, dropY, 3, 100);
      } else if (dropProgress < 0.5) {
        // Splash
        const splashScale = (dropProgress - 0.45) / 0.05;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(dropX - 20, dropY + 50);
        ctx.quadraticCurveTo(dropX, dropY + 30, dropX + 20, dropY + 50);
        ctx.quadraticCurveTo(dropX + 10, dropY + 40, dropX, dropY + 30);
        ctx.quadraticCurveTo(dropX - 10, dropY + 40, dropX - 20, dropY + 50);
        ctx.fill();
      } else if (dropProgress < 0.9) {
        // Waves
        const waveProgress = (dropProgress - 0.5) / 0.4;
        const waveRadius = waveProgress * 50;
        const waveOpacity = 1 - waveProgress;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${waveOpacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dropX, dropY + 50, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Second wave
        if (waveProgress > 0.3) {
          const wave2Progress = (waveProgress - 0.3) / 0.7;
          const wave2Radius = wave2Progress * 50;
          const wave2Opacity = (1 - wave2Progress) * 0.7;
          
          ctx.strokeStyle = `rgba(255, 255, 255, ${wave2Opacity})`;
          ctx.beginPath();
          ctx.arc(dropX, dropY + 50, wave2Radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      // Draw particles
      if (dropProgress > 0.45 && dropProgress < 0.7) {
        const particleProgress = (dropProgress - 0.45) / 0.25;
        
        // Left particle
        const leftX = dropX - 50 * particleProgress;
        const leftY = dropY + 50 - 90 * particleProgress;
        const leftSize = 7 * (1 - particleProgress);
        
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(leftX, leftY, leftSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Right particle
        const rightX = dropX + 30 * particleProgress;
        const rightY = dropY + 50 - 80 * particleProgress;
        const rightSize = 5 * (1 - particleProgress);
        
        ctx.beginPath();
        ctx.arc(rightX, rightY, rightSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  // Initialize raindrop animation
  useEffect(() => {
    const calmingCanvas = document.getElementById('calmingCanvas');
    if (calmingCanvas) {
      const ctx = calmingCanvas.getContext('2d');
      const width = calmingCanvas.width;
      const height = calmingCanvas.height;
      
      // Set up animation loop
      let frameCount = 0;
      const animate = () => {
        // Update frame count
        frameCount = (frameCount + 1) % 60;
        setAnimationFrame(frameCount);
        
        // Clear and redraw
        ctx.clearRect(0, 0, width, height);
        drawCalmingAnimation(ctx, width, height);
        
        // Request next frame
        requestAnimationFrame(animate);
      };
      
      // Start animation immediately
      animate();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#6d8ded] p-3">
            <h1 className="text-xl font-bold text-white text-center">Flappy Apple</h1>
            <p className="text-white/80 text-center text-sm">Click or press space to jump!</p>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Encouraging messages */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50 flex flex-col justify-center">
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
              
              <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">Benefits of Gaming</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Improves focus and concentration</li>
                  <li>• Reduces stress and anxiety</li>
                  <li>• Enhances problem-solving skills</li>
                  <li>• Provides a sense of accomplishment</li>
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

            {/* Right side - Animation */}
            <div className="w-full md:w-1/4 p-4 bg-blue-50">
              <div className="text-center mb-2">
                <h3 className="text-lg font-semibold text-blue-900">Raindrop Animation</h3>
              </div>
              <div className="relative h-64 bg-black rounded-lg shadow-sm overflow-hidden">
                <canvas 
                  id="calmingCanvas" 
                  width={300} 
                  height={250}
                  className="w-full"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600">Watch the calming raindrops fall</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlappyBird; 