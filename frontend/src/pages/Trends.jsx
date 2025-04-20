import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid } from '@mui/material';
import { trendsService } from '../services/api';

const Trends = () => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await trendsService.getTrends();
        setTrends(response.data);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Keyword Trends
      </Typography>
      <Grid container spacing={3}>
        {trends.map((trend) => (
          <Grid item xs={12} md={6} key={trend.id}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {trend.keyword}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Volume: {trend.volume}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {new Date(trend.updatedAt).toLocaleDateString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Trends; 