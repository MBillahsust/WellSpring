import React from 'react';

const CATEGORY_COLORS = [
  '#3B82F6', // Mental Activities - blue
  '#10B981', // Physical Activities - green
  '#F59E0B', // Spiritual Activities - yellow
  '#8B5CF6', // Social Activities - purple
  '#EF4444', // Emotional Activities - red
  '#EC4899', // Creative Activities - pink
  '#6B7280'  // Other - gray
];

const CATEGORY_LABELS = [
  'Mental Activities',
  'Physical Activities',
  'Spiritual Activities',
  'Social Activities',
  'Emotional Activities',
  'Creative Activities',
  'Other'
];

function getColor(category) {
  const idx = CATEGORY_LABELS.indexOf(category);
  return CATEGORY_COLORS[idx] || '#6B7280';
}

const ActivityPieChart = ({ data = [], width = 340, height = 340 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!data.length || total === 0) {
    return <div className="text-center text-gray-500">No activity data available</div>;
  }

  // Pie chart math
  let cumulative = 0;
  const center = width / 2;
  const radius = width / 2 - 30;
  const pieSlices = data.map((d, i) => {
    const value = d.value;
    const angle = (value / total) * 2 * Math.PI;
    const startAngle = cumulative;
    const endAngle = cumulative + angle;
    cumulative = endAngle;
    // SVG arc
    const x1 = center + radius * Math.cos(startAngle - Math.PI / 2);
    const y1 = center + radius * Math.sin(startAngle - Math.PI / 2);
    const x2 = center + radius * Math.cos(endAngle - Math.PI / 2);
    const y2 = center + radius * Math.sin(endAngle - Math.PI / 2);
    const largeArc = angle > Math.PI ? 1 : 0;
    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    return (
      <path
        key={d.category}
        d={pathData}
        fill={getColor(d.category)}
        stroke="#fff"
        strokeWidth="2"
      />
    );
  });

  // Legend
  const legend = data.map((d, i) => (
    <div key={d.category} className="flex items-center mb-1">
      <span style={{ background: getColor(d.category), width: 16, height: 16, display: 'inline-block', borderRadius: 4, marginRight: 8 }}></span>
      <span className="font-medium text-gray-700">{d.category}</span>
      <span className="ml-2 text-gray-500">{d.value}</span>
    </div>
  ));

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white rounded-xl shadow p-6 mt-6">
      <svg width={width} height={height} style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001' }}>
        {pieSlices}
        {/* Center label */}
        <text x={center} y={center} textAnchor="middle" fontSize="18" fill="#222" fontWeight="bold">
          Last 10 Activities
        </text>
      </svg>
      <div className="flex flex-col justify-center">{legend}</div>
    </div>
  );
};

export default ActivityPieChart; 