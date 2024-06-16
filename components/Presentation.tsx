// components/ExperimentPresentation.tsx

import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Abstract',
    content: `
      This study presents a groundbreaking methodology for enhancing robotic quality inspections under varying lighting conditions, critically impacting image quality and defect detection accuracy. We introduce a dynamic viewpoint planning strategy that significantly improves defect detection precision by adapting to environmental changes.
    `
  },
  {
    title: 'Introduction',
    content: `
      The emergence of machine vision technologies has transformed industries, enabling automated quality control systems essential for maintaining product integrity, enhancing operational efficiency, and elevating customer satisfaction. Despite these advancements, mobile robotic inspections face significant challenges due to fluctuating lighting conditions. This paper introduces a novel IQA-driven methodology to optimize robotic positioning for improved defect detection in construction site inspections.
    `
  },
  {
    title: 'Related Work',
    content: `
      Advancements in robotic inspection systems (RIS) focus on Image Quality Assessment (IQA) for defect detection and optimization of robotic movements. Traditional IQA methods face limitations in real-world applications, highlighting the need for more adaptable IQA techniques in practical settings.
    `
  },
  {
    title: 'Proposed Methodology',
    content: `
      Our study introduces an IQA methodology tailored for optimizing the navigation and positioning of robotic inspection systems during vision-based tasks. The Spot robot, equipped with an advanced PTZ camera, autonomously navigates to capture high-resolution images under various lighting conditions. Our IQA model evaluates image quality in real-time, guiding the robot to optimal positions.
    `
  },
  {
    title: 'Experimental Setup and Results',
    content: `
      Experiments validate our IQA-driven approach, showing significant improvements in image quality and defect detection accuracy. The Spot robot captured high-quality images under diverse lighting conditions, confirming the robustness of our methodology.
    `
  },
  {
    title: 'Discussion and Conclusions',
    content: `
      Our research advances automated quality inspections, enhancing productivity, reducing costs, and promoting higher industry standards. Future research will focus on improving the IQA algorithm and adapting the system to different industrial environments.
    `
  }
];

const cardVariants = {
  offscreen: {
    opacity: 0,
  },
  onscreen: {
    opacity: 1,
    transition: {
      duration: 0.8,
    }
  }
};

const ExperimentPresentation: React.FC = () => {
  return (
    <div className="presentation max-w-4xl mx-auto p-6 bg-lightBg dark:bg-darkBg font-sans transition-colors duration-300">
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.8 }}
          variants={cardVariants}
          className="mb-8 bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl hover:shadow-4xl transform transition-transform duration-300"
        >
          <h2 className="text-primary dark:text-secondary text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-lightText dark:text-darkText mb-4 whitespace-pre-line">{section.content}</p>
        </motion.div>
      ))}
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.8 }}
        variants={cardVariants}
        className="mb-8 bg-primary dark:bg-secondary text-white dark:text-black p-6 rounded-lg shadow-3xl hover:shadow-4xl transform transition-transform duration-300 text-center cursor-pointer"
        onClick={() => window.open('/paper/IQA_Viewpoints_v3.pdf', '_blank')}
      >
        <h2 className="text-3xl font-bold mb-4">Download Full Paper</h2>
        <p>Click here to download the full PDF of the paper.</p>
      </motion.div>
    </div>
  );
};

export default ExperimentPresentation;
