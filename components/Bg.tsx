'use client'
const Bg = () => {
  return (
    <div className='w-full h-[100dvh] scale-150 fixed left-0 -z-10'>
      <div className='w-full h-full  absolute light:bg-white dark:bg-darkBg transition-colors duration-300 ease-in-out'></div>
    </div>
  );
}

export default Bg;
