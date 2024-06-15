'use client';
import React, { useState, useEffect } from 'react';
import { IqaWeather } from '@/data/IQAWEATHER';
import { IqaHours } from '@/data/IQAHOURS';
import ApexLineChart from '../graficos/ApexLineChart';
import HeatMapChart2 from '../graficos/HeatMapChart2';

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
    const [isDataLoaded, setIsDataLoaded] = useState(false);  // Estado para controlar la carga de datos

    useEffect(() => {
        if (!IqaWeather[weatherSelection] && !IqaHours[hourSelection]) {
            console.error("Both data sets are undefined", {
                weatherData: IqaWeather[weatherSelection],
                hourData: IqaHours[hourSelection]
            });
            setIsDataLoaded(false);  // Asegurar que no intentamos renderizar sin datos
            return;
        }

        const weatherData = IqaWeather[weatherSelection] ?? [];
        const hourData = IqaHours[hourSelection] ?? [];
        const combinedAverages = calculateCombinedAverages(weatherData, hourData, weatherSelection, hourSelection);
        setCombinedData(combinedAverages);
        setIsDataLoaded(true);  // Marcar que los datos están listos
    }, [weatherSelection, hourSelection]);

    const hourOptions = ['9-12AM', '12PM-3PM', '3PM-5PM', '5PM-Sunset'];
    const weatherOptions = ['Sunny', 'Cloudy', 'Rainy'];

    return (
        <section className='p-4'>
            <div className='flex space-x-2 mb-4'>
                {hourOptions.map(option => (
                    <button
                        key={option}
                        className={`py-2 px-4 rounded-full ${
                            hourSelection === option ? 'bg-red-500 text-white' : ' text-black dark:text-white'
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
                        className={`py-2 px-4 rounded-full ${
                            weatherSelection === option ? 'bg-red-500 text-white' : ' text-black dark:text-white'
                        }`}
                        onClick={() => setWeatherSelection(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            <p className='py-2 text-neutral-800/80 font-bold dark:text-white/70'>{`Average IQA Values for ${hourSelection ? hourSelection : 'All Hours'} on a ${weatherSelection ? weatherSelection : 'All Weather Conditions'} Day`}</p>

            {isDataLoaded ? <ApexLineChart key={`${weatherSelection}-${hourSelection}`} data={{ 'Combined': combinedData }} selection='Combined' color="#FF0000" /> : null}
            <HeatMapChart2 data={{ 'Combined': combinedData }} selection='Combined' color="#FF0000" /> 
        </section>
    );
};

function calculateCombinedAverages(weatherData: DataItem[], hourData: DataItem[], weatherSelection: string, hourSelection: string): DataItem[] {
    // Encontrar el rango completo de valores de eje x
    const allKeys = Object.keys(Object.assign({}, ...weatherData, ...hourData));
    const xAxisCategories = allKeys.sort((a, b) => parseInt(a) - parseInt(b));

    const combined = [];

    for (let index = 0; index < Math.max(weatherData.length, hourData.length); index++) {
        const wItem = weatherData[index] || {};
        const hItem = hourData[index] || {};

        let combinedItem: DataItem = {};

        xAxisCategories.forEach(key => {
            const weatherValue = weatherSelection ? wItem[key] ?? 0 : 0;
            const hourValue = hourSelection ? hItem[key] ?? 0 : 0;
            combinedItem[key] = (weatherValue + hourValue) / 2;
        });

        combined.push(combinedItem);
    }

    return combined;
}

export default CombinedVisualizationPage;
