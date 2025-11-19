import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, TextField, Button, Alert, Divider, Table, TableBody, TableCell, TableHead, TableRow, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

type StatementData = Record<string, number>;

const triggerTerms = ["bill-and-hold","guarantee","variable interest","adjusted","side letter","restatement"];

const simpleNLP = (text: string) => {
  const found: string[] = [];
  if (!text) return found;
  const lower = text.toLowerCase();
  triggerTerms.forEach((t) => { if (lower.includes(t)) found.push(t); });
  return found;
};

const computeDSO = (ar: number, revenue: number) => {
  if (!ar || !revenue) return null;
  return ar / (revenue / 365);
};

const computeDebtToEquity = (totalDebt?: number, totalEquity?: number) => {
  if (!totalDebt || !totalEquity) return null;
  return totalDebt / totalEquity;
};

const computeInventoryTurnover = (cogs?: number, inventory?: number) => {
  if (!cogs || !inventory) return null;
  return cogs / inventory;
};

const computeCashToIncome = (opCash?: number, netIncome?: number) => {
  if (netIncome === undefined || netIncome === 0 || opCash === undefined) return null;
  return Math.abs(opCash) / (Math.abs(netIncome) || 1);
};

const mapHeaders = (headers: string[]) => {
  // normalize header names to common keys
  const map: Record<string,string[]> = {
    'Accounts Receivable': ['accounts receivable','ar','accounts_receivable'],
    'Revenue': ['revenue','sales','total revenue'],
    'Net Income': ['net income','netprofit','profit'],
    'Net cash from operating activities': ['net cash from operating activities','cash from operations','operating cash flow','net cash from ops'],
    'Inventory': ['inventory','inventories'],
    'COGS': ['cogs','cost of goods sold','cost of sales'],
    'Total Assets': ['total assets','assets'],
    'Total Liabilities': ['total liabilities','liabilities'],
    'Total Equity': ['total equity','equity'],
    'Short Term Debt': ['short-term debt','current debt'],
  };

  const normalized: Record<string,string|null> = {};
  headers.forEach(h => {
    const low = h.toLowerCase().trim();
    Object.entries(map).forEach(([key, variants]) => {
      if (variants.some(v => low === v || low.includes(v))) normalized[key] = h;
    });
  });
  return normalized;
};

