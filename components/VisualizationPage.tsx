'use client'

import React, { useState } from 'react';
import { IqaContrast } from '@/data/IQACONTRAST';
import ApexLineChart from '../graficos/ApexLineChart';
import HeatMapChart from '../graficos/HeatMapChart';

const VisualizationPage: React.FC = () => {
  const [selection, setSelection] = useState('Contrast');
  const data = IqaContrast;  // Asegúrate de que esto corresponda a tus datos importados

  const options = ['Contrast', 'Shading', 'Exposure'];

  return (
    <div className='p-4 mt-20 md:mt-0'>
      <div className='flex space-x-2'>
        {options.map(option => (
          <button
            key={option}
            className={`py-2 px-4 rounded-full ${
              selection === option ? 'bg-sky-400 text-white' : ' text-black dark:text-white'
            }`}
            onClick={() => setSelection(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <p className=' text-neutral-800/80 font-bold dark:text-white/70 py-4'>{`Average IQA Values for ${selection}`}</p>
      <ApexLineChart data={data} selection={selection} color="#4BCDF8"/>
      <div className=''>
        <HeatMapChart data={data} selection={selection} color="#4BCDF8"/>
      </div>
    </div>
  );
};

export default VisualizationPage;
