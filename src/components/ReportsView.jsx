import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';

// Sample reports data
const sampleReports = [
  { id: 1, name: 'Monthly Shipments', type: 'CSV', date: '2024-05-01', status: 'Ready' },
  { id: 2, name: 'Supplier Performance', type: 'PDF', date: '2024-04-28', status: 'Ready' },
  { id: 3, name: 'Quality Metrics', type: 'CSV', date: '2024-04-20', status: 'Ready' },
];

export default function ReportsView() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Simulate async data fetch
    const timer = setTimeout(() => {
      // Uncomment to simulate error:
      // setError('Failed to load reports.'); setLoading(false); return;
      setReports(sampleReports);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setReports([
        { id: Date.now(), name: 'New Report', type: 'CSV', date: new Date().toISOString().slice(0, 10), status: 'Ready' },
        ...reports
      ]);
      setGenerating(false);
    }, 1200);
  };

  const handleDownload = (report) => {
    // TODO: Implement real download logic
    alert(`Downloading report: ${report.name}`);
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }} aria-label="Reports Dashboard">
      <div className="supplydna-card nft-tech code-font" style={{ minWidth: 320, marginBottom: 24 }}>
        <div className="supplydna-card-title code-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaFileAlt /> Reports
        </div>
        <p style={{ color: '#7F8C8D', marginBottom: 0 }}>Generate, download, and review supply chain reports here.</p>
      </div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="lookup-btn code-font"
          style={{ minWidth: 160, display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={handleGenerate}
          disabled={generating}
          aria-busy={generating}
        >
          {generating ? <FaSyncAlt className="spinner" style={{ fontSize: 18 }} /> : <FaFileAlt />}
          {generating ? 'Generating...' : 'Generate Report'}
        </button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
          <div className="spinner" aria-label="Loading reports" />
        </div>
      ) : error ? (
        <div style={{ color: '#E74C3C', display: 'flex', alignItems: 'center', gap: 8, minHeight: 120 }}>
          <FaExclamationTriangle style={{ fontSize: '1.5em' }} />
          <span>{error}</span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="supplydna-recent-table" style={{ width: '100%', minWidth: 420, background: '#fff', borderRadius: 8 }} aria-label="Reports Table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>{report.name}</td>
                  <td>{report.type}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className="status-badge" style={{ color: report.status === 'Ready' ? '#2ECC71' : '#F39C12' }}>{report.status}</span>
                  </td>
                  <td>
                    <button
                      className="lookup-btn"
                      style={{ padding: '4px 12px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
                      onClick={() => handleDownload(report)}
                      aria-label={`Download ${report.name}`}
                    >
                      <FaDownload /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 