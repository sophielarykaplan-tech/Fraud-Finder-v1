import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const PracticeLab: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>Practice Lab: Enron SPE Case (sim)</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This is a branching simulation stub. Users choose investigative steps and see outcomes.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="contained">Request Contracts</Button>
        <Button variant="outlined">Interview CFO</Button>
        <Button variant="outlined">Probe Intercompany Transactions</Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption">Scoring will be based on evidence requested and notes provided.</Typography>
      </Box>
    </Container>
  );
};

export default PracticeLab;
