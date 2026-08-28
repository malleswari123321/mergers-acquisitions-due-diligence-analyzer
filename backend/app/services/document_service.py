import os
import io
import json
import re
from pypdf import PdfReader
import docx
from google import genai
from dotenv import load_dotenv

# Force load .env file from root
load_dotenv()

# Get API key from environment
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class DocumentService:

    @staticmethod
    def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
        extracted_text = ""
        filename_lower = filename.lower()

        try:
            if filename_lower.endswith(".pdf"):
                pdf_file = io.BytesIO(file_bytes)
                reader = PdfReader(pdf_file)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_text += text + "\n"

            elif filename_lower.endswith((".docx", ".doc")):
                docx_file = io.BytesIO(file_bytes)
                doc = docx.Document(docx_file)
                for para in doc.paragraphs:
                    if para.text:
                        extracted_text += para.text + "\n"

        except Exception as e:
            print(f"Text Extraction Error: {str(e)}")
            return ""

        return extracted_text.strip()

    @staticmethod
    def analyze_ma_contract(contract_text: str) -> dict:
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set in environment variables.")

        # Initialize official GenAI client with key
        client = genai.Client(api_key=GEMINI_API_KEY)

        prompt = f"""
        You are an expert M&A legal due diligence advisor. Analyze the following legal contract text 
        and provide a comprehensive risk breakdown.

        Respond ONLY in valid JSON format with the exact keys specified below. Do not include markdown codeblocks.

        Required JSON Structure:
        {{
          "executive_summary": "High-level summary highlighting overall deal risk and key findings.",
          "high_risk_flags": [
            {{
              "clause_title": "Clause Name",
              "type": "Risk Category",
              "description": "Explanation of severe risk."
            }}
          ],
          "medium_risk_items": [
            {{
              "clause_title": "Clause Name",
              "type": "Risk Category",
              "description": "Explanation of moderate risk."
            }}
          ],
          "low_risk_clauses": [
            {{
              "clause_title": "Clause Name",
              "type": "Standard Clause",
              "description": "Low impact standard clause."
            }}
          ]
        }}

        Contract Text:
        {contract_text[:30000]}
        """

        try:
            # Call modern model using google-genai SDK
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )

            raw_response = response.text.strip()
            cleaned_json = re.sub(r"^```json\s*|\s*```$", "", raw_response, flags=re.MULTILINE).strip()
            return json.loads(cleaned_json)

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise e