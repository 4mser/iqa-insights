'use client'

import React, { useState } from 'react'
import ThreeScene from './ThreeScene';
import AngleLineChartByHours from '@/graficos/AngleLineChartByHours';
import AngleLineChartByWeather from '@/graficos/AngleLineChartByWeather';
const RenderScene: React.FC = () => {
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);

  return (
    <div>
      <ThreeScene onAngleSelect={setSelectedAngle} />
      <div className='absolute z-50 right-10 top-24'>
        {selectedAngle !== null && (
          <AngleLineChartByHours selectedAngle={selectedAngle} />
        )}
      </div>
      <div className='absolute z-50 right-10 top-[340px]'>
        {selectedAngle !== null && (
          <AngleLineChartByWeather selectedAngle={selectedAngle} />
        )}
      </div>
    </div>
  );
}

export default RenderScene;
