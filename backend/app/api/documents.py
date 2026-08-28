from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.document import Document
from app.services.document_service import DocumentService

# Fix 1: Prefix-a '/api/documents'-nu maathi 404 error-a solve panna
router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.post("/upload")
async def upload_and_analyze(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not (file.filename.endswith(".pdf") or file.filename.endswith(".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files supported.")

    contents = await file.read()
    extracted_text = DocumentService.extract_text_from_file(contents, file.filename)
    
    if not extracted_text:
        raise HTTPException(status_code=400, detail="Failed to extract text from document.")

    # Run Gemini AI Contract Analysis
    analysis = DocumentService.analyze_ma_contract(extracted_text)

    doc_entry = Document(
        filename=file.filename,
        extracted_text=extracted_text,
        risk_analysis=analysis
    )
    db.add(doc_entry)
    db.commit()
    db.refresh(doc_entry)

    # Fix 3: Direct-a JSON frontend payload Format-a return panna
    return {
        "id": doc_entry.id,
        "filename": doc_entry.filename,
        "risk_analysis": doc_entry.risk_analysis
    }

@router.get("/")
def get_all_documents(db: Session = Depends(get_db)):
    """Fetch all analyzed documents from PostgreSQL database."""
    documents = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    return [
        {
            "id": doc.id,
            "filename": doc.filename,
            "uploaded_at": doc.uploaded_at,
            "risk_analysis": doc.risk_analysis
        }
        for doc in documents
    ]

@router.get("/{document_id}")
def get_document_by_id(document_id: int, db: Session = Depends(get_db)):
    """Fetch a specific document analysis report by ID."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return {
        "id": doc.id,
        "filename": doc.filename,
        "uploaded_at": doc.uploaded_at,
        "risk_analysis": doc.risk_analysis
    }