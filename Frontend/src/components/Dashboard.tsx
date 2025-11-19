import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
} from '@mui/material';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 30%' }} component="div">
          <Card>
            <CardContent>
              <Typography variant="h6">Overview</Typography>
              <Typography variant="body2" color="text.secondary">
                Quick summary and KPIs go here.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 30%' }} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Activity</Typography>
            <Typography variant="body2" color="text.secondary">
              Recent calculations and checks.
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 30%' }} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Actions</Typography>
            <Typography variant="body2" color="text.secondary">
              Export, save, and next steps.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;