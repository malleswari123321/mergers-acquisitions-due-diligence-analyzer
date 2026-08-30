# M&A Due Diligence Risk Analyzer

**AI-powered contract intelligence for mergers & acquisitions due diligence.**

Upload legal agreements, get an instant, structured risk report with clause-level red flags, severity scoring, and an executive summary — powered by LLM-based document analysis.

![Risk Report View](screenshots/risk-report-view.png)

---

## Why this exists

In M&A deals, legal and deal-advisory teams have to manually review hundreds of contracts to catch risky clauses before a deal closes. Done by hand, this takes days to weeks per deal. This tool automates first-pass review: upload agreements, and the system extracts key clauses, flags risk severity with reasoning, and produces a report in minutes instead of hours.

---

## Features

- Bulk document upload (PDF and DOCX contracts)
- AI-powered clause extraction (change-of-control, termination, indemnification, non-assignment, liability caps)
- Risk classification: every clause scored High / Medium / Low with reasoning and article citation
- Executive summary generation for overall deal risk
- Professional PDF export of the full report
- Document library with searchable sidebar

---

## Tech Stack

Frontend: React, JavaScript (Vite)
Backend: Python, FastAPI
AI/LLM: Google Gemini API
Database: SQLite
Auth: JWT-based
Document Parsing: PyMuPDF, python-docx

---

## How It Works

1. Upload a contract through the web interface
2. Backend extracts text from the document
3. Text sent to Gemini API with a structured prompt for clause-level risk analysis
4. AI response parsed into structured risk data and stored
5. Frontend renders a formatted risk report
6. Report can be exported as a professional PDF

---

## Running Locally

Backend:
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend:
cd frontend
npm install
npm run dev

---

## Author

Malleswari D — GitHub: https://github.com/malleswari123321
