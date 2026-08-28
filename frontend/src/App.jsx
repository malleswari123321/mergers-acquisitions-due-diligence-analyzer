import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const [agreements, setAgreements] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const reportRef = useRef();

  const fetchAgreements = async () => {
    setLoadingList(true);
    try {
      const response = await fetch('http://localhost:8000/api/documents/');
      if (response.ok) {
        const data = await response.json();
        setAgreements(data);
        if (data.length > 0 && !selectedDoc) {
          setSelectedDoc(data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch agreements:', error);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        await fetchAgreements();
        setSelectedDoc(result);
      } else {
        const errData = await response.json();
        alert(`Error: ${errData.detail || 'Failed to analyze document.'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error connecting to backend server.');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!reportRef.current || !selectedDoc) return;

    const element = reportRef.current;
    const options = {
      margin: [0.4, 0.4, 0.4, 0.4],
      filename: `Risk_Report_${selectedDoc.filename || 'Contract'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(options).from(element).save();
  };

  const analysis = selectedDoc?.risk_analysis;

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', color: '#60a5fa' }}>M&A Due Diligence Risk Analyzer</h1>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>AI Contract Intelligence</span>
        </div>
        {selectedDoc && (
          <button className="download-btn" onClick={handleDownloadPDF}>
            📄 Export Professional PDF
          </button>
        )}
      </header>

      {/* Main Grid Layout */}
      <div className="dashboard-layout">
        
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="upload-box">
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600' }}>Upload New Agreement</p>
            <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} disabled={uploading} />
            {uploading && <p style={{ color: '#38bdf8', fontSize: '12px', margin: '8px 0 0 0' }}>Analyzing with Gemini...</p>}
          </div>

          <div>
            <h4 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '13px' }}>
              Documents ({agreements.length})
            </h4>
            <div className="doc-list">
              {loadingList ? (
                <span style={{ fontSize: '12px', color: '#64748b' }}>Loading...</span>
              ) : (
                agreements.map((doc, idx) => (
                  <button
                    key={doc.id || idx}
                    onClick={() => setSelectedDoc(doc)}
                    className={`doc-item-btn ${selectedDoc?.id === doc.id ? 'active' : ''}`}
                  >
                    📄 {doc.filename || `Document ${idx + 1}`}
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Right Printable Report Area */}
        <main>
          {selectedDoc ? (
            <div ref={reportRef} className="pdf-printable-container">
              {/* Header Banner */}
              <div className="pdf-header-banner">
                <div>
                  <h1 className="pdf-header-title">M&A Due Diligence Risk Report</h1>[cite: 1]
                  <div className="pdf-doc-sub">Target Document: {selectedDoc.filename}</div>[cite: 1]
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px', color: '#64748b' }}>
                  Generated on: {new Date().toLocaleDateString()}
                </div>
              </div>

              {analysis ? (
                <div>
                  {/* Executive Summary */}
                  {analysis.executive_summary && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="pdf-section-title" style={{ color: '#2563eb' }}>Executive Summary</div>[cite: 1]
                      <div className="pdf-exec-summary">
                        {analysis.executive_summary}[cite: 1]
                      </div>
                    </div>
                  )}

                  {/* High Risk Flags */}
                  {analysis.high_risk_flags?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="pdf-section-title" style={{ color: '#dc2626' }}>
                        🚨 High Risk Red Flags ({analysis.high_risk_flags.length})[cite: 1]
                      </div>
                      {analysis.high_risk_flags.map((item, idx) => (
                        <div key={idx} className="pdf-risk-card high">
                          <div className="pdf-risk-card-title">{item.clause_title || item.type || `High Risk Clause #${idx + 1}`}</div>[cite: 1]
                          <p className="pdf-risk-card-desc">{item.description || item.text}</p>[cite: 1]
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Medium Risk Items */}
                  {analysis.medium_risk_items?.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      <div className="pdf-section-title" style={{ color: '#d97706' }}>
                        ⚠️ Medium Risk Items ({analysis.medium_risk_items.length})[cite: 1]
                      </div>
                      {analysis.medium_risk_items.map((item, idx) => (
                        <div key={idx} className="pdf-risk-card medium">
                          <div className="pdf-risk-card-title">{item.clause_title || item.type || `Medium Risk Clause #${idx + 1}`}</div>[cite: 1]
                          <p className="pdf-risk-card-desc">{item.description || item.text}</p>[cite: 1]
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Low Risk Clauses */}
                  {analysis.low_risk_clauses?.length > 0 && (
                    <div>
                      <div className="pdf-section-title" style={{ color: '#16a34a' }}>
                        ✅ Standard / Low Risk Clauses ({analysis.low_risk_clauses.length})[cite: 1]
                      </div>
                      {analysis.low_risk_clauses.map((item, idx) => (
                        <div key={idx} className="pdf-risk-card low">
                          <div className="pdf-risk-card-title">{item.clause_title || item.type || `Low Risk Clause #${idx + 1}`}</div>[cite: 1]
                          <p className="pdf-risk-card-desc">{item.description || item.text}</p>[cite: 1]
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: '#64748b' }}>No risk analysis found for this document.</p>
              )}
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              Select a document from the sidebar to view the risk report.
            </div>
          )}
        </main>

      </div>
    </div>
  );
}

export default App;