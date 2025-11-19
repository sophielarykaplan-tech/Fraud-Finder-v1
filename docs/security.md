Security, Privacy & Accessibility Guidelines — Spot the Red Flags

Privacy
- Data stays local by default: prefer in-browser processing and avoid server uploads.
- When uploads are required, encrypt in transit (HTTPS) and at rest (AES-256 or equivalent).
- Do not train models on client data. Explicitly state: "No client data is used to train models."
- Provide a clear data retention policy and controls to delete uploaded data.

Authentication & Access
- Use role-based access: learner, reviewer, admin.
- Logs: store access logs for audits, redact PII.

Model & AI Safety
- All automated flags must show a prominent disclaimer: "Indicators for further investigation only — consult a supervisor." Put the disclaimer before any output and inside the report.
- Surface evidence (line items, deltas) that support each automated flag.

Encryption
- TLS for all endpoints.
- Encrypt files at rest on the server; prefer ephemeral storage for uploads used only for on-demand analysis.

Compliance & Legal
- Keep templates and checklists copyable but avoid storing sensitive client PII without consent.
- Provide exportable reports with the disclaimer and a short explanation of limitations.

Accessibility
- Use clear headings, short sentences, and readable fonts.
- Provide copyable checklists and templates.
- Ensure color contrast; do not rely on color alone to signal risk.

Developer Notes
- Provide a "privacy-first" default: process in-browser or transient server processing.
- Keep an audit trail of what checks were run and which documents were requested.
