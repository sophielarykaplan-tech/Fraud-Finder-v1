Maintainer notes (one-line facts / commands)

- `frontend` — Node-based frontend (repository `.gitignore` references `frontend/node_modules/` and `frontend/.env.local`); check `frontend/package.json` for exact scripts. Common local steps: `cd frontend && npm install` then run the project's dev script (e.g. `npm run dev`).
- `backend` — Python backend (repository `.gitignore` references `backend/venv/` and `backend/.env`); common local steps: `cd backend && python -m venv .venv && .venv/bin/pip install -r requirements.txt`. Check for an entrypoint (e.g. `app.py`, `manage.py`, or `src/`) for exact run command.
- `database` — folder for database artifacts; `.gitignore` contains `*.db` so local DB files (SQLite) are expected and should not be committed.
- `docs` — documentation site / markdown; check this folder for contributing notes or design docs.
- Repo init & .gitignore — initial setup used `git init`, `git add .gitignore`, `git commit -m "Initial setup"`. The `.gitignore` shows local env files are ignored for both frontend (`.env.local`) and backend (`.env`).
- Env vars — backend and frontend use environment files (`backend/.env`, `frontend/.env.local`); do not commit secrets; add `.env.example` if sharing required keys.

Notes for maintainers:
- Add OWNER contact lines for each top-level folder (e.g. `frontend — OWNER: team@example.com`).
- Populate exact canonical commands after confirming `package.json` / `requirements.txt` / entrypoints exist.
- Consider adding short deploy notes or CI commands into `.github/copilot-instructions.md` so agents can pick up exact scripts automatically.

Scan results (auto-check):
- I searched the repository for `package.json`, `requirements.txt`, `pyproject.toml`, and common Python entrypoints (`app.py`, `manage.py`, `uvicorn` references) and found none.
- Because no manifest files or entrypoints were found, I could not auto-populate exact `npm`/`pip` install or run commands.

Recommended next steps for maintainers (one-liners):
- Add `frontend/package.json` with `scripts` (e.g. `dev`, `build`, `test`) so agents can document exact commands.
- Add `backend/requirements.txt` or `backend/pyproject.toml` and an entrypoint script (e.g. `backend/app.py` or `backend/manage.py`) with a short README describing how to run the service.
- If using SQLite locally, add `backend/.env.example` listing `DATABASE_URL` or other required env vars.

Exact commands (added):

- `backend` — Python 3.8+ recommended.
	- Create venv: `python3 -m venv backend/.venv`
	- Activate venv: `source backend/.venv/bin/activate`
	- Install deps: `pip install -r backend/requirements.txt`
	- Run dev server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000` (run from `backend/`)

- `frontend` — minimal placeholder `package.json` created. To run once the frontend is implemented:
	- `cd frontend && npm install`
	- `npm run dev` (or the framework's dev script)

API example (curl):

POST /api/calculators/dso with JSON body (example):

```bash
curl -sS -X POST http://localhost:8000/api/calculators/dso \
	-H "Content-Type: application/json" \
	-d '{"accounts_receivable":100000, "annual_revenue":1000000, "industry":"Healthcare"}' | jq
```

This returns JSON with `dso`, `industry_avg`, `risk_level`, `interpretation`, and `next_steps`.


