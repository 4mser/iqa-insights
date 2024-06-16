'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { useIsClient } from './useIsClient'; // Ajusta la ruta según sea necesario

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

function calculateAverages(data: { [column: string]: number }[]): { categories: string[], averages: number[] } {
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

    const categories = Object.keys(sums);
    const averages = categories.map(key => sums[key] / counts[key]);
    return { categories, averages };
}

interface DataItem {
    [column: string]: number;
}

interface ChartData {
    [type: string]: DataItem[];
}

interface ApexLineChartProps {
    data: ChartData;
    selection: string;
    color: string;
}

const HeatMapChart: React.FC<ApexLineChartProps> = ({ data, selection, color }) => {
    const isClient = useIsClient();

    if (!isClient) {
        return null;
    }

    if (!data || !data[selection] || !Array.isArray(data[selection]) || data[selection].length === 0) {
        console.error('Data or selection is invalid:', { data, selection });
        return <div>No data available</div>;
    }

    // Verificación y limpieza de datos
    const cleanedData = data[selection].filter(entry => {
        return Object.values(entry).every(value => value !== undefined && value !== null && !isNaN(value));
    });

    if (cleanedData.length === 0) {
        console.error('No valid data available after cleaning.');
        return <div>No valid data available</div>;
    }

    const { categories, averages } = calculateAverages(cleanedData);

    // Redondeo a dos decimales directamente en la serie
    const formattedAverages = averages.map(avg => parseFloat(avg.toFixed(3)));

    const sortedData = categories.map((category, index) => ({
        x: isNaN(parseInt(category)) ? 0 : parseInt(category),
        y: formattedAverages[index]
    })).sort((a, b) => a.x - b.x);

    const chartData: {
        series: { name: string; data: { x: number; y: number }[] }[];
        options: ApexOptions;
    } = {
        series: [{
            name: '',
            data: sortedData
        }],
        options: {
            chart: {
                height: 85,
                type: 'heatmap',
                zoom: {
                    enabled: false
                },
                toolbar: {
                    show: false // Ocultar las opciones de descarga
                },
            },
            colors: [color],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3,
                colors: [color]
            },
            title: {
                align: 'center'
            },
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
                        fontSize: '0px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: '',
                    style: {
                        color: "#FFFFFF"
                    }
                }
            },
            tooltip: {
                enabled: true
            },
            grid: {
                borderColor: '#E2DEE7',
                strokeDashArray: 5
            }
        }
    };

    return (
        <ReactApexChart options={chartData.options} series={chartData.series} type="heatmap" height={70} />
    );
};

export default HeatMapChart;
