import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import Dashboard from './components/Dashboard';
import DSOCalculator from './components/DSOCalculator';
import AIReviewTool from './components/AIReviewTool';
import ModuleViewer from './components/ModuleViewer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Header */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                🚩 Spot the Red Flags
              </Typography>
              <Button color="inherit" href="/">
                Home
              </Button>
              <Button color="inherit" href="/tools/dso">
                DSO Calculator
              </Button>
              <Button color="inherit" href="/tools/ai-review">
                AI Review
              </Button>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tools/dso" element={<DSOCalculator />} />
              <Route path="/tools/ai-review" element={<AIReviewTool />} />
              <Route path="/module/:id" element={<ModuleViewer />} />
            </Routes>
          </Box>

          {/* Footer */}
          <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, textAlign: 'center', marginTop: 4 }}>
            <Typography variant="caption" color="textSecondary">
              © 2025 Spot the Red Flags - Forensic Accounting Training Platform
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;