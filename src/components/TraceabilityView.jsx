import React from 'react';
import { FaDna } from 'react-icons/fa6';

export default function TraceabilityView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaDna /> Traceability</div>
        <p style={{ color: '#7F8C8D' }}>View the full trace history, chain of custody, or a map of component movements here.</p>
      </div>
    </div>
  );
} 