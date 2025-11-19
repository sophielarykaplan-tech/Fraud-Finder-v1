import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Card, CardContent, Button, Grid, Alert } from '@mui/material';

interface ModuleContent {
  id: number;
  title: string;
  sections: Array<{
    heading: string;
    content: string;
  }>;
}

const modules: { [key: number]: ModuleContent } = {
  0: {
    id: 0,
    title: 'Module 0: Forensic Accounting Foundations',
    sections: [
      {
        heading: 'What is Forensic Accounting?',
        content:
          'Forensic accounting is detective work. We use financial numbers and documents to answer one question: Are the reported results honest, or has someone manipulated them? In legal practice, forensic accounting helps you: (1) Detect Manipulation - Find intentional misstatements in financial records, (2) Trace Funds - Follow money to understand where it went and who benefited, (3) Evaluate Intent - Distinguish between honest mistakes and deliberate fraud.',
      },
      {
        heading: 'Why Lawyers Need This Skill',
        content:
          'M&A Due Diligence: Verify financial claims before closing a deal. Securities Litigation: Prove whether financial statements were materially false. Internal Investigations: Determine if management committed fraud. Regulatory Compliance: Assess whether financial controls are adequate.',
      },
      {
        heading: 'Red Flags as Evidence',
        content:
          'A red flag is an indicator that warrants further investigation—not proof of fraud. Multiple red flags together strengthen a case; a single flag may be innocent. Documentation of your investigation process is critical for legal defensibility.',
      },
    ],
  },
  2: {
    id: 2,
    title: 'Module 2: Revenue & Receivables Fraud',
    sections: [
      {
        heading: 'Bill-and-Hold Schemes',
        content:
          'A bill-and-hold scheme occurs when a company: (1) Issues an invoice to a customer, (2) Records revenue on the income statement, (3) But DOES NOT ship the goods. Why it\'s fraud: Revenue recognition requires delivery (or at least customer acceptance). Red flags: Unusual increase in finished goods inventory, High Days Sales Outstanding (DSO), Footnotes mentioning "bill-and-hold", Revenue spike in last days of quarter.',
      },
      {
        heading: 'Side Letters',
        content:
          'Secret agreements between seller and buyer that contradict the main sales contract—e.g., allowing the buyer to return goods or delay payment. If a side letter exists, revenue may not be earned yet, so recognizing it is fraudulent. Look for: Vague delivery terms, Customer acceptance clauses, Unusual return policies, References to "separate agreements".',
      },
      {
        heading: 'Channel Stuffing',
        content:
          'Company forces distributors to buy excess inventory by offering discounts or threatening to cut off supply. Red flags: Large end-of-quarter sales, High product returns in following period, Distributor complaints.',
      },
    ],
  },
};

const ModuleViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const moduleId = id ? parseInt(id) : 0;
  const module = modules[moduleId];

  if (!module) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Module not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        {module.title}
      </Typography>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {module.sections.map((section, index) => (
            <Card key={index} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {section.heading}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {section.content}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
            <Button variant="outlined">← Previous</Button>
            <Button variant="contained" sx={{ ml: 'auto' }}>
              Next →
            </Button>
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}></Typography>