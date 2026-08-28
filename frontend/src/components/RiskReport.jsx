import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';

const RiskReport = ({ selectedDoc }) => {
  const reportRef = useRef();

  if (!selectedDoc) return null;
  const analysis = selectedDoc.risk_analysis;

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const options = {
      margin: [0.3, 0.3, 0.3, 0.3],
      filename: `M&A_Risk_Report_${selectedDoc.filename || 'Contract'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Export Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#f8fafc' }}>Detailed Analysis View</h3>
        <button
          onClick={handleDownloadPDF}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          📄 Export PDF Report
        </button>
      </div>

      {/* Structured Formatted Area */}
      <div 
        ref={reportRef} 
        style={{
          backgroundColor: '#0f172a',
          color: '#e2e8f0',
          padding: '24px',
          borderRadius: '10px',
          border: '1px solid #1e293b',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Document Header */}
        <div style={{ borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '20px' }}>
          <h2 style={{ color: '#38bdf8', margin: '0 0 4px 0', fontSize: '20px' }}>
            {selectedDoc.filename}
          </h2>
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>
            Document ID: #{selectedDoc.id} | Status: Analysis Complete
          </span>
        </div>

        {analysis ? (
          <div>
            {/* Executive Summary */}
            {analysis.executive_summary && (
              <div style={{ backgroundColor: '#1e293b', padding: '16px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #38bdf8' }}>
                <h4 style={{ color: '#38bdf8', marginTop: 0, marginBottom: '8px', fontSize: '15px' }}>Executive Summary</h4>
                <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.6', fontSize: '13.5px' }}>
                  {analysis.executive_summary}
                </p>
              </div>
            )}

            {/* High Risk Red Flags */}
            {analysis.high_risk_flags?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#f87171', marginBottom: '12px', fontSize: '15px' }}>
                  🚨 High Risk Red Flags ({analysis.high_risk_flags.length})
                </h4>
                {analysis.high_risk_flags.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      breakInside: 'avoid',
                      backgroundColor: 'rgba(127, 29, 29, 0.25)', 
                      border: '1px solid #991b1b', 
                      padding: '14px', 
                      borderRadius: '8px', 
                      marginBottom: '10px' 
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#fca5a5', fontSize: '14px' }}>
                      {item.clause_title || item.type || `High Risk #${index + 1}`}
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                      {item.description || item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Medium Risk Items */}
            {analysis.medium_risk_items?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ color: '#facc15', marginBottom: '12px', fontSize: '15px' }}>
                  ⚠️ Medium Risk Items ({analysis.medium_risk_items.length})
                </h4>
                {analysis.medium_risk_items.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      breakInside: 'avoid',
                      backgroundColor: 'rgba(113, 63, 18, 0.25)', 
                      border: '1px solid #854d0e', 
                      padding: '14px', 
                      borderRadius: '8px', 
                      marginBottom: '10px' 
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#fde047', fontSize: '14px' }}>
                      {item.clause_title || item.type || `Medium Risk #${index + 1}`}
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                      {item.description || item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Standard / Low Risk Clauses */}
            {analysis.low_risk_clauses?.length > 0 && (
              <div>
                <h4 style={{ color: '#4ade80', marginBottom: '12px', fontSize: '15px' }}>
                  ✅ Standard / Low Risk Clauses ({analysis.low_risk_clauses.length})
                </h4>
                {analysis.low_risk_clauses.map((item, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      breakInside: 'avoid',
                      backgroundColor: 'rgba(20, 83, 45, 0.25)', 
                      border: '1px solid #166534', 
                      padding: '14px', 
                      borderRadius: '8px', 
                      marginBottom: '10px' 
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#86efac', fontSize: '14px' }}>
                      {item.clause_title || item.type || `Low Risk #${index + 1}`}
                    </div>
                    <p style={{ margin: '6px 0 0 0', color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                      {item.description || item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>Loading risk breakdown...</p>
        )}
      </div>
    </div>
  );
};

export default RiskReport;