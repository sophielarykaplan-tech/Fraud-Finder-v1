import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              <Typography variant="body2" color="text.secondary">
                Quick summary and KPIs go here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Activity</Typography>
            <Typography variant="body2" color="text.secondary">
              Recent calculations and checks.
            </Typography>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Actions</Typography>
            <Typography variant="body2" color="text.secondary">
              Export, save, and next steps.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;