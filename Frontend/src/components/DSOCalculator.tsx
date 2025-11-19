import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';

interface DSOResult {
  dso: number;
  industry_avg: number;
  risk_level: 'Low' | 'Medium' | 'High';
  interpretation: string;
  next_steps: string[];
}

const DSOCalculator: React.FC = () => {
  const [ar, setAR] = useState<string>('');
  const [revenue, setRevenue] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Healthcare');
  const [result, setResult] = useState<DSOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<{ [key: number]: boolean }>({});

  const industries = [
    { value: 'Healthcare', label: 'Healthcare Devices' },
    { value: 'Software', label: 'Software' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
  ];

  const calculateDSO = async () => {
    if (!ar || !revenue) {
      setError('Please enter both Accounts Receivable and Annual Revenue');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/calculators/dso', {
        accounts_receivable: parseFloat(ar),
        annual_revenue: parseFloat(revenue),
        industry: industry,
        days_in_period: 365,
      });

      setResult(response.data);
      setCheckedSteps({});
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'An error occurred. Make sure the backend is running on http://localhost:8000'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'info';
    }
  };

  const handleStepCheck = (index: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        📊 Days Sales Outstanding (DSO) Calculator
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Measure how quickly your company collects cash after making a sale. Higher DSO indicates slower collections and potential revenue quality issues.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Enter Financial Data
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Accounts Receivable ($)"
                type="number"
                value
                import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
  MenuItem,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

interface DSOResult {
  dso: number;
  industry_avg: number;
  risk_level: 'Low' | 'Medium' | 'High';
  interpretation: string;
  next_steps: string[];
}

const DSOCalculator: React.FC = () => {
  const [ar, setAR] = useState<string>('500000');
  const [revenue, setRevenue] = useState<string>('6000000');
  const [industry, setIndustry] = useState<string>('Healthcare');
  const [result, setResult] = useState<DSOResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<{ [key: number]: boolean }>({});

  const industries = [
    { value: 'Healthcare', label: 'Healthcare Devices' },
    { value: 'Software', label: 'Software' },
    { value: 'Manufacturing', label: 'Manufacturing' },
    { value: 'Retail', label: 'Retail' },
  ];

  const calculateDSO = async () => {
    if (!ar || !revenue) {
      setError('Please enter both Accounts Receivable and Annual Revenue');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/calculators/dso', {
        accounts_receivable: parseFloat(ar),
        annual_revenue: parseFloat(revenue),
        industry: industry,
        days_in_period: 365,
      });

      setResult(response.data);
      setCheckedSteps({});
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'An error occurred. Make sure the backend is running on http://localhost:8000'
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      default:
        return 'info';
    }
  };

  const handleStepCheck = (index: number) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        📊 Days Sales Outstanding (DSO) Calculator
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
        Measure how quickly your company collects cash after making a sale. Higher DSO indicates slower collections and potential revenue quality issues.
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Step 1: Enter Financial Data
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Accounts Receivable ($)"
                type="number"
                value={ar}
                onChange={(e) => setAR(e.target.value)}
                placeholder="e.g., 500000"
                inputProps={{ step: '1000' }}
                helperText="From Balance Sheet - Current Assets"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Annual Revenue ($)"
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                placeholder="e.g., 6000000"
                inputProps={{ step: '10000' }}
                helperText="From Income Statement - Total Revenue"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                helperText="Select your industry for benchmark comparison"
              >
                {industries.map((ind) => (
                  <MenuItem key={ind.value} value={ind.value}>
                    {ind.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={calculateDSO}
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Calculating...
                  </>
                ) : (
                  '🔢 Calculate DSO'
                )}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Grid container spacing={2}>
          {/* Results Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📈 Results
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Your DSO
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                      {result.dso.toFixed(1)} days
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" color="textSecondary">
                      Industry Average ({industry})
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                      {result.industry_avg} days
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                    Difference from Industry Average
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color:
                        result.dso > result.industry_avg
                          ? '#f44336'
                          : '#4caf50',
                    }}
                  >
                    {result.dso > result.industry_avg ? '+' : ''}
                    {(result.dso - result.industry_avg).toFixed(1)} days
                  </Typography>
                </Box>

                <Alert severity={getRiskColor(result.risk_level)} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    🚩 Risk Level: {result.risk_level}
                  </Typography>
                  <Typography variant="body2">
                    {result.interpretation}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>

          {/* Next Steps */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📋 Next Steps: Document Requests
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Use this checklist to guide your investigation. Request these documents from management:
                </Typography>

                <List>
                  {result.next_steps.map((step, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        backgroundColor: checkedSteps[index] ? '#e8f5e9' : 'transparent',
                        borderRadius: 1,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                      }}
                      onClick={() => handleStepCheck(index)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checkedSteps[index] || false}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={step}
                        sx={{
                          textDecoration: checkedSteps[index] ? 'line-through' : 'none',
                          color: checkedSteps[index] ? '#999' : 'inherit',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                    💡 Pro Tip:
                  </Typography>
                  <Typography variant="caption">
                    Look for side letters or hidden agreements that allow customers to delay payment or return goods. These are red flags for revenue recognition issues.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Export / Save */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" fullWidth>
                📥 Export as PDF
              </Button>
              <Button variant="outlined" fullWidth>
                💾 Save to My Case
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default DSOCalculator;