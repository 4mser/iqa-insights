// components/PaperCharts.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PaperCharts: React.FC = () => {
  const contrastData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        label: 'Mean Contrast with Std Dev',
        data: [0.02, 0.025, 0.03, 0.065, 0.01, 0.02, 0.03, 0.025, 0.02],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        lineTension: 0.1,
      }
    ]
  };

  const precisionData = {
    labels: ['0.6/0.6/0.6', '0.7/0.7/0.7', '0.8/0.8/0.8', '0.9/0.9/0.9', '0.7/0.9/0.7'],
    datasets: [
      {
        label: 'Bend Precision',
        data: [0.94, 0.95, 0.93, 0.92, 0.925],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        lineTension: 0.1,
      },
      {
        label: 'Dent Precision',
        data: [0.9, 0.9, 0.89, 0.88, 0.885],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        lineTension: 0.1,
      },
      {
        label: 'Scratch Precision',
        data: [0.75, 0.75, 0.74, 0.73, 0.74],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        lineTension: 0.1,
      }
    ]
  };

  const exposureData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        label: 'Mean with Std Dev',
        data: [0.3, 0.2, 0.25, 0.28, 0.18, 0.2, 0.22, 0.19, 0.21],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: false,
        lineTension: 0.1,
      }
    ]
  };

  return (
    <div className="paper-charts bg-lightBg dark:bg-darkBg font-sans transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl">
          <h2 className="text-primary dark:text-secondary text-2xl font-bold mb-4">Mean Contrast Analysis</h2>
          <Line data={contrastData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Mean Contrast Analysis with Standard Deviation' } } }} />
        </div>
        <div className="bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl">
          <h2 className="text-primary dark:text-secondary text-2xl font-bold mb-4">William Precision Scores</h2>
          <Line data={precisionData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'William Precision Scores' } } }} />
        </div>
        <div className="bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl">
          <h2 className="text-primary dark:text-secondary text-2xl font-bold mb-4">Mean Exposure Analysis</h2>
          <Line data={exposureData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Mean Exposure Analysis with Standard Deviation' } } }} />
        </div>
      </div>
    </div>
  );
};

export default PaperCharts;
