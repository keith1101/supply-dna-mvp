import React from 'react';
import { FaChartLine } from 'react-icons/fa6';

export default function AnalyticsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaChartLine /> Analytics</div>
        <p style={{ color: '#7F8C8D' }}>Visualize trends, KPIs, and advanced supply chain analytics here.</p>
      </div>
    </div>
  );
} 