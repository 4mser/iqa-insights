'use client';

import React, { useState } from 'react';
import { IqaContrast } from '@/data/IQACONTRAST';

import ChartJSHeatMapChart from '@/graficos/ChartJSHeatMapChart';
import ChartJSLineChart from '@/graficos/ChartJsLineChart';
const VisualizationPage: React.FC = () => {
  const [selection, setSelection] = useState('Contrast');
  const data = IqaContrast;

  const options = ['Contrast', 'Shading', 'Exposure'];

  return (
    <div className='p-4 mt-20 md:mt-0'>
      <div className='flex space-x-2'>
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 rounded-full ${
              selection === option ? 'bg-sky-400/20 border border-sky-400 text-white' : ' text-black dark:text-white'
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
