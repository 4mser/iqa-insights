'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, ChartData, ChartOptions, TooltipItem } from 'chart.js';
import { useIsClient } from './useIsClient';  // Ajusta la ruta según sea necesario

function calculateAverages(data: { [column: string]: number }[]): { labels: string[], averages: number[], minMax: { min: number, max: number }[] } {
    const sums: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};
    const minMax: { [key: string]: { min: number, max: number } } = {};
    data.forEach(entry => {
        Object.keys(entry).forEach(column => {
            if (entry[column] !== undefined && entry[column] !== null && !isNaN(entry[column])) {
                sums[column] = (sums[column] || 0) + entry[column];
                counts[column] = (counts[column] || 0) + 1;
                if (!minMax[column]) {
                    minMax[column] = { min: entry[column], max: entry[column] };
                } else {
                    if (entry[column] < minMax[column].min) minMax[column].min = entry[column];
                    if (entry[column] > minMax[column].max) minMax[column].max = entry[column];
                }
            }
        });
    });

    const labels = Object.keys(sums).sort((a, b) => Number(a) - Number(b));  // Convertir a número y ordenar
    const averages = labels.map(key => sums[key] / counts[key]);
    const minMaxArray = labels.map(key => minMax[key]);
    return { labels, averages, minMax: minMaxArray };
}

interface DataItem {
    [column: string]: number;
}

interface ChartDataProps {
    [type: string]: DataItem[];
}

interface ChartJSLineChartProps {
    data: ChartDataProps;
    minMaxData: { key: number, min: number, max: number }[];
    selection: string;
    color: string;
}

const ChartJSLineChart2: React.FC<ChartJSLineChartProps> = ({ data, minMaxData, selection, color }) => {
    const isClient = useIsClient();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        if (!isClient) return;

        const handleThemeChange = () => {
            const isDarkMode = document.documentElement.classList.contains('dark');
            setTheme(isDarkMode ? 'dark' : 'light');
        };

        handleThemeChange(); // Set initial theme
        const observer = new MutationObserver(handleThemeChange); // Watch for changes to the class attribute

        // Observe the document element for class attribute changes
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        // Clean up observer on component unmount
        return () => {
            observer.disconnect();
        };
    }, [isClient]);

    if (!isClient) {
        return null;
    }

    if (!data || !data[selection] || !Array.isArray(data[selection]) || data[selection].length === 0) {
        console.error('Data or selection is invalid:', { data, selection });
        return <div>No data available</div>;
    }

    const cleanedData = data[selection].filter(entry => {
        return Object.values(entry).every(value => value !== undefined && value !== null && !isNaN(value));
    });

    if (cleanedData.length === 0) {
        console.error('All data entries are invalid after cleaning:', { data, selection });
        return <div>No valid data available</div>;
    }

    const { labels, averages, minMax } = calculateAverages(cleanedData);

    const chartData: ChartData<'line'> = {
        labels: labels,  // No need to convert to string as ChartJS handles it
        datasets: [
            {
                label: 'IQA Value',
                data: averages,
                borderColor: color,
                backgroundColor: color,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Min IQA Value',
                data: minMaxData.map(item => item.min),
                borderColor: 'rgba(255, 200, 50, 0.5)',
                backgroundColor: 'rgba(255, 200, 50, 0.5)',
                showLine: false,
                pointRadius: 5,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Max IQA Value',
                data: minMaxData.map(item => item.max),
                borderColor: 'rgba(255, 100, 0, 0.5)',
                backgroundColor: 'rgba(255, 100, 0, 0.5)',
                showLine: false,
                pointRadius: 5,
                fill: false,
                tension: 0.1
            },
            {
                label: 'IQA Range',
                data: minMaxData.map((item, index) => item.min),
                fill: '+1',
                backgroundColor: 'rgba(255, 0, 0, 0.05)', // Color rojo con opacidad
                borderColor: 'rgba(0, 0, 0, 0)',
                pointRadius: 0,
                tension: 0.1,
                
            },
            {
                label: 'IQA Range Max',
                data: minMaxData.map((item, index) => item.max),
                fill: '-1',
                backgroundColor: 'rgba(255, 0, 0, 0.05)', // Color rojo con opacidad
                borderColor: 'rgba(0, 0, 0, 0)',
                pointRadius: 0,
                tension: 0.1,
            },
        ]
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: theme === 'dark' ? 'white' : '#2E3339'
                }
            },
            tooltip: {
                enabled: true,
                mode: 'nearest', // Modo para activar el tooltip al pasar por el área en el eje Y
                intersect: false,
                callbacks: {
                    label: function (context: TooltipItem<'line'>) {
                        const value = context.raw as number;
                        return `IQA Value: ${value.toFixed(2)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Vision Angle',
                    color: theme === 'dark' ? 'white' : '#2E3339'
                },
                ticks: {
                    color: theme === 'dark' ? 'white' : '#2E3339'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Average Value',
                    color: theme === 'dark' ? 'white' : '#2E3339'
                },
                ticks: {
                    color: theme === 'dark' ? 'white' : '#2E3339'
                },
                min: 0,
                max: 120
            }
        }
    };

    return <div style={{ position: 'relative', width: '100%', height: '400px' }}><Line data={chartData} options={options} /></div>;
};

export default ChartJSLineChart2;
