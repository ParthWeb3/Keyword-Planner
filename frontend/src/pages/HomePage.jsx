import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Keyword Planning and Research Tools</h1>
          <p className="hero-subtitle">
            Empower your digital marketing strategy with data-driven keyword insights
          </p>
          <Link to="/keyword-analysis" className="cta-button">
            Start Analyzing Keywords
          </Link>
        </div>
      </section>

      <section className="section mission-section">
        <h2 className="section-title">Our Mission</h2>
        <p className="section-description">
          We are a dedicated team working towards providing the best keyword planning and research 
          tools for marketers and businesses. We're a cutting-edge keyword analysis platform designed 
          to help social media marketers, content creators, and businesses optimize their online presence. 
          Our innovative tool provides in-depth keyword analysis across multiple social media platforms, 
          empowering you to make data-driven decisions.
        </p>
        <p className="section-description">
          We believe that every business deserves to reach its global audience, regardless of language 
          constraints. That's why we've developed a keyword planner that supports multiple languages, 
          ensuring you can connect with your audience worldwide.
        </p>
      </section>

      <section className="section features-section">
        <h2 className="section-title">Key Features</h2>
        <div className="features-container">
          <div className="feature-card">
            <h3 className="feature-title">Multilingual Keyword Analysis</h3>
            <p className="feature-description">
              Get insights into keyword performance across various social media platforms in multiple languages.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">In-Depth Analytics</h3>
            <p className="feature-description">
              Unlock valuable data on keyword trends, competition, and engagement to refine your content strategy.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Cross-Platform Comparison</h3>
            <p className="feature-description">
              Compare keyword performance across different social media platforms to identify opportunities and challenges.
            </p>
          </div>
          <div className="feature-card">
            <h3 className="feature-title">Actionable Recommendations</h3>
            <p className="feature-description">
              Receive expert suggestions to optimize your keyword strategy and boost your online presence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
