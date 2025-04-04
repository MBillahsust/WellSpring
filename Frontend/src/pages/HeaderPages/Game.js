import React, { useState, useEffect } from 'react';

const Games = () => {
  const [score, setScore] = useState(0);
  const [birdPosition, setBirdPosition] = useState(200);
  const [pipePosition, setPipePosition] = useState(600);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!gameOver) {
        setPipePosition(pipePosition - 5);
        if (pipePosition < -50) {
          setPipePosition(600);
          setScore(score + 1);
        }
        if (pipePosition < birdPosition + 50 && pipePosition > birdPosition - 50) {
          setGameOver(true);
        }
      }
    }, 16);

    return () => clearInterval(intervalId);
  }, [pipePosition, birdPosition, gameOver, score]);

  const handleFlap = () => {
    if (!gameOver) {
      setBirdPosition(birdPosition - 50);
      setTimeout(() => {
        setBirdPosition(birdPosition + 50);
      }, 500);
    }
  };

  const handleReset = () => {
    setScore(0);
    setBirdPosition(200);
    setPipePosition(600);
    setGameOver(false);
  };

  return (
    <div>
      <h1>Games</h1>
      <h2>Flap the Bird</h2>
      <div style={{ position: 'relative', width: 400, height: 600, border: '1px solid black' }}>
        <div
          style={{
            position: 'absolute',
            top: birdPosition,
            left: 100,
            width: 50,
            height: 50,
            backgroundColor: 'red',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: pipePosition,
            width: 50,
            height: 200,
            backgroundColor: 'green',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 400,
            left: pipePosition,
            width: 50,
            height: 200,
            backgroundColor: 'green',
          }}
        />
      </div>
      <p>Score: {score}</p>
      <button onClick={handleFlap}>Flap</button>
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <button onClick={handleReset}>Reset</button>
        </div>
      )}
    </div>
  );
};

export default Games;