import React, { useState, useEffect } from 'react';
import { FaDna, FaTruck } from 'react-icons/fa';
import { FaExclamationTriangle, FaSearch, FaCheckCircle } from 'react-icons/fa';

// Sample traceability data
const sampleTimeline = [
  { step: 'Manufactured', date: '2024-04-01', location: 'Factory A', status: 'complete' },
  { step: 'Quality Check', date: '2024-04-03', location: 'QA Lab', status: 'complete' },
  { step: 'Shipped', date: '2024-04-05', location: 'Logistics Hub', status: 'complete' },
  { step: 'In Transit', date: '2024-04-07', location: 'On Route', status: 'in_progress' },
  { step: 'Delivered', date: '', location: '', status: 'pending' },
];

export default function TraceabilityView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // Uncomment to simulate error:
      // setError('Failed to load traceability data.'); setLoading(false); return;
      setTimeline(sampleTimeline);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTimeline = timeline.filter(item =>
    item.step.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }} aria-label="Traceability Dashboard">
      <div className="supplydna-card nft-tech code-font" style={{ minWidth: 320, marginBottom: 24 }}>
        <div className="supplydna-card-title code-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaDna /> Traceability
        </div>
        <p style={{ color: '#7F8C8D', marginBottom: 0 }}>View the full trace history, chain of custody, or a map of component movements here.</p>
      </div>
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
        <FaSearch style={{ color: '#3498DB', fontSize: 18 }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search step or location..."
          className="lookup-input code-font"
          style={{ maxWidth: 260 }}
          aria-label="Search traceability steps"
        />
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <div className="spinner" aria-label="Loading traceability" />
        </div>
      ) : error ? (
        <div style={{ color: '#E74C3C', display: 'flex', alignItems: 'center', gap: 8, minHeight: 120 }}>
          <FaExclamationTriangle style={{ fontSize: '1.5em' }} />
          <span>{error}</span>
        </div>
      ) : (
        <div style={{ marginTop: 10 }}>
          <div className="component-timeline">
            {filteredTimeline.map((item, idx) => (
              <div key={idx} className="timeline-step" style={{ opacity: item.status === 'pending' ? 0.5 : 1 }}>
                <div className="timeline-dot" style={{ background: item.status === 'complete' ? '#2ECC71' : item.status === 'in_progress' ? '#F39C12' : '#BDC3C7' }}>
                  {item.status === 'complete' && <FaCheckCircle style={{ color: '#fff', fontSize: 14 }} />}
                  {item.status === 'in_progress' && <FaTruck style={{ color: '#fff', fontSize: 14 }} />}
                </div>
                <div className="timeline-label" style={{ fontWeight: 500, color: item.status === 'complete' ? '#2ECC71' : item.status === 'in_progress' ? '#F39C12' : '#7F8C8D' }}>
                  {item.step}
                </div>
                <div style={{ fontSize: 13, color: '#7F8C8D', marginTop: 2 }}>{item.location}</div>
                <div style={{ fontSize: 12, color: '#BDC3C7' }}>{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 