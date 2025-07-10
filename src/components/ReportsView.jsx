import React from 'react';
import { FaFileLines } from 'react-icons/fa6';

export default function ReportsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaFileLines /> Reports</div>
        <p style={{ color: '#7F8C8D' }}>Generate, download, and review supply chain reports here.</p>
      </div>
    </div>
  );
} 