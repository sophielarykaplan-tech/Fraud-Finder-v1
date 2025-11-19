import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

interface OverlayProps {
  lineItem: string;
  value?: number;
  onCompute?: () => void;
}

const RedFlagOverlay: React.FC<OverlayProps> = ({ lineItem, value, onCompute }) => {
  return (
    <Paper sx={{ p: 2, border: '1px solid #f5c6cb', backgroundColor: '#fff7f8' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{lineItem}</Typography>
      <Typography variant="body2">Value: {value ?? '—'}</Typography>
      <Button size="small" onClick={onCompute} sx={{ mt: 1 }}>Compute & Explain</Button>
    </Paper>
  );
};

export default RedFlagOverlay;
