// components/Insights.tsx

import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'General Insights',
    insights: [
      {
        title: 'General Trends',
        content: `
          IQA values generally start high in the morning, decrease towards noon, and recover in the afternoon. 
          Sunny days exhibit the highest variability in IQA values, with significant drops at noon and recovery in the evening.
          Cloudy days show more stable IQA values but still exhibit significant drops. 
          Rainy days display moderate fluctuations with a tendency to recover in the afternoon.
        `
      },
      {
        title: 'Impact of Weather Conditions',
        content: `
          Sunny: High initial IQA values with pronounced drops at noon and recovery towards the evening. 
          Cloudy: Stable IQA values with significant drops, particularly towards the afternoon. 
          Rainy: Moderate IQA fluctuations with recovery towards the afternoon, especially at positive angles of vision.
        `
      },
      {
        title: 'Impact of Time of Day',
        content: `
          9-12AM: IQA values tend to decrease in the morning with recovery towards midday, especially on sunny and rainy days. 
          12-3PM: Significant drops in IQA values are observed, with recovery towards the end of the period. 
          3-5PM: Recovery in IQA values after an initial drop is common across all weather conditions. 
          5PM-Sunset: IQA values tend to stabilize and increase towards the end of the day.
        `
      },
      {
        title: 'Variability with Viewing Angles',
        content: `
          Negative Angles (-45 to -15 degrees): IQA values tend to decrease at negative angles, especially on sunny days. 
          Central Angles (0 degrees): More stable IQA values are observed around the central angle, but variability remains. 
          Positive Angles (15 to 45 degrees): Recovery in IQA values is more pronounced at positive angles, particularly on cloudy and rainy days.
        `
      },
      {
        title: 'Conclusions and Recommendations',
        content: `
          Optimal Times for Image Capture: The best times for image capture are from 3-5PM and 5PM-Sunset due to stabilizing and increasing IQA values. 
          Adjustments for Different Weather Conditions: On sunny days, capture images at the start and end of the day to avoid drops at noon. On cloudy days, focus on midday captures to avoid significant drops. On rainy days, adjust viewing angles to maximize IQA peaks, especially towards positive angles. 
          Angle Optimization: Maintain central angles for stability and explore positive angles for potential IQA improvements across all weather conditions.
        `
      }
    ]
  },
  {
    title: 'Contrast Analysis',
    insights: [
      {
        title: 'Detailed Analysis',
        content: `
          Part 1-2: IQA values start low but gradually increase, indicating these areas have less initial contrast but improve. 
          Part 3: Highest peak observed, suggesting this area has the highest contrast and is most affected by lighting conditions. 
          Part 4: Sharp decline after the peak, indicating possible shading or less contrast. 
          Part 5: Lowest IQA values, indicating poor contrast in this section. 
          Part 6-9: Gradual recovery with minor peaks, indicating areas with moderate contrast but less impact compared to Part 3.
        `
      },
      {
        title: 'Implications',
        content: `
          Optimal contrast detection at specific angles highlights the importance of strategic viewpoint planning in robotic inspections. 
          Positions with high contrast values should be prioritized for detailed inspections to ensure the detection of subtle defects.
        `
      },
    ]
  },
  {
    title: 'Shading Analysis',
    insights: [
      {
        title: 'Detailed Analysis',
        content: `
          Part 1: Low initial IQA values due to even shading. 
          Part 2-3: Increase in IQA values with a peak at Part 3, indicating uneven shading or shadows. 
          Part 4: Decline after the peak, showing areas with less shading impact. 
          Part 5-6: Secondary peak observed, indicating another area with significant shading effects. 
          Part 7-9: Gradual decline, indicating more consistent shading across these parts.
        `
      },
      {
        title: 'Implications',
        content: `
          Strategic adjustment of the robot's viewpoint to angles with higher shading values can improve the accuracy of detecting shading-related defects. 
          Understanding the variation in shading values can help refine the robotic inspection process to adapt to different lighting conditions.
        `
      },
    ]
  },
  {
    title: 'Exposure Analysis',
    insights: [
      {
        title: 'Detailed Analysis',
        content: `
          Part 1: High initial IQA values due to optimal exposure. 
          Part 2: Sharp decline to the lowest point, indicating overexposure or underexposure issues. 
          Part 3-4: Recovery with a significant peak at Part 4, suggesting improved exposure balance. 
          Part 5-6: Decline after the peak, indicating inconsistent exposure. 
          Part 7-9: Gradual recovery with another peak towards Part 9, suggesting areas with better exposure management.
        `
      },
      {
        title: 'Implications',
        content: `
          High exposure values at certain angles can guide the robot to focus on these positions for capturing images under varying lighting conditions. 
          Consistent exposure is crucial for reliable image analysis, making it essential to identify and prioritize optimal angles.
        `
      }
    ]
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

const Insights: React.FC = () => {
  return (
    <div className="insights container mx-auto p-6 bg-lightBg dark:bg-darkBg font-sans transition-colors duration-300">
      {sections.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-primary dark:text-secondary text-3xl font-bold mb-8">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.insights.map((insight, subIndex) => (
              <motion.div
                key={subIndex}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.8 }}
                variants={cardVariants}
                className="bg-lightCard dark:bg-darkCard p-6 rounded-lg shadow-3xl hover:shadow-4xl transform transition-transform duration-300"
              >
                <h3 className="text-primary dark:text-secondary text-2xl font-bold mb-4">{insight.title}</h3>
                <p className="text-lightText dark:text-darkText mb-4 whitespace-pre-line">{insight.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Insights;
