import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = ({ moodData, width = 400, height = 200, showTimeBelowDate = false }) => {
  if (!moodData || moodData.length === 0) {
    return <div className="text-center text-gray-500">No mood data available</div>;
  }

  // Prepare data for SVG
  const padding = 40;
  const points = moodData.map((entry, i) => {
    const x = padding + (i * (width - 2 * padding)) / Math.max(moodData.length - 1, 1);
    // Map score from -16..9 to 0..height
    const minScore = -16, maxScore = 9;
    const y = padding + ((maxScore - entry.score) * (height - 2 * padding)) / (maxScore - minScore);
    return { x, y, date: entry.date, time: entry.time, score: entry.score };
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <svg width={width} height={height} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
      {/* Axes */}
      <line x1={padding} y1={padding} x2={padding} y2={height-padding} stroke="#888" strokeWidth="1" />
      <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#888" strokeWidth="1" />
      {/* Line */}
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
      ))}
      {/* Labels: date and time */}
      {points.map((p, i) => (
        <g key={i}>
          <text x={p.x} y={height-padding+15} fontSize="12" textAnchor="middle" fill="#333">{p.date}</text>
          {showTimeBelowDate && p.time && (
            <text x={p.x} y={height-padding+30} fontSize="10" textAnchor="middle" fill="#666">{p.time}</text>
          )}
        </g>
      ))}
      {/* Y axis labels */}
      <text x={padding-10} y={padding} fontSize="10" textAnchor="end" fill="#333">9</text>
      <text x={padding-10} y={height-padding} fontSize="10" textAnchor="end" fill="#333">-16</text>
    </svg>
  );
};

export default MoodChart; 