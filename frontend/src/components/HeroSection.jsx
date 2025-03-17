import React from 'react';
import '../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Find the Best Keywords for Your Business</h1>
        <p className="hero-subtext">
          Get accurate keyword data, search volume, and competition analysis in one place.
        </p>
        <p>Start Analyzing Keywords</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Try searching for a keyword..."
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
