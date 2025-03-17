import React, { useState } from 'react';
import '../styles/SignupLoginModal.css';

const SignupLoginModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('signup');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
        </div>
        {activeTab === 'signup' ? (
          <form className="form">
            <h2>Sign Up</h2>
            <input type="text" placeholder="Name" required />
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <div className="checkbox-container">
              <input type="checkbox" id="privacy" required />
              <label htmlFor="privacy">I agree to the Privacy Policy</label>
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
            <button className="google-button">Sign Up with Google</button>
          </form>
        ) : (
          <form className="form">
            <h2>Login</h2>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit" className="submit-button">
              Login
            </button>
            <button className="google-button">Login with Google</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignupLoginModal;
