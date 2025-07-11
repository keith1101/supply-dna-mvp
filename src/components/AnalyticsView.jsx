import React, { useState, useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from 'recharts';

// Sample KPI data
const sampleKPIs = [
  { label: 'Total Shipments', value: 1280, trend: '+5%' },
  { label: 'Avg. Delivery Time', value: '2.3 days', trend: '-2%' },
  { label: 'On-Time Rate', value: '97%', trend: '+1%' },
  { label: 'Active Suppliers', value: 42, trend: '0%' },
];

// Sample chart data
const shipmentVolumeData = [
  { month: 'Jan', shipments: 120 },
  { month: 'Feb', shipments: 98 },
  { month: 'Mar', shipments: 150 },
  { month: 'Apr', shipments: 130 },
  { month: 'May', shipments: 170 },
  { month: 'Jun', shipments: 160 },
];

const statusData = [
  { name: 'Delivered', value: 900 },
  { name: 'In Transit', value: 250 },
  { name: 'Delayed', value: 130 },
];
const statusColors = ['#2ECC71', '#3498DB', '#E74C3C'];

const deliveryTimeData = [
  { month: 'Jan', days: 2.5 },
  { month: 'Feb', days: 2.3 },
  { month: 'Mar', days: 2.1 },
  { month: 'Apr', days: 2.4 },
  { month: 'May', days: 2.2 },
  { month: 'Jun', days: 2.0 },
];

export default function AnalyticsView() {
  // Simulate loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    // Simulate async data fetch
    const timer = setTimeout(() => {
      // Uncomment to simulate error:
      // setError('Failed to load analytics data.'); setLoading(false); return;
      setKpis(sampleKPIs);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }} aria-label="Analytics Dashboard">
      <div className="supplydna-card nft-tech code-font" style={{ minWidth: 320, marginBottom: 24 }}>
        <div className="supplydna-card-title code-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaChartLine /> Analytics
        </div>
        <p style={{ color: '#7F8C8D', marginBottom: 0 }}>Visualize trends, KPIs, and advanced supply chain analytics here.</p>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <div className="spinner" aria-label="Loading analytics" />
        </div>
      ) : error ? (
        <div style={{ color: '#E74C3C', display: 'flex', alignItems: 'center', gap: 8, minHeight: 120 }}>
          <FaExclamationTriangle style={{ fontSize: '1.5em' }} />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32 }}>
            {kpis.map((kpi) => (
              <div key={kpi.label} className="supplydna-card" style={{ minWidth: 180, flex: '1 1 180px', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', boxShadow: '0 2px 8px #3498db11' }}>
                <span style={{ fontSize: '1.1em', color: '#7F8C8D', marginBottom: 6 }}>{kpi.label}</span>
                <span style={{ fontSize: '2em', fontWeight: 700, color: '#3498DB' }}>{kpi.value}</span>
                <span style={{ fontSize: '0.95em', color: kpi.trend.startsWith('+') ? '#2ECC71' : kpi.trend.startsWith('-') ? '#E74C3C' : '#7F8C8D' }}>{kpi.trend}</span>
              </div>
            ))}
          </div>
          {/* Bar Chart: Shipment Volume by Month */}
          <div className="supplydna-card" style={{ minHeight: 320, marginBottom: 32, boxShadow: '0 2px 8px #3498db11' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: 12 }}>Shipment Volume by Month</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={shipmentVolumeData} aria-label="Shipment Volume by Month">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="shipments" fill="#3498DB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Pie Chart: Shipment Status Distribution */}
          <div className="supplydna-card" style={{ minHeight: 320, marginBottom: 32, boxShadow: '0 2px 8px #3498db11', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: 12 }}>Shipment Status Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart aria-label="Shipment Status Distribution">
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {statusData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={statusColors[idx % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Line Chart: Average Delivery Time Trend */}
          <div className="supplydna-card" style={{ minHeight: 320, marginBottom: 32, boxShadow: '0 2px 8px #3498db11' }}>
            <div style={{ fontSize: '1.1em', fontWeight: 600, marginBottom: 12 }}>Average Delivery Time Trend</div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={deliveryTimeData} aria-label="Average Delivery Time Trend">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1.5, 3]} tickFormatter={v => `${v}d`} />
                <Tooltip formatter={v => `${v} days`} />
                <Line type="monotone" dataKey="days" stroke="#2ECC71" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
} 