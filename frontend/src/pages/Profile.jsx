import React from 'react';
import { Container, Typography, Paper, Grid, Button } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body1">
              Name: {user?.name}
            </Typography>
            <Typography variant="body1">
              Email: {user?.email}
            </Typography>
            <Typography variant="body1">
              Member since: {new Date(user?.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Change Password
            </Button>
            <Button variant="outlined" color="secondary">
              Update Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile; 