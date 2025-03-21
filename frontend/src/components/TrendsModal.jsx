import React from 'react';

const TrendsModal = ({ isOpen, onClose, trendsData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Trends Data</h2>
        <ul>
          {trendsData.map((trend, index) => (
            <li key={index}>{trend}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrendsModal;
