import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Dashboard = ({ data }) => (
  <div>
    <h2>Keyword Trends</h2>
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="volume" stroke="#8884d8" />
    </LineChart>
  </div>
);

export default Dashboard;
