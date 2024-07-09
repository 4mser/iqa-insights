'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { IqaWeather } from '@/data/IQAWEATHER';

const weather = ['Sunny', 'Cloudy', 'Rainy'];

interface AngleLineChartByHoursProps {
  selectedAngle: number;
}

const AngleLineChartByWeather: React.FC<AngleLineChartByHoursProps> = ({ selectedAngle }) => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: weather,
    datasets: []
  });

  useEffect(() => {
    const fetchData = async (angle: number) => {
      const hourData = weather.map(hour => IqaWeather[hour]);

      const dataForAngle = hourData.map(data => {
        const angleData = data.find(item => item[angle] !== undefined);
        return angleData ? angleData[angle] : null;
      });

      const minMaxData = hourData.map(data => {
        const angleData = data.find(item => item[angle] !== undefined);
        return {
          min: angleData ? angleData[angle] : null,
          max: angleData ? angleData[angle] : null
        };
      });

      const chartData = {
        labels: weather,
        datasets: [
          {
            label: `IQA Value for Angle ${angle}`,
            data: dataForAngle,
            borderColor: 'rgba(192, 65, 80, 1)',
            backgroundColor: 'rgba(192, 65, 80, 0.2)',
            fill: false,
            tension: 0.1
          }
        ]
      };

      setChartData(chartData);
    };

    if (selectedAngle !== null) {
      fetchData(selectedAngle);
    }
  }, [selectedAngle]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weather Condition',
        },
      },
      y: {
        title: {
          display: true,
          text: 'IQA Value',
        },
        min: 0,
        max: 120,
      },
    },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '220px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AngleLineChartByWeather;
