'use client';

import React, { useState, useEffect } from 'react';
import { IqaWeather } from '@/data/IQAWEATHER';
import { IqaHours } from '@/data/IQAHOURS';
import ChartJSLineChart from '@/graficos/ChartJSLineChart';
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
    const [combinedData, setCombinedData] = useState<DataItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const weatherData = IqaWeather[weatherSelection] ?? [];
        const hourData = IqaHours[hourSelection] ?? [];
        const combinedAverages = calculateCombinedAverages(weatherData, hourData, weatherSelection, hourSelection);
        setCombinedData(combinedAverages);
        setLoading(false);
    }, [weatherSelection, hourSelection]);

    const hourOptions = ['9-12AM', '12PM-3PM', '3PM-5PM', '5PM-Sunset'];
    const weatherOptions = ['Sunny', 'Cloudy', 'Rainy'];

    return (
        <section className='p-4'>
            <div className='flex space-x-2 mb-4'>
                {hourOptions.map(option => (
                    <button
                        key={option}
                        className={`py-2 text-xs text-nowrap md:text-base px-4 rounded-full ${
                            hourSelection === option ? 'bg-red-500/20 border border-red-500  dark:text-white text-black' : ' text-black dark:text-white'
                        }`}
                        onClick={() => setHourSelection(option)}
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
                            weatherSelection === option ? 'bg-red-500/20 border-red-500 border dark:text-white text-black ' : ' text-black dark:text-white '
                        }`}
                        onClick={() => setWeatherSelection(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className='py-2 text-neutral-800/80 font-bold dark:text-white/70'>{`Average IQA Values for ${hourSelection ? hourSelection : 'All Hours'} on a ${weatherSelection ? weatherSelection : 'All Weather Conditions'} Day`}</p>

            <div className='relative' style={{ minHeight: '400px' }}>
                {loading && (
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='loader'>Loading...</div> {/* Indicador de carga */}
                    </div>
                )}
                {!loading && (
                    <>
                        <ChartJSLineChart data={{ 'Combined': combinedData }} selection='Combined' color="rgba(255, 0, 0, 1)" />
                        <div className='mt-8'>
                            <ChartJSHeatMapChart data={{ 'Combined': combinedData }} selection='Combined' color="255, 0, 0" />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

function calculateCombinedAverages(weatherData: DataItem[], hourData: DataItem[], weatherSelection: string, hourSelection: string): DataItem[] {
    const allKeys = Object.keys(Object.assign({}, ...weatherData, ...hourData)).sort((a, b) => parseInt(a) - parseInt(b));
    const combined = [];

    for (let index = 0; index < Math.max(weatherData.length, hourData.length); index++) {
        const wItem = weatherData[index] || {};
        const hItem = hourData[index] || {};

        let combinedItem: DataItem = {};

        allKeys.forEach(key => {
            const weatherValue = weatherSelection ? wItem[key] ?? 0 : 0;
            const hourValue = hourSelection ? hItem[key] ?? 0 : 0;
            combinedItem[key] = (weatherValue + hourValue) / 2;
        });

        combined.push(combinedItem);
    }

    return combined.sort((a, b) => parseInt(Object.keys(a)[0]) - parseInt(Object.keys(b)[0]));
}

export default CombinedVisualizationPage;
