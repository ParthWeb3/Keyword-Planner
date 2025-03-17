import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import KeywordAnalysisPage from "./pages/KeywordAnalysisPage";
import SignupLoginModal from "./components/SignupLoginModal"; // Import the modal
import './styles/App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="app-container">
        <NavBar openModal={openModal} /> {/* Pass openModal to NavBar */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/keyword-analysis" element={<KeywordAnalysisPage />} />
          </Routes>
        </main>
        <Footer />
        <SignupLoginModal isOpen={isModalOpen} onClose={closeModal} /> {/* Add the modal */}
      </div>
    </Router>
  );
}

export default App;
