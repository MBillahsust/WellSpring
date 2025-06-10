import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGamepad, FaDove, FaPuzzlePiece, FaBrain } from 'react-icons/fa';
import { UserContext } from '../../UserContext';

const Games = () => {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const games = [
    {
      id: 'flappy-bird',
      title: 'Flappy Bird',
      description: 'Test your reflexes and timing in this classic game. Guide the bird through the pipes!',
      icon: <FaDove className="text-4xl" />,
      path: '/games/flappy-bird',
      color: 'bg-blue-500'
    },
    {
      id: 'memory-match',
      title: 'Memory Match',
      description: 'Test your memory with this card matching game.',
      icon: <FaPuzzlePiece className="text-4xl" />,
      path: '/games/memory-match',
      color: 'bg-purple-500',
      disabled: false
    },
    {
      id: 'coming-soon-2',
      title: 'Brain Teaser',
      description: 'Coming soon! Challenge your mind with puzzles and riddles.',
      icon: <FaBrain className="text-4xl" />,
      path: '#',
      color: 'bg-green-500',
      disabled: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mental Health Games</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Engage in fun and interactive games designed to improve your mental well-being,
            reduce stress, and enhance cognitive abilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 ${
                game.disabled ? 'opacity-60 cursor-not-allowed' : ''
              }`}
            >
              <div className={`${game.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  {game.icon}
                  {game.disabled && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mt-4">{game.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{game.description}</p>
                {game.disabled ? (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 px-6 py-3 rounded-lg flex items-center justify-center space-x-2"
                  >
                    <FaGamepad />
                    <span>Coming Soon</span>
                  </button>
                ) : game.id === 'flappy-bird' ? (
                  <button
                    className="w-full bg-[#6d8ded] text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#5a7ad9] transition-colors"
                    onClick={() => {
                      if (!userInfo || !userInfo.token) {
                        navigate('/login', { state: { from: '/games/flappy-bird' } });
                      } else {
                        navigate('/games/flappy-bird');
                      }
                    }}
                  >
                    <FaGamepad />
                    <span>Play Now</span>
                  </button>
                ) : game.id === 'memory-match' ? (
                  <button
                    className="w-full bg-[#a259e6] text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#8d3fcf] transition-colors"
                    onClick={() => navigate('/games/memory-match')}
                  >
                    <FaGamepad />
                    <span>Play Now</span>
                  </button>
                ) : (
                  <Link
                    to={game.path}
                    className="w-full bg-[#6d8ded] text-white px-6 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-[#5a7ad9] transition-colors"
                  >
                    <FaGamepad />
                    <span>Play Now</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits of Mental Health Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Stress Reduction</h3>
              <p className="text-blue-700">
                Engaging in games can help reduce stress levels and promote relaxation.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Cognitive Enhancement</h3>
              <p className="text-purple-700">
                Games can improve memory, attention, and problem-solving skills.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Mood Improvement</h3>
              <p className="text-green-700">
                Playing games can boost mood and provide a sense of accomplishment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games; 