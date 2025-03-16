import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TrendsModal = ({ trendsData, onClose }) => {
  return (
    <div className="trends-modal">
      <h2>Search Volume Trends</h2>
      <LineChart
        width={600}
        height={300}
        data={trendsData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
      <button onClick={onClose} className="close-modal-button">Close</button>
    </div>
  );
};

export default TrendsModal;
