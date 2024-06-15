'use client'
'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RenderScene from "@/components/RenderScene";
import VisualizationPage from "@/components/VisualizationPage";
import CombinedVisualizationPage from "@/components/CombinedVisualizationPage";
import AdditionalCharts from "@/components/AdditionalCharts";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const pages = [
  {
    id: 0,
    title: "3D Scene",
    component: (
      <div className="w-full h-full flex-grow">
        <RenderScene />
      </div>
    ),
  },
  {
    id: 1,
    title: "Charts",
    component: (
      <div className="w-full h-[100dvh] overflow-y-auto flex-grow flex flex-col md:px-56 md:pt-20 ">
        <VisualizationPage />
        <CombinedVisualizationPage />
      </div>
    ),
  },
  {
    id: 2,
    title: "Insights",
    component: (
      <div className="w-full h-full flex-grow">
        <AdditionalCharts />
      </div>
    ),
  },
  {
    id: 3,
    title: "Gallery",
    component: (
      <div className="w-full h-full flex-grow">
        <AdditionalCharts />
      </div>
    ),
  },
];

const Home = () => {
  const [pageIndex, setPageIndex] = useState(0);

  return (
    <div className="h-[100dvh] w-full flex flex-col transition-all justify-center items-cente overflow-y-autor">
      <nav className="absolute top-5 left-1/2 -translate-x-1/2 z-50  flex justify-between bg-black/20 backdrop-blur-lg border border-white/20 text-white p-2 rounded-full text-nowrap items-center gap-3">
        <div className="flex space-x-4">
          {pages.map((page, index) => (
            <button
            key={index}
            onClick={() => setPageIndex(index)}
            className={`px-4 py-2 transition rounded-full ${
              pageIndex === index
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "hover:bg-black/20 dark:hover:bg-white/20   hover:text-white"
            }`}
            >
              {page.title}
            </button>
          ))}
        </div>
          <ThemeSwitcher />
      </nav>
      <div className="w-full h-full flex-grow relative overflow-hidden">
        <AnimatePresence mode="wait">
          {pages.map((page, index) =>
            pageIndex === index ? (
              <motion.div
                key={page.id}
                className="w-full h-full absolute top-0 left-0"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                {page.component}
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Home;
