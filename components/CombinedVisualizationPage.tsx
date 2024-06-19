'use client';

import React, { useState, useEffect } from 'react';
import { IqaWeather } from '@/data/IQAWEATHER';
import { IqaHours } from '@/data/IQAHOURS';
import ChartJSLineChart2 from '@/graficos/ChartJSLineChart2';
import ChartJSHeatMapChart from '@/graficos/ChartJSHeatMapChart';

export interface DataItem {
    [column: string]: number;
}

export interface ChartData {
    [type: string]: DataItem[];
}

const CombinedVisualizationPage: React.FC = () => {
    const [weatherSelection, setWeatherSelection] = useState('');
    const [hourSelection, setHourSelection] = useState('9-12AM');
    const [combinedData, setCombinedData] = useState<{ averages: DataItem[], minMax: { key: number, min: number, max: number }[] }>({ averages: [], minMax: [] });
    const [highestValue, setHighestValue] = useState<{ key: number, value: number } | null>(null);
    const [highestOverallValue, setHighestOverallValue] = useState<{ key: number, value: number, weather: string, hour: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const weatherData = weatherSelection ? IqaWeather[weatherSelection] : [];
        const hourData = hourSelection ? IqaHours[hourSelection] : [];
        const combinedAverages = calculateCombinedAverages(weatherData, hourData);
        setCombinedData(combinedAverages);
        setHighestValue(findHighestValue(combinedAverages.averages));
        setLoading(false);
    }, [weatherSelection, hourSelection]);

    useEffect(() => {
        const overallHighest = findHighestOverallValue();
        setHighestOverallValue(overallHighest);
    }, []);

    const hourOptions = ['9-12AM', '12PM-3PM', '3PM-5PM', '5PM-Sunset'];
    const weatherOptions = ['Sunny', 'Cloudy', 'Rainy'];

    const toggleSelection = (option: string, type: 'hour' | 'weather') => {
        if (type === 'hour') {
            setHourSelection(prev => (prev === option ? '' : option));
        } else {
            setWeatherSelection(prev => (prev === option ? '' : option));
        }
    };

    const findHighestValue = (data: DataItem[]): { key: number, value: number } | null => {
        let highest = { key: 0, value: 0 };
        data.forEach(item => {
            Object.entries(item).forEach(([key, value]) => {
                if (value > highest.value) {
                    highest = { key: Number(key), value };
                }
            });
        });
        return highest.value > 0 ? highest : null;
    };

    const findHighestOverallValue = () => {
        let highestOverall = { key: 0, value: 0, weather: '', hour: '' };
        const allCombinations = [];

        hourOptions.forEach(hour => {
            weatherOptions.forEach(weather => {
                const weatherData = IqaWeather[weather] || [];
                const hourData = IqaHours[hour] || [];
                const combinedAverages = calculateCombinedAverages(weatherData, hourData);
                allCombinations.push({ weather, hour, combinedAverages });
            });
        });

        weatherOptions.forEach(weather => {
            const weatherData = IqaWeather[weather] || [];
            const combinedAverages = calculateCombinedAverages(weatherData, []);
            allCombinations.push({ weather, hour: 'All Hours', combinedAverages });
        });

        hourOptions.forEach(hour => {
            const hourData = IqaHours[hour] || [];
            const combinedAverages = calculateCombinedAverages([], hourData);
            allCombinations.push({ weather: 'All Weather', hour, combinedAverages });
        });

        allCombinations.push({ weather: 'All Weather', hour: 'All Hours', combinedAverages: calculateCombinedAverages([], []) });

        allCombinations.forEach(({ weather, hour, combinedAverages }) => {
            const highestValue = findHighestValue(combinedAverages.averages);
            if (highestValue && highestValue.value > highestOverall.value) {
                highestOverall = { ...highestValue, weather, hour };
            }
        });

        return highestOverall.value > 0 ? highestOverall : null;
    };

    return (
        <section className=''>
            <div className='flex space-x-2 mb-4'>
                {hourOptions.map(option => (
                    <button
                        key={option}
                        className={`py-2 text-xs md:text-base px-4 rounded-full ${
                            hourSelection === option ? 'bg-red-500/20 border border-red-500 dark:text-white text-black' : 'text-black dark:text-white'
                        }`}
                        onClick={() => toggleSelection(option, 'hour')}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <div className='flex space-x-2 mb-4'>
                {weatherOptions.map(option => (
                    <button
                        key={option}
                        className={`py-2 text-xs text-nowrap md:text-base px-4 rounded-full ${
                            weatherSelection === option ? 'bg-red-500/20 border-red-500 border dark:text-white text-black' : 'text-black dark:text-white'
                        }`}
                        onClick={() => toggleSelection(option, 'weather')}
                    >
                        {option}
                    </button>
                ))}
            </div>
            

            <div className='relative' style={{ minHeight: '400px' }}>
                {loading && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='loader'>Loading...</div> {/* Indicador de carga */}
                    </div>
                )}
                {!loading && (
                    <>
                        <ChartJSLineChart2 data={{ 'Combined': combinedData.averages }} minMaxData={combinedData.minMax} selection='Combined' color="rgba(255, 0, 0, 1)" />
                        <div className='mt-8'>
                            <ChartJSHeatMapChart data={{ 'Combined': combinedData.averages }} selection='Combined' color="255, 0, 0" />
                        </div>
                    </>
                )}
            </div>

            <p className='py-2 text-neutral-800/80 font-bold dark:text-white/70'>{`Average IQA Values for ${hourSelection ? hourSelection : 'All Hours'} on a ${weatherSelection ? weatherSelection : 'All Weather Conditions'} Day`}</p>
            
            {highestValue && (
                <p className='py-2 text-neutral-800/80 font-bold dark:text-white/70'>{`Highest IQA Value: ${highestValue.value} at ${highestValue.key} degrees`}</p>
            )}

            {highestOverallValue && (
                <p className='py-2 text-neutral-800/80 font-bold dark:text-white/70'>
                    {`Highest Overall IQA (Weather: ${highestOverallValue.weather}, Hour: ${highestOverallValue.hour})`}
                </p>
            )}
        </section>
    );
};

function calculateCombinedAverages(weatherData: DataItem[], hourData: DataItem[]): { averages: DataItem[], minMax: { key: number, min: number, max: number }[] } {
    const allKeys = new Set<number>();
    weatherData.forEach(item => Object.keys(item).forEach(key => allKeys.add(Number(key))));
    hourData.forEach(item => Object.keys(item).forEach(key => allKeys.add(Number(key))));

    const combined: DataItem[] = [];
    const minMax: { key: number, min: number, max: number }[] = [];

    for (const key of Array.from(allKeys).sort((a, b) => a - b)) {
        let weatherSum = 0;
        let hourSum = 0;
        let weatherCount = 0;
        let hourCount = 0;
        let weatherMin = Infinity;
        let weatherMax = -Infinity;
        let hourMin = Infinity;
        let hourMax = -Infinity;

        for (const item of weatherData) {
            if (item[key] !== undefined) {
                weatherSum += item[key];
                weatherCount++;
                if (item[key] < weatherMin) weatherMin = item[key];
                if (item[key] > weatherMax) weatherMax = item[key];
            }
        }

        for (const item of hourData) {
            if (item[key] !== undefined) {
                hourSum += item[key];
                hourCount++;
                if (item[key] < hourMin) hourMin = item[key];
                if (item[key] > hourMax) hourMax = item[key];
            }
        }

        const combinedItem: DataItem = {};
        if (weatherCount > 0 && hourCount > 0) {
            combinedItem[key] = (weatherSum / weatherCount + hourSum / hourCount) / 2;
            minMax.push({
                key,
                min: Math.min(weatherMin, hourMin),
                max: Math.max(weatherMax, hourMax),
            });
        } else if (weatherCount > 0) {
            combinedItem[key] = weatherSum / weatherCount;
            minMax.push({
                key,
                min: weatherMin,
                max: weatherMax,
            });
        } else if (hourCount > 0) {
            combinedItem[key] = hourSum / hourCount;
            minMax.push({
                key,
                min: hourMin,
                max: hourMax,
            });
        } else {
            combinedItem[key] = 0;
            minMax.push({
                key,
                min: 0,
                max: 0,
            });
        }

        combined.push(combinedItem);
    }

    return { averages: combined, minMax };
}

export default CombinedVisualizationPage;
