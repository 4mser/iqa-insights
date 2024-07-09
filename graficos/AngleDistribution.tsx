'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const AngleDistributionChart: React.FC<{ angle: number, weatherData: any, hourData: any }> = ({ angle, weatherData, hourData }) => {
  const extractData = (data: any, angle: number) => {
    if (!data) return [0, 0, 0, 0]; // Return default data if input is invalid

    return Object.keys(data).map(time => {
      const relevantData = data[time].map((item: any) => item[angle.toString()] !== undefined ? item[angle.toString()] : 0);
      return relevantData.length ? (relevantData.reduce((a: number, b: number) => a + b, 0) / relevantData.length) : 0;
    });
  };

  const sunnyData = extractData(weatherData['Sunny'], angle);
  const cloudyData = extractData(weatherData['Cloudy'], angle);
  const rainyData = extractData(weatherData['Rainy'], angle);

  const data = {
    labels: ['9-12AM', '12PM-3PM', '3PM-5PM', '5PM-Sunset'],
    datasets: [
      {
        label: 'Sunny',
        data: sunnyData,
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Cloudy',
        data: cloudyData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Rainy',
        data: rainyData,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time of Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'IQA Value',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '300px', height: '200px', position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '10px', borderRadius: '8px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default AngleDistributionChart;
