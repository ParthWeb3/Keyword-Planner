import React from 'react';
import '../styles/FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: 'Accurate Search Volume',
      description: 'Get precise data on keyword search volume to make informed decisions.',
      icon: '📈',
    },
    {
      id: 2,
      title: 'Competitive Analysis',
      description: 'Analyze keyword competition to identify opportunities.',
      icon: '⚔️',
    },
    {
      id: 3,
      title: 'Trending Keyword Suggestions',
      description: 'Discover trending keywords to stay ahead of the competition.',
      icon: '🔥',
    },
    {
      id: 4,
      title: 'User-Friendly Reports',
      description: 'Generate easy-to-read reports for your keyword research.',
      icon: '📄',
    },
    {
      id: 5,
      title: 'API Access for Developers',
      description: 'Integrate keyword data into your applications with our API.',
      icon: '💻',
    },
  ];

  return (
    <section className="features-section">
      <h2 className="section-title">Why Choose Us</h2>
      <div className="features-container">
        {features.map((feature) => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
