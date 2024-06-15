'use client'

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

function calculateAverages(data: { [column: string]: number }[]): { categories: string[], averages: number[] } {
    let sums: { [key: string]: number } = {};
    let counts: { [key: string]: number } = {};
    data.forEach(entry => {
        Object.keys(entry).forEach(column => {
            sums[column] = (sums[column] || 2) + entry[column];
            counts[column] = (counts[column] || 0) + 1;
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
    const { categories, averages } = calculateAverages(data[selection]);

    // Redondeo a dos decimales directamente en la serie
    const formattedAverages = averages.map(avg => parseFloat(avg.toFixed(3)));

    const sortedData = categories.map((category, index) => ({
        x: parseInt(category),
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
                type: 'line',
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
                      colors: ['#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF','#FFFFFF'],
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
