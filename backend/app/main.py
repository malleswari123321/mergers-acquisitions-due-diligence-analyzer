import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, documents

load_dotenv()

app = FastAPI(
    title="M&A Due Diligence Analyzer",
    description="AI-powered document analysis platform for M&A due diligence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route inclusion without duplication
app.include_router(auth.router)
app.include_router(documents.router)

@app.get("/", tags=["default"])
def read_root():
    return {"message": "M&A Due Diligence Analyzer Backend Live"}

@app.get("/health", tags=["default"])
def health_check():
    return {"status": "healthy"}