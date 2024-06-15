'use client'

import React, { useState } from 'react'
import ThreeScene from './ThreeScene';

const RenderScene = () => {
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);

  return (
        <ThreeScene onAngleSelect={setSelectedAngle} />
  )
}

export default RenderScene
