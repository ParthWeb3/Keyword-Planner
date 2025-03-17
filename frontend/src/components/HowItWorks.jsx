import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Enter a Keyword',
      description: 'Start by entering a keyword to analyze its performance.',
      icon: '🔍',
    },
    {
      id: 2,
      title: 'Analyze Data',
      description: 'Get detailed insights into search volume and competition.',
      icon: '📊',
    },
    {
      id: 3,
      title: 'Optimize & Grow',
      description: 'Use the data to optimize your strategy and grow your business.',
      icon: '🚀',
    },
  ];

  return (
    <section className="how-it-works">
      <h2 className="section-title">How It Works</h2>
      <div className="steps-container">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-icon">{step.icon}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
