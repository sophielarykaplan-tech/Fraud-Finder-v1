import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, Divider } from '@mui/material';

interface StatementData {
  balanceSheet?: Record<string, number>;
  incomeStatement?: Record<string, number>;
  cashFlow?: Record<string, number>;
  footnotesText?: string;
}

const triggerTerms = ["bill-and-hold","guarantee","variable interest","adjusted","side letter","restatement"];

const simpleNLP = (text: string) => {
  const found: string[] = [];
  if (!text) return found;
  const lower = text.toLowerCase();
  triggerTerms.forEach((t) => { if (lower.includes(t)) found.push(t); });
  return found;
};

const scoreRisk = (deltas: number[]) => {
  // very simple heuristic: average delta magnitude
  if (!deltas.length) return 'Low';
  const avg = deltas.reduce((a,b)=>a+Math.abs(b),0)/deltas.length;
  if (avg > 0.2) return 'High';
  if (avg > 0.08) return 'Medium';
  return 'Low';
};

const FinancialReviewTool: React.FC = () => {
  const [data, setData] = useState<StatementData>({});
  const [message, setMessage] = useState<string | null>(null);
  const [indicators, setIndicators] = useState<any[]>([]);

  const runChecks = () => {
    setMessage(null);
    const inds: any[] = [];

    // example DSO check if values present
    const ar = data.balanceSheet?.['Accounts Receivable'] || data.balanceSheet?.['AR'];
    const revenue = data.incomeStatement?.['Revenue'] || data.incomeStatement?.['Sales'];
    if (ar && revenue) {
      const dso = (ar / (revenue / 365));
      const industryAvg = 45; // placeholder
      const diff = (dso - industryAvg) / industryAvg; // percent delta
      const risk = diff > 0.2 ? 'High' : diff > 0.08 ? 'Medium' : 'Low';
      inds.push({ area: 'Receivables', metric: 'DSO', value: dso, industryAvg, risk, explanation: `Your DSO is ${dso.toFixed(1)} days vs. industry ${industryAvg} days.` });
    }

    // cash vs net income check
    const netIncome = data.incomeStatement?.['Net Income'];
    const opCash = data.cashFlow?.['Net cash from operating activities'];
    if (typeof netIncome === 'number' && typeof opCash === 'number') {
      const ratio = Math.abs(opCash) / (Math.abs(netIncome) || 1);
      const risk = ratio < 0.5 ? 'High' : ratio < 0.9 ? 'Medium' : 'Low';
      inds.push({ area: 'Cash Flow Quality', metric: 'Cash/Income', value: ratio, risk, explanation: `Operating cash to net income = ${ratio.toFixed(2)}.` });
    }

    // footnote NLP
    const matches = simpleNLP(data.footnotesText || '');
    if (matches.length) {
      inds.push({ area: 'Footnotes', metric: 'Trigger Terms', value: matches, risk: 'Medium', explanation: `Found terms: ${matches.join(', ')}` });
    }

    setIndicators(inds);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>AI-Assisted Financial Review (prototype)</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Indicators are for further investigation only — consider discussing with a supervisor. No client data is used to train models.
      </Alert>

      <Box sx={{ mb: 2 }}>
        <TextField label="Balance Sheet (JSON)" fullWidth multiline minRows={3}
          onChange={(e)=>{ try { setData({...data, balanceSheet: JSON.parse(e.target.value)}); } catch { /* ignore */ } }}
          placeholder='{"Accounts Receivable":500000, "Cash":200000}' />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField label="Income Statement (JSON)" fullWidth multiline minRows={3}
          onChange={(e)=>{ try { setData({...data, incomeStatement: JSON.parse(e.target.value)}); } catch { /* ignore */ } }}
          placeholder='{"Revenue":6000000, "Net Income":200000}' />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField label="Cash Flow (JSON)" fullWidth multiline minRows={3}
          onChange={(e)=>{ try { setData({...data, cashFlow: JSON.parse(e.target.value)}); } catch { /* ignore */ } }}
          placeholder='{"Net cash from operating activities":150000}' />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField label="Footnotes / Notes (paste text)" fullWidth multiline minRows={3}
          onChange={(e)=>setData({...data, footnotesText: e.target.value})}
          placeholder='Paste footnote text here' />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={runChecks}>Run Quick Checks</Button>
        <Button variant="outlined" onClick={()=>{ setData({}); setIndicators([]); setMessage('Cleared'); }}>Clear</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {message && <Alert severity="info">{message}</Alert>}

      {indicators.length === 0 && <Typography>No indicators found yet. Run checks with sample JSON or paste real numbers (local only).</Typography>}

      {indicators.map((ind, i)=> (
        <Box key={i} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{ind.area} — {ind.metric} — {ind.risk} risk</Typography>
          <Typography variant="body2" color="text.secondary">{ind.explanation}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Actionable next step:</Typography>
            <Typography variant="body2">{ind.area === 'Receivables' ? 'Request AR aging and customer confirmations.' : 'Request supporting documents and reconciliations.'}</Typography>
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption">Privacy: All data stays in the browser. Do not paste personally identifiable information unless permitted.</Typography>
      </Box>
    </Container>
  );
};

export default FinancialReviewTool;
