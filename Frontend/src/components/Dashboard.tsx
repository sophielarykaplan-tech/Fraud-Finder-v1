import React from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Button, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Module {
  id: number;
  title: string;
  description: string;
  progress: number;
  estimatedTime: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const modules: Module[] = [
    {
      id: 0,
      title: 'Module 0: Forensic Accounting Foundations',
      description: 'Learn the goals of forensic accounting and why lawyers need this skill.',
      progress: 100,
      estimatedTime: '25 min',
    },
    {
      id: 2,
      title: 'Module 2: Revenue & Receivables Fraud',
      description: 'Identify bill-and-hold schemes, side letters, and DSO red flags.',
      progress: 45,
      estimatedTime: '45 min',
    },
    {
      id: 3,
      title: 'Module 3: Expense & Reserve Fraud',
      description: 'Detect under-accruals, big bath charges, and estimate manipulation.',
      progress: 0,
      estimatedTime: '40 min',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Spot the Red Flags
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Forensic Accounting Training for Legal Professionals
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Modules Completed
              </Typography>
              <Typography variant="h4" sx={{ color: '#1976d2' }}>
                1 of 3
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#f3e5f5' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Overall Progress
              </Typography>
              <Typography variant="h4" sx={{ color: '#7b1fa2' }}>
                48%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#e8f5e9' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Calculators Used
              </Typography>
              <Typography variant="h4" sx={{ color: '#388e3c' }}>
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fff3e0' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Cases Completed
              </Typography>
              <Typography variant="h4" sx={{ color: '#f57c00' }}>
                0
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Modules */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Learning Modules
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {modules.map((module) => (
          <Grid item xs={12} key={module.id}>
            <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' }, transition: 'all 0.2s' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {module.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      {module.description}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 2, whiteSpace: 'nowrap' }}>
                    ⏱️ {module.estimatedTime}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      Progress
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {module.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={module.progress} sx={{ height: 8, borderRadius: 4 }} />
                </Box>

                <Button
                  variant="contained"
                  onClick={() => navigate(`/module/${module.id}`)}
                  size="small"
                >
                  {module.progress === 0 ? '▶ Start' : module.progress === 100 ? '🔄 Review' : '▶ Continue'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Tools */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Quick Tools
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📊 DSO Calculator
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Calculate Days Sales Outstanding
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/tools/dso')}>
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🤖 AI Review Tool
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Upload financial statements
              </Typography>
              <Button variant="outlined" size="small" onClick={() => navigate('/tools/ai-review')}>
                Open
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                📚 Case Studies
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Learn from real cases
              </Typography>
              <Button variant="outlined" size="small" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ cursor: 'pointer', '&:hover': { boxShadow: 4 } }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                🚩 Red Flags Library
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Browse all red flags
              </Typography>
              <Button variant="outlined" size="small" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;