'use client';

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { useIsClient } from './useIsClient';  // Ajusta la ruta según sea necesario

function calculateAverages(data: { [column: string]: number }[]): { labels: string[], averages: number[] } {
    const sums: { [key: string]: number } = {};
    const counts: { [key: string]: number } = {};
    data.forEach(entry => {
        Object.keys(entry).forEach(column => {
            if (entry[column] !== undefined && entry[column] !== null && !isNaN(entry[column])) {
                sums[column] = (sums[column] || 0) + entry[column];
                counts[column] = (counts[column] || 0) + 1;
            }
        });
    });

    const labels = Object.keys(sums);
    const averages = labels.map(key => sums[key] / counts[key]);
    return { labels, averages };
}

interface DataItem {
    [column: string]: number;
}

interface ChartDataProps {
    [type: string]: DataItem[];
}

interface ChartJSLineChartProps {
    data: ChartDataProps;
    selection: string;
    color: string;
}

const ChartJSLineChart: React.FC<ChartJSLineChartProps> = ({ data, selection, color }) => {
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

    const { labels, averages } = calculateAverages(cleanedData);

    const chartData: ChartData<'line'> = {
        labels: labels,
        datasets: [
            {
                label: 'IQA Value',
                data: averages,
                borderColor: color,
                backgroundColor: color,
                fill: false,
                tension: 0.1
            }
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
                enabled: true
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Category',
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
                }
            }
        }
    };

    return <div style={{ position: 'relative', width: '100%', height: '400px' }}><Line data={chartData} options={options} /></div>;
};

export default ChartJSLineChart;
