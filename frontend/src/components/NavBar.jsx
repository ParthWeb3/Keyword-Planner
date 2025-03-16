import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../utils/logo.png'; // Import the logo

const NavBar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" className="navbar-logo-image" /> {/* Add logo */}
          Keyword Planner
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/keyword-analysis" className="nav-link">Keyword Analysis</Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link">Signup</Link>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link">Login</Link>
          </li>
          <li className="nav-item">
            <button onClick={handleLogout} className="nav-link logout-button">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
