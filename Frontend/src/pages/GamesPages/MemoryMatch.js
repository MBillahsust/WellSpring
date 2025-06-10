import React, { useState, useEffect } from 'react';

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

const MemoryMatch = () => {
  const [cards, setCards] = useState(generateCards());
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [lock, setLock] = useState(true); // locked during initial reveal
  const [initialReveal, setInitialReveal] = useState(true);

  useEffect(() => {
    // Initial reveal when game loads or restarts
    setFlipped(cards.map((_, idx) => idx));
    setLock(true);
    setInitialReveal(true);

    const timer = setTimeout(() => {
      setFlipped([]);
      setLock(false);
      setInitialReveal(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [cards]);

  useEffect(() => {
    if (flipped.length === 2 && !initialReveal) {
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
  }, [flipped, cards, initialReveal]);

  const handleCardClick = (idx) => {
    if (lock || flipped.includes(idx) || matched.includes(idx)) return;
    setFlipped((prev) => [...prev, idx]);
  };

  const handleRestart = () => {
    const newCards = generateCards();
    setCards(newCards);
    setFlipped(newCards.map((_, idx) => idx));
    setMatched([]);
    setScore(0);
    setMoves(0);
    setLock(true);
    setInitialReveal(true);

    setTimeout(() => {
      setFlipped([]);
      setLock(false);
      setInitialReveal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center py-8">
      <h1 className="text-3xl font-bold mb-2 text-green-800">Memory Match</h1>
      <p className="mb-4 text-green-700">Flip cards to find all matching pairs!</p>
      <div
        className="grid grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-lg"
        style={{ width: gridSize * (cardSize + 16) }}
      >
        {cards.map((card, idx) => (
          <div
            key={card.id}
            className={`relative cursor-pointer select-none border-2 rounded-lg flex items-center justify-center bg-green-50 ${
              flipped.includes(idx) || matched.includes(idx)
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
      <div className="mt-6 flex gap-8 items-center">
        <div className="text-lg text-green-800 font-semibold">Score: {score}</div>
        <div className="text-lg text-green-800 font-semibold">Moves: {moves}</div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={handleRestart}
        >Restart</button>
      </div>
      {matched.length === cards.length && (
        <div className="mt-6 text-2xl text-green-700 font-bold">Congratulations! You matched all pairs!</div>
      )}
    </div>
  );
};

export default MemoryMatch;
