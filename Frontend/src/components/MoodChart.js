import React from 'react';

const MoodChart = ({ moodData, width = 1000, height = 400, showTimeBelowDate = false }) => {
  if (!moodData || moodData.length === 0) {
    return <div className="text-center text-gray-500">No mood data available</div>;
  }

  const padding = 40;
  const extraBottom = showTimeBelowDate ? 110 : 55;
  const minScore = -16, maxScore = 9;

  const points = moodData.map((entry, i) => {
    const x = padding + (i * (width - 2 * padding)) / Math.max(moodData.length - 1, 1);
    const y = padding + ((maxScore - entry.score) * (height - padding - extraBottom - padding)) / (maxScore - minScore);
    return { x, y, date: entry.date, time: entry.time, score: entry.score, mood: entry.mood };
  });

  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <svg width={width} height={height} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
      {/* Axes */}
      <line
        x1={padding}
        y1={height - extraBottom}
        x2={padding}
        y2={padding}
        stroke="#888"
        strokeWidth="1"
        markerEnd="url(#arrowY)"
      />
      <line
        x1={padding}
        y1={height - extraBottom}
        x2={width - padding}
        y2={height - extraBottom}
        stroke="#888"
        strokeWidth="1"
        markerEnd="url(#arrowX)"
      />

      {/* Arrow markers */}
      <defs>
        <marker id="arrowY" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L10,5 L0,10 L3,5 Z" fill="#888" />
        </marker>
        <marker id="arrowX" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L10,5 L0,10 L3,5 Z" fill="#888" />
        </marker>
      </defs>

      {/* Y-axis label */}
      <text
        x={padding - 30}
        y={(height - extraBottom) / 2 + 10}
        fontSize="14"
        textAnchor="middle"
        fill="#222"
        transform={`rotate(-90, ${padding - 30}, ${(height - extraBottom) / 2 + 10})`}
      >
        Mood (Negative → Positive)
      </text>

      {/* X-axis label */}
      <text x={width / 2} y={height - 15} fontSize="14" textAnchor="middle" fill="#222">
        Date, Time & Mood →
      </text>

      {/* Mood line */}
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />

      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
      ))}

      {/* Date, time, and mood labels, horizontal */}
      {points.map((p, i) => (
        <g key={i}>
          <text
            x={p.x}
            y={height - extraBottom + 28}
            fontSize="13"
            textAnchor="middle"
            fill="#333"
          >
            {p.date}
          </text>
          {showTimeBelowDate && p.time && (
            <text
              x={p.x}
              y={height - extraBottom + 45}
              fontSize="11"
              textAnchor="middle"
              fill="#888"
              fontStyle="italic"
            >
              {p.time}
            </text>
          )}
          {p.mood && (
            <text
              x={p.x}
              y={height - extraBottom + 62}
              fontSize="11"
              textAnchor="middle"
              fill="#4b5563"
              fontWeight="bold"
            >
              {p.mood}
            </text>
          )}
        </g>
      ))}

      {/* Y axis numeric labels */}
      <text x={padding - 10} y={padding} fontSize="10" textAnchor="end" fill="#333">{maxScore}</text>
      <text x={padding - 10} y={height - extraBottom} fontSize="10" textAnchor="end" fill="#333">{minScore}</text>
    </svg>
  );
};

export default MoodChart;
