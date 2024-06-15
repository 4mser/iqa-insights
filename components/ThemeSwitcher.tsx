'use client'
import Image from 'next/image';
import { useState, useEffect } from 'react';

function ThemeSwitcher() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <button onClick={toggleTheme} className='w-8 h-8 flex items-center justify-center p-2 rounded-full hover:bg-black/20 dark:hover:bg-white/20'>
      <Image 
        src={theme === 'light' ? '/icons/moon.svg' : '/icons/sun.svg'}
        width={20}
        height={20}
        alt='Theme Switcher'
      />
    </button>
  );
}

export default ThemeSwitcher;
