'use client';

import React, { useState } from 'react';
import { IqaContrast } from '@/data/IQACONTRAST';

import ChartJSHeatMapChart from '@/graficos/ChartJSHeatMapChart';
import ChartJSLineChart from '@/graficos/ChartJSLineChart';
const VisualizationPage: React.FC = () => {
  const [selection, setSelection] = useState('Contrast');
  const data = IqaContrast;

  const options = ['Contrast', 'Shading', 'Exposure'];

  return (
    <div className=''>
      <div className='flex space-x-2'>
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 text-xs md:text-base rounded-full ${
              selection === option ? 'bg-cyan-400/20 border border-cyan-400 dark:text-white text-black' : ' text-black dark:text-white'
            }`}
            onClick={() => setSelection(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className=' text-neutral-800/80 font-bold dark:text-white/70 py-4'>{`Average IQA Values for ${selection}`}</p>
      <ChartJSLineChart data={data} selection={selection} color="rgba(75, 192, 192, 1)"/>
      <div className='mt-8'>
        <ChartJSHeatMapChart data={data} selection={selection} color="75, 192, 192"/>
      </div>
    </div>
  );
};

export default VisualizationPage;
