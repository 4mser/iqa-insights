'use client'
import { useState, useEffect } from 'react';

const Bg = () => {
  const [theme, setTheme] = useState('light'); // Default theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      setTheme(savedTheme);
    } else {
      document.documentElement.classList.add('light');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    // Remove previous theme class from document element
    document.documentElement.classList.remove('light', 'dark', 'sunrise', 'sunset');
    // Add current theme class to document element
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <div className={`w-full h-[100dvh] scale-150 fixed left-0 -z-10 transition-colors duration-300 ease-in-out`}>
      <div className={`w-full h-full absolute ${theme === 'light' ? 'bg-lightBg' : ''} ${theme === 'dark' ? 'bg-darkBg' : ''} ${theme === 'sunrise' ? 'bg-sunriseBg' : ''} ${theme === 'sunset' ? 'bg-sunsetBg' : ''}`}></div>
    </div>
  );
}

export default Bg;
