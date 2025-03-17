import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = ({ openModal }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Keyword Planner
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/keyword-analysis" className="nav-link">Keyword Analysis</Link>
          </li>
        </ul>
        <div className="auth-buttons">
          <button className="login-button" onClick={openModal}>Login</button>
          <button className="signup-button" onClick={openModal}>Sign Up</button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
