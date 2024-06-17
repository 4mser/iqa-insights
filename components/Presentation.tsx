import React from 'react';
import { motion } from 'framer-motion';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const sections = [
  {
    title: '1. Abstract',
    content: 'This study introduces a methodology for enhancing robotic inspections under varying lighting conditions, improving image quality and defect detection accuracy.'  
  },
  {
    title: '2. Introduction',
    content: 'Machine vision technologies have transformed industries, but lighting variations pose significant challenges. Our IQA-driven methodology optimizes robotic positioning for improved defect detection.',
    chartData: {
      labels: ['Challenge', 'Solution', 'Improvement'],
      datasets: [
        {
          label: 'Impact of Machine Vision',
          data: [50, 70, 90],
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1
        }
      ]
    }
  },
  {
    title: '3. Proposed Methodology',
    content: 'Our IQA methodology, using the Spot robot, dynamically adjusts its position based on real-time IQA scores to ensure optimal image quality.',
    image: '/images/p1.png'
  },
  {
    title: '4. Experimental Setup',
    content: 'The Spot robot captures images from various angles under different lighting conditions to assess image quality and defect detection accuracy.',
    image: '/images/scene.jpg'
  },
  {
    title: '5. Results',
    content: 'Results validate our approach, showing significant improvements in image quality and defect detection accuracy.',
    chartData: {
      labels: ['Sunny', 'Cloudy', 'Rainy'],
      datasets: [
        {
          label: 'Image Quality Scores',
          data: [85, 75, 90],
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
        }
      ]
    },
    images: [
      {
        src: '/mnt/data/weather_conditions.png',
        alt: 'Image Quality Scores vs. Angle under Different Weather Conditions'
      },
      {
        src: '/mnt/data/times_of_day.png',
        alt: 'Image Quality Scores vs. Angle at Different Times of Day'
      }
    ]
  },
  {
    title: '6. Conclusion',
    content: 'Our research enhances robotic inspections, improving productivity and reducing costs. Future work will focus on refining the IQA algorithm and adapting the system to various environments.'
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
      <div className="toc mb-8">
        <h2 className="text-primary dark:text-secondary text-3xl font-bold mb-4">Table of Contents</h2>
        <ul className="list-disc ml-6">
          {sections.map((section, index) => (
            <li key={index} className="mb-2">
              <a href={`#section-${index}`} className="text-lightText dark:text-darkText hover:underline">{section.title}</a>
            </li>
          ))}
        </ul>
      </div>
      {sections.map((section, index) => (
        <motion.div
          id={`section-${index}`}
          key={index}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.8 }}
          variants={cardVariants}
          className="mb-8 bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl hover:shadow-4xl transform transition-transform duration-300"
        >
          <h2 className="text-primary dark:text-secondary text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-lightText dark:text-darkText mb-4 whitespace-pre-line">{section.content}</p>
          {section.image && 
            <div className='mb-4 rounded-lg shadow-lg overflow-hidden'>
              <img src={section.image} alt={`${section.title} illustration`} className=" w-full h-full object-cover scale-125" />
            </div>
          }
          {section.chartData && (
            <div className="mb-4">
              <Bar data={section.chartData} />
            </div>
          )}
          {section.images && section.images.map((image, imgIndex) => (
            <div key={imgIndex} className="mb-4">
              <img src={image.src} alt={image.alt} className="rounded-lg shadow-lg" />
            </div>
          ))}
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
