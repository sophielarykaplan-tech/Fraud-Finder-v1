import React, { useState } from "react";
import Button from '@mui/material/Button';

export default function App() {
  const [accountsReceivable, setAccountsReceivable] = useState(100000);
  const [annualRevenue, setAnnualRevenue] = useState(1000000);
  const [industry, setIndustry] = useState("Healthcare");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/calculators/dso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accounts_receivable: Number(accountsReceivable),
          annual_revenue: Number(annualRevenue),
          industry,
        }),
      });
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: String(err) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Spot the Red Flags — DSO Calculator</h1>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <label>
          Accounts receivable
          <input
            type="number"
            value={accountsReceivable}
            onChange={(e) => setAccountsReceivable(e.target.value)}
            style={{ width: "100%", marginTop: 8, marginBottom: 12 }}
          />
        </label>

        <label>
          Annual revenue
          <input
            type="number"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            style={{ width: "100%", marginTop: 8, marginBottom: 12 }}
          />
        </label>

        <label>
          Industry
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{ display: "block", marginTop: 8, marginBottom: 12 }}
          >
            <option>Healthcare</option>
            <option>Software</option>
            <option>Manufacturing</option>
            <option>Retail</option>
          </select>
        </label>

        <button type="submit" disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Calculating..." : "Calculate DSO"}
        </button>
        <div style={{ marginTop: 12 }}>
          <Button variant="contained" color="primary">Material UI Button</Button>
        </div>
      </form>

      <pre style={{ marginTop: 24, background: "#f6f8fa", padding: 12 }}>
        {result ? JSON.stringify(result, null, 2) : "Results will appear here."}
      </pre>
    </div>
  );
}