const FinancialReviewTool: React.FC = () => {
  const [balanceSheet, setBalanceSheet] = useState<StatementData | null>(null);
  const [incomeStatement, setIncomeStatement] = useState<StatementData | null>(null);
  const [cashFlow, setCashFlow] = useState<StatementData | null>(null);
  const [footnotes, setFootnotes] = useState('');
  const [indicators, setIndicators] = useState<any[]>([]);
  const [parsedTable, setParsedTable] = useState<any[] | null>(null);
  const [headersMap, setHeadersMap] = useState<Record<string,string|null> | null>(null);
  const [columnMap, setColumnMap] = useState<Record<string,string|null> | null>(null);
  const [mappingMode, setMappingMode] = useState<'single' | 'sum'>('single');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);
  const [sumStartRow, setSumStartRow] = useState<number | null>(null);
  const [sumEndRow, setSumEndRow] = useState<number | null>(null);
  const [workbook, setWorkbook] = useState<any | null>(null);
  const [sheetNames, setSheetNames] = useState<string[] | null>(null);
  const [selectedSheetName, setSelectedSheetName] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (!text) return;
      if (name.endsWith('.csv')) {
        const res = Papa.parse(String(text), { header: true, dynamicTyping: true });
        if (res && res.data) {
          const rows = res.data as any[];
          setParsedTable(rows);
          const headers = res.meta.fields || Object.keys(rows[0] || {});
          const mapping = mapHeaders(headers as string[]);
          setHeadersMap(mapping);
        }
      } else if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
        const wb = XLSX.read(String(text), { type: 'binary' });
        setWorkbook(wb);
        setSheetNames(wb.SheetNames || []);
        const firstName = wb.SheetNames && wb.SheetNames[0];
        setSelectedSheetName(firstName || null);
        const sheet = wb.Sheets[firstName];
        const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });
        setParsedTable(rows as any[]);
        const headers = rows.length ? Object.keys(rows[0]) : [];
        setHeadersMap(mapHeaders(headers));
      } else {
        // try CSV parse fallback
        const res = Papa.parse(String(text), { header: true, dynamicTyping: true });
        setParsedTable(res.data as any[]);
        const headers = res.meta.fields || Object.keys((res.data as any[])[0] || {});
        setHeadersMap(mapHeaders(headers as string[]));
      }
    };
    if (name.endsWith('.xls') || name.endsWith('.xlsx')) {
      // read as binary
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const handleSheetChange = (sheetName: string | null) => {
    setSelectedSheetName(sheetName);
    if (!workbook || !sheetName) return;
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { raw: true });
    setParsedTable(rows as any[]);
    const headers = rows.length ? Object.keys(rows[0]) : [];
    setHeadersMap(mapHeaders(headers));
    // reset selection state
    setSelectedRowIndex(0);
    setSumStartRow(null);
    setSumEndRow(null);
  };

  const runChecks = () => {
    const inds: any[] = [];

    const ar = balanceSheet?.['Accounts Receivable'] || balanceSheet?.['AR'];
    const revenue = incomeStatement?.['Revenue'] || incomeStatement?.['Sales'];
    const netIncome = incomeStatement?.['Net Income'];
    const opCash = cashFlow?.['Net cash from operating activities'];
    const inventory = balanceSheet?.['Inventory'];
    const cogs = incomeStatement?.['COGS'];
    const totalDebt = (balanceSheet?.['Short Term Debt'] || 0) + (balanceSheet?.['Long Term Debt'] || 0) || undefined;
    const totalEquity = balanceSheet?.['Total Equity'];

    if (ar && revenue) {
      const dso = computeDSO(ar, revenue);
      if (dso) {
        const industryAvg = 45;
        const diff = (dso - industryAvg) / industryAvg;
        const risk = diff > 0.2 ? 'High' : diff > 0.08 ? 'Medium' : 'Low';
        inds.push({ area: 'Receivables', metric: 'DSO', value: dso, industryAvg, risk, explanation: `DSO ${dso.toFixed(1)} days vs industry ${industryAvg}.` });
      }
    }

    const cashToIncome = computeCashToIncome(opCash, netIncome);
    if (cashToIncome !== null) {
      const risk = cashToIncome < 0.5 ? 'High' : cashToIncome < 0.9 ? 'Medium' : 'Low';
      inds.push({ area: 'Cash Flow Quality', metric: 'Cash/Income', value: cashToIncome, risk, explanation: `Operating cash to net income = ${cashToIncome.toFixed(2)}.` });
    }

    const invTurn = computeInventoryTurnover(cogs, inventory);
    if (invTurn !== null) {
      inds.push({ area: 'Inventory', metric: 'Inventory Turnover', value: invTurn, explanation: `Inventory turns = ${invTurn.toFixed(2)}.` });
    }

    const dte = computeDebtToEquity(totalDebt, totalEquity);
    if (dte !== null) {
      inds.push({ area: 'Leverage', metric: 'Debt/Equity', value: dte, explanation: `Debt-to-equity = ${dte.toFixed(2)}.` });
    }

    const matches = simpleNLP(footnotes || '');
    if (matches.length) inds.push({ area: 'Footnotes', metric: 'Trigger Terms', value: matches, risk: 'Medium', explanation: `Found: ${matches.join(', ')}` });

    setIndicators(inds);
  };

  const autoMapFromParsed = () => {
    if (!parsedTable || !headersMap) return;
    // try to populate statements from first row if header mapping exists
    const row = parsedTable[0];
    const mappedBalance: StatementData = {};
    const mappedIncome: StatementData = {};
    const mappedCash: StatementData = {};
    Object.entries(headersMap).forEach(([key, header]) => {
      if (!header) return;
      const val = row[header];
      if (val === undefined || val === null) return;
      switch (key) {
        case 'Accounts Receivable': mappedBalance['Accounts Receivable'] = Number(val); break;
        case 'Inventory': mappedBalance['Inventory'] = Number(val); break;
        case 'Total Assets': mappedBalance['Total Assets'] = Number(val); break;
        case 'Total Liabilities': mappedBalance['Total Liabilities'] = Number(val); break;
        case 'Total Equity': mappedBalance['Total Equity'] = Number(val); break;
        case 'Revenue': mappedIncome['Revenue'] = Number(val); break;
        case 'Net Income': mappedIncome['Net Income'] = Number(val); break;
        case 'COGS': mappedIncome['COGS'] = Number(val); break;
        case 'Net cash from operating activities': mappedCash['Net cash from operating activities'] = Number(val); break;
        default: break;
      }
    });
    setBalanceSheet(Object.keys(mappedBalance).length ? mappedBalance : null);
    setIncomeStatement(Object.keys(mappedIncome).length ? mappedIncome : null);
    setCashFlow(Object.keys(mappedCash).length ? mappedCash : null);
  };

  const applyManualMapping = () => {
    if (!parsedTable || !columnMap) return;
    const row = parsedTable[selectedRowIndex] || parsedTable[0];
    const mappedBalance: StatementData = {};
    const mappedIncome: StatementData = {};
    const mappedCash: StatementData = {};
    Object.entries(columnMap).forEach(([canonical, header]) => {
      if (!header) return;
      let val: any = undefined;
      if (mappingMode === 'single') {
        val = row[header];
      } else {
        // sum mode: sum numeric values across selected range (inclusive)
        if (sumStartRow === null || sumEndRow === null) return;
        const start = Math.max(0, Math.min(sumStartRow, sumEndRow));
        const end = Math.min(parsedTable.length - 1, Math.max(sumStartRow, sumEndRow));
        let s = 0;
        let found = false;
        for (let i = start; i <= end; i++) {
          const v = parsedTable[i][header];
          const n = Number(v);
          if (!Number.isFinite(n)) continue;
          s += n;
          found = true;
        }
        if (found) val = s;
      }
      if (val === undefined || val === null) return;
      switch (canonical) {
        case 'Accounts Receivable': mappedBalance['Accounts Receivable'] = Number(val); break;
        case 'Inventory': mappedBalance['Inventory'] = Number(val); break;
        case 'Total Assets': mappedBalance['Total Assets'] = Number(val); break;
        case 'Total Liabilities': mappedBalance['Total Liabilities'] = Number(val); break;
        case 'Total Equity': mappedBalance['Total Equity'] = Number(val); break;
        case 'Revenue': mappedIncome['Revenue'] = Number(val); break;
        case 'Net Income': mappedIncome['Net Income'] = Number(val); break;
        case 'COGS': mappedIncome['COGS'] = Number(val); break;
        case 'Net cash from operating activities': mappedCash['Net cash from operating activities'] = Number(val); break;
        case 'Short Term Debt': mappedBalance['Short Term Debt'] = Number(val); break;
        case 'Long Term Debt': mappedBalance['Long Term Debt'] = Number(val); break;
        default: break;
      }
    });
    setBalanceSheet(Object.keys(mappedBalance).length ? mappedBalance : null);
    setIncomeStatement(Object.keys(mappedIncome).length ? mappedIncome : null);
    setCashFlow(Object.keys(mappedCash).length ? mappedCash : null);
  };

  const mappingPreview = useMemo(() => {
    if (!parsedTable || !columnMap) return null;
    const preview: Record<string, number | null> = {};
    Object.entries(columnMap).forEach(([canonical, header]) => {
      if (!header) {
        preview[canonical] = null;
        return;
      }
      if (mappingMode === 'single') {
        const row = parsedTable[selectedRowIndex] || parsedTable[0];
        const v = row ? row[header] : undefined;
        const n = Number(v);
        preview[canonical] = Number.isFinite(n) ? n : null;
      } else {
        if (sumStartRow === null || sumEndRow === null) {
          preview[canonical] = null;
          return;
        }
        const start = Math.max(0, Math.min(sumStartRow, sumEndRow));
        const end = Math.min(parsedTable.length - 1, Math.max(sumStartRow, sumEndRow));
        let s = 0;
        let found = false;
        for (let i = start; i <= end; i++) {
          const v = parsedTable[i][header];
          const n = Number(v);
          if (!Number.isFinite(n)) continue;
          s += n;
          found = true;
        }
        preview[canonical] = found ? s : null;
      }
    });
    return preview;
  }, [parsedTable, columnMap, mappingMode, selectedRowIndex, sumStartRow, sumEndRow]);

  const isApplyDisabled = useMemo(() => {
    if (!columnMap) return true;
    const mappedKeys = Object.keys(columnMap);
    if (mappedKeys.length === 0) return true;
    if (mappingMode === 'single') {
      if (!parsedTable || selectedRowIndex < 0 || selectedRowIndex >= parsedTable.length) return true;
      // ensure at least one mapped column yields a value
      return !mappedKeys.some(k => mappingPreview && mappingPreview[k] != null);
    }
    // sum mode
    if (sumStartRow === null || sumEndRow === null) return true;
    if (!parsedTable) return true;
    const start = Math.max(0, Math.min(sumStartRow, sumEndRow));
    const end = Math.min(parsedTable.length - 1, Math.max(sumStartRow, sumEndRow));
    if (start > end) return true;
    return !mappedKeys.some(k => mappingPreview && mappingPreview[k] != null);
  }, [columnMap, mappingMode, selectedRowIndex, sumStartRow, sumEndRow, parsedTable, mappingPreview]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>AI-Assisted Financial Review (prototype)</Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Indicators are for further investigation only — consider discussing with a supervisor. No client data is used to train models.
      </Alert>

      <Box sx={{ mb: 2 }}>
        <input type="file" accept=".csv,.xls,.xlsx,.txt" onChange={(e)=>handleFile(e.target.files?.[0] ?? null)} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField label="Footnotes / Notes (paste text)" fullWidth multiline minRows={3}
          value={footnotes}
          onChange={(e)=>setFootnotes(e.target.value)}
          placeholder='Paste footnote text here' />
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <Button variant="contained" onClick={runChecks}>Run Quick Checks</Button>
        <Button variant="outlined" onClick={()=>{ setBalanceSheet(null); setIncomeStatement(null); setCashFlow(null); setParsedTable(null); setIndicators([]); setFootnotes(''); }}>Clear</Button>
        <Button variant="text" onClick={autoMapFromParsed} disabled={!parsedTable || !headersMap}>Auto-map from parsed table</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {parsedTable && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Parsed table preview (first 10 rows)</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                {Object.keys(parsedTable[0] || {}).map((h) => <TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {parsedTable.slice(0,10).map((r, i) => {
                const isSelected = mappingMode === 'single' && i === selectedRowIndex;
                const inRange = mappingMode === 'sum' && sumStartRow !== null && sumEndRow !== null && i >= Math.min(sumStartRow, sumEndRow) && i <= Math.max(sumStartRow, sumEndRow);
                return (
                  <TableRow key={i}
                    onClick={() => {
                      if (mappingMode === 'single') setSelectedRowIndex(i);
                      else {
                        // toggle filling start/end
                        if (sumStartRow === null) setSumStartRow(i);
                        else if (sumEndRow === null) setSumEndRow(i);
                        else { setSumStartRow(i); setSumEndRow(null); }
                      }
                    }}
                    sx={{ cursor: 'pointer', bgcolor: isSelected ? '#e8f0fe' : inRange ? '#f3f7f0' : undefined }}
                  >
                    {Object.values(r).map((v, j)=>(<TableCell key={j}>{String(v ?? '')}</TableCell>))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}

      {sheetNames && sheetNames.length > 1 && (
        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Sheet</InputLabel>
            <Select value={selectedSheetName || ''} label="Sheet" onChange={(e)=>handleSheetChange(e.target.value || null)}>
              {sheetNames.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
            </Select>
          </FormControl>
        </Box>
      )}

      {parsedTable && (
        <Box sx={{ mb: 2, p: 2, border: '1px dashed #ddd', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Manual Column Mapping (choose which parsed column maps to each canonical field)</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Box sx={{ gridColumn: '1 / -1', mb: 1 }}>
              <FormControl size="small" sx={{ mr: 1, minWidth: 140 }}>
                <InputLabel>Mapping Mode</InputLabel>
                <Select value={mappingMode} label="Mapping Mode" onChange={(e)=>setMappingMode(e.target.value as any)}>
                  <MenuItem value="single">Single row</MenuItem>
                  <MenuItem value="sum">Sum range</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ mr: 1, minWidth: 140 }}>
                <InputLabel>Row</InputLabel>
                <Select value={selectedRowIndex} label="Row" onChange={(e)=>setSelectedRowIndex(Number(e.target.value))}>
                  {parsedTable.map((_, i) => (<MenuItem key={i} value={i}>Row {i + 1}</MenuItem>))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }} error={mappingMode === 'sum' && sumStartRow !== null && sumEndRow !== null && Math.min(sumStartRow, sumEndRow) > Math.max(sumStartRow, sumEndRow)}>
                <InputLabel>Sum Start</InputLabel>
                <Select value={sumStartRow ?? ''} label="Sum Start" onChange={(e)=>setSumStartRow(e.target.value === '' ? null : Number(e.target.value))}>
                  <MenuItem value="">—</MenuItem>
                  {parsedTable.map((_, i) => (<MenuItem key={i} value={i}>Row {i + 1}</MenuItem>))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ ml: 1, minWidth: 120 }}>
                <InputLabel>Sum End</InputLabel>
                <Select value={sumEndRow ?? ''} label="Sum End" onChange={(e)=>setSumEndRow(e.target.value === '' ? null : Number(e.target.value))}>
                  <MenuItem value="">—</MenuItem>
                  {parsedTable.map((_, i) => (<MenuItem key={i} value={i}>Row {i + 1}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
            {[
              'Accounts Receivable','Revenue','Net Income','Net cash from operating activities','Inventory','COGS','Total Assets','Total Liabilities','Total Equity','Short Term Debt','Long Term Debt'
            ].map((canonical) => (
              <FormControl size="small" fullWidth key={canonical} error={!!(columnMap && columnMap[canonical] && mappingPreview && mappingPreview[canonical] == null)}>
                <InputLabel>{canonical}</InputLabel>
                <Select
                  value={(columnMap && columnMap[canonical]) || ''}
                  label={canonical}
                  onChange={(e) => setColumnMap((prev) => ({ ...(prev || {}), [canonical]: e.target.value || null }))}
                >
                  <MenuItem value="">— none —</MenuItem>
                  {Object.keys(parsedTable[0] || {}).map((h) => (
                    <MenuItem key={h} value={h}>{h}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="contained" onClick={applyManualMapping} disabled={isApplyDisabled}>Apply mapping</Button>
            <Button variant="outlined" onClick={()=>setColumnMap(null)}>Clear mapping</Button>
          </Box>
          {mappingPreview && (
            <Box sx={{ mt: 2, p: 1, bgcolor: '#fafafa', borderRadius: 1, border: '1px solid #eee' }}>
              <Typography variant="subtitle2">Preview of mapped totals</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {Object.entries(mappingPreview).map(([k, v]) => (
                  <Box key={k} sx={{ minWidth: 160, p: 1, borderRadius: 1, bgcolor: '#fff', border: '1px solid #f0f0f0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{k}</Typography>
                    <Typography variant="body2">{v == null ? 'n/a' : String(v)}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {indicators.length === 0 && <Typography>No indicators found yet. Upload a CSV/Excel or paste numbers.</Typography>}

      {indicators.map((ind, i)=> (
        <Box key={i} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{ind.area} — {ind.metric} {ind.risk ? `— ${ind.risk} risk` : ''}</Typography>
          <Typography variant="body2" color="text.secondary">{ind.explanation}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Actionable next step:</Typography>
            <Typography variant="body2">{ind.area === 'Receivables' ? 'Request AR aging and customer confirmations.' : 'Request supporting documents and reconciliations.'}</Typography>
          </Box>
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption">Privacy: All data stays in the browser by default. Do not paste PII unless permitted.</Typography>
      </Box>
    </Container>
  );
};

export default FinancialReviewTool;
