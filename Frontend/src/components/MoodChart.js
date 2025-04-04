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

const MoodChart = ({ moodData }) => {
  if (!moodData || moodData.length === 0) {
    return <div className="text-center text-gray-500">No mood data available</div>;
  }

  const data = {
    labels: moodData.map(entry => entry.date),
    datasets: [
      {
        label: 'Mood Score',
        data: moodData.map(entry => entry.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Mood Trends Over Time',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        grid: {
          display: true
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default MoodChart; 