'use client'
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

function calculateAverages(data: { [column: string]: number }[]): { categories: string[], averages: number[] } {
    let sums: { [key: string]: number } = {};
    let counts: { [key: string]: number } = {};
    data.forEach(entry => {
        Object.keys(entry).forEach(column => {
            if (entry[column] !== undefined) {
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

const ApexLineChart: React.FC<ApexLineChartProps> = ({ data, selection, color }) => {
    // Verificación adicional de datos
    if (!data || !data[selection] || !Array.isArray(data[selection]) || data[selection].length === 0) {
        console.error('Data or selection is invalid:', { data, selection });
        return <div>No data available</div>;
    }

    const { categories, averages } = calculateAverages(data[selection]);
    const formattedAverages = averages.map(avg => parseFloat(avg?.toFixed(3) || '0'));
    const sortedData = categories.map((category, index) => ({
        x: parseInt(category, 10),
        y: formattedAverages[index]
    })).sort((a, b) => a.x - b.x);

    const [theme, setTheme] = useState('light');

    useEffect(() => {
        if (typeof window !== 'undefined') {
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
        }
    }, []);

    const chartData: {
        series: { name: string; data: { x: number; y: number }[] }[];
        options: ApexOptions;
    } = {
        series: [{
            name: 'IQA Value',
            data: sortedData
        }],
        options: {
            chart: {
                height: 230,
                type: 'line',
                zoom: {
                    enabled: true
                },
                foreColor: theme === 'dark' ? 'white' : '#2E3339',
            },
            colors: [color],
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 4,
                colors: [color]
            },
            title: {
                align: 'center'
            },
            xaxis: {
                type: 'category',
                labels: {
                    style: {
                        colors: theme === 'dark' ? 'white' : '#2E3339',
                        fontSize: '10px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Average Value',
                    style: {
                        color: theme === 'dark' ? 'white' : '#2E3339'
                    }
                },
                labels: {
                    style: {
                        colors: theme === 'dark' ? 'white' : '#2E3339',
                        fontSize: '10px'
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
        <ReactApexChart options={chartData.options} series={chartData.series} type="line" height={230} />
    );
};

export default ApexLineChart;
