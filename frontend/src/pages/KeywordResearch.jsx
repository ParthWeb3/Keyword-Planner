import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper, Grid } from '@mui/material';
import { keywordService } from '../services/api';

const KeywordResearch = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await keywordService.getKeywords({ keyword });
      setResults(response.data);
    } catch (error) {
      console.error('Error searching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Keyword Research
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {results && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          {/* Add results display here */}
        </Paper>
      )}
    </Container>
  );
};

export default KeywordResearch; 