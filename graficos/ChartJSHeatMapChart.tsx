'use client';

import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ChartData, ChartOptions, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { Chart } from 'react-chartjs-2';
import { useIsClient } from './useIsClient'; // Ajusta la ruta según sea necesario

ChartJS.register(...registerables, MatrixController, MatrixElement);

interface MatrixDataPoint {
    x: number;
    y: number;
    v: number;
}

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

interface ChartJSHeatMapChartProps {
    data: ChartDataProps;
    selection: string;
    color: string;
}

const ChartJSHeatMapChart: React.FC<ChartJSHeatMapChartProps> = ({ data, selection, color }) => {
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

    const matrixData = labels.map((label, index) => ({
        x: index,
        y: 0,  // We can keep y constant as 0 for a 1D heatmap
        v: averages[index]
    })) as MatrixDataPoint[];

    const chartData: ChartData<'matrix'> = {
        datasets: [
            {
                label: 'IQA Value',
                data: matrixData,
                backgroundColor: (context) => {
                    const value = (context.dataset.data[context.dataIndex] as MatrixDataPoint).v;
                    const alpha = (value - Math.min(...averages)) / (Math.max(...averages) - Math.min(...averages));
                    return `rgba(${color}, ${alpha})`; // Usar color dinámico con alpha
                },
                borderColor: `rgba(${color})`,
                borderWidth: 1,
                width: ({ chart }) => chart.chartArea ? chart.chartArea.width / labels.length - 1 : 0,
                height: ({ chart }) => chart.chartArea ? chart.chartArea.height : 0
            }
        ]
    };

    const options: ChartOptions<'matrix'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: true
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                display: false,
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                    color: theme === 'dark' ? 'white' : '#2E3339'
                },
                title: {
                    display: false,
                    text: 'Category',
                    color: theme === 'dark' ? 'white' : '#2E3339'
                }
            },
            y: {
                display: false  // Hide the y-axis for 1D heatmap
            }
        }
    };

    return <div style={{ position: 'relative', width: '100%', height: '40px' }}><Chart type='matrix' data={chartData} options={options} /></div>;
};

export default ChartJSHeatMapChart;
