import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import SignupLoginModal from "./components/SignupLoginModal"; // Import the modal
import './styles/App.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const KeywordAnalysisPage = lazy(() => import('./pages/KeywordAnalysisPage'));

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Router>
      <div className="app-container">
        <NavBar openModal={openModal} /> {/* Pass openModal to NavBar */}
        <main className="main-content">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/keyword-analysis" element={<KeywordAnalysisPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <SignupLoginModal isOpen={isModalOpen} onClose={closeModal} /> {/* Add the modal */}
      </div>
    </Router>
  );
}

export default App;
