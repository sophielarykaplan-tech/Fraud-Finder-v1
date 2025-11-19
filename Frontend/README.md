# Fraud-Finder-v1
Frontend (Vite + React) — minimal scaffold

Commands (from repo root):

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default and calls the backend at `http://localhost:8000`.

Notes:

- The project root folder is `Frontend` (case-sensitive). The app's HTML entry is `Frontend/index.html`.
- If Vite warns about entry point detection, ensure `index.html` exists at the project root.
- To check and fix package vulnerabilities:

```bash
cd Frontend
npm audit
npm audit fix
# if necessary (may apply breaking changes):
npm audit fix --force
```

If you change the dev port, update `Frontend/package.json` scripts or run `npm run dev -- --port <PORT>`.
