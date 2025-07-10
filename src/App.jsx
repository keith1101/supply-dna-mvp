import React, { useState, useEffect, useRef } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import QrScanner from 'qr-scanner';
import { FaGauge, FaDna, FaChartLine, FaFileLines, FaGear, FaTruck, FaMicroscope, FaListCheck, FaBell, FaUser, FaMagnifyingGlass } from 'react-icons/fa6';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const sidebarMenu = [
  { label: 'Dashboard', icon: <FaGauge /> },
  { label: 'Traceability', icon: <FaDna /> },
  { label: 'Analytics', icon: <FaChartLine /> },
  { label: 'Reports', icon: <FaFileLines /> },
  { label: 'Settings', icon: <FaGear /> },
  { label: 'Register', icon: <FaDna /> },
];

const lifecycleData = [
  { stage: 'Genesis', value: 200 },
  { stage: 'Supplier', value: 400 },
  { stage: 'Mfg', value: 800 },
  { stage: 'Assembly', value: 650 },
  { stage: 'Dist.', value: 900 },
  { stage: 'Customer', value: 1200 },
];

const supplierBarData = [
  { name: 'Acme', delivery: 92, quality: 88, supplied: 1200 },
  { name: 'Globex', delivery: 85, quality: 91, supplied: 950 },
  { name: 'Initech', delivery: 68, quality: 80, supplied: 700 },
];

const qualityMetrics = [
  {
    label: 'Temperature',
    value: '22.5°C',
    status: 'good',
    spark: [20, 18, 15, 14, 13, 15, 17, 16, 14],
    color: '#27AE60',
  },
  {
    label: 'Humidity',
    value: '65% RH',
    status: 'warn',
    spark: [10, 12, 14, 16, 18, 20, 22, 24, 26],
    color: '#F39C12',
  },
  {
    label: 'Vibration',
    value: '0.5 G',
    status: 'bad',
    spark: [14, 10, 18, 12, 20, 14, 22, 16, 24],
    color: '#E74C3C',
  },
];

const recentComponentsDemo = [
  {
    id: 'COMP-XYZ-789',
    status: 'In Transit - Warehouse B',
    statusClass: '',
    updated: '2025-07-08 14:30',
  },
  {
    id: 'COMP-ABC-123',
    status: 'Quality Check - Pending',
    statusClass: 'warn',
    updated: '2025-07-08 13:10',
  },
  {
    id: 'COMP-DEF-456',
    status: 'Alert: Temp Out of Range',
    statusClass: 'bad',
    updated: '2025-07-08 12:45',
  },
  {
    id: 'COMP-GHI-321',
    status: 'Delivered - Customer',
    statusClass: '',
    updated: '2025-07-08 11:20',
  },
];

const abi = [
  'function components(string) view returns (string id, string name, string supplier, string batch, string date)',
  'function registerComponent(string id, string name, string supplier, string batch, string date)'
];
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((v, i) => {
    const x = (i * 80) / (data.length - 1);
    const y = 28 - ((v - min) / (max - min || 1)) * 18 - 5;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg className="supplydna-sparkline" viewBox="0 0 80 28">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
    </svg>
  );
}

function QRLookupCard({ id, setId, handleScannedInput, loading, scanning, setScanning, fileMode, setFileMode, handleFile, videoRef, error, component }) {
  // Define the stages for the timeline
  const stages = ['Genesis', 'Supplier', 'Manufacturer', 'Assembly', 'Distribution', 'Customer'];
  // Try to determine the current stage from the component (if possible)
  let currentStageIdx = -1;
  if (component && component.batch) {
    // Example: use batch or another field to determine stage (customize as needed)
    // For now, just highlight all if found
    currentStageIdx = stages.length - 1;
  }
  return (
    <section className="supplydna-card enhanced-lookup-card">
      <div className="supplydna-card-title" style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <FaDna style={{color: '#3498DB', fontSize: 24}} />
        Component Lookup
        {loading && <span className="spinner" />}
        {component && !error && <span className="status-badge success">Found</span>}
        {error && <span className="status-badge error">Error</span>}
      </div>
      <div className="lookup-input-row">
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScannedInput(id)}
          placeholder="Enter UUID or JSON"
          className="lookup-input"
        />
        <button
          onClick={() => handleScannedInput(id)}
          disabled={loading}
          className="lookup-btn"
        >
          Lookup
        </button>
        <span className="uuid-chip">{id && <>{id}</>}</span>
      </div>
      <div className="lookup-actions">
        <button onClick={() => { setScanning(true); setFileMode(false); }} className="lookup-action-btn">📷 Scan Camera</button>
        <button onClick={() => { setFileMode(true); setScanning(false); }} className="lookup-action-btn">📁 Upload QR</button>
      </div>
      {scanning && (
        <div className="mb-4">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
        </div>
      )}
      {fileMode && (
        <div className="mb-4">
          <input type="file" accept="image/*" onChange={handleFile} />
          <button onClick={() => setFileMode(false)} className="cancel-btn">Cancel</button>
        </div>
      )}
      {error && <div className="lookup-error">{error}</div>}
      {component && !error && (
        <>
          <div className="component-timeline">
            {stages.map((stage, idx) => (
              <div key={stage} className={`timeline-step${idx <= currentStageIdx ? ' active' : ''}`}>
                <span className="timeline-dot" />
                <span className="timeline-label">{stage}</span>
              </div>
            ))}
          </div>
          <div className="component-details">
            <div><strong>ID:</strong> {component.id}</div>
            <div><strong>Name:</strong> {component.name}</div>
            <div><strong>Supplier:</strong> {component.supplier}</div>
            <div><strong>Batch:</strong> {component.batch}</div>
            <div><strong>Date:</strong> {component.date}</div>
          </div>
        </>
      )}
    </section>
  );
}

function TraceabilityView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaDna /> Traceability</div>
        <p style={{ color: '#7F8C8D' }}>View the full trace history, chain of custody, or a map of component movements here.</p>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaChartLine /> Analytics</div>
        <p style={{ color: '#7F8C8D' }}>Visualize trends, KPIs, and advanced supply chain analytics here.</p>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaFileLines /> Reports</div>
        <p style={{ color: '#7F8C8D' }}>Generate, download, and review supply chain reports here.</p>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaGear /> Settings</div>
        <p style={{ color: '#7F8C8D' }}>Manage your account, preferences, and system settings here.</p>
      </div>
    </div>
  );
}

function RegisterComponentView({ onRegisterSuccess }) {
  const [form, setForm] = React.useState({ id: '', name: '', supplier: '', batch: '', date: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== 'password') {
      setError('Incorrect password.');
      return;
    }
    if (!form.id || !form.name || !form.supplier || !form.batch || !form.date) {
      setError('All fields are required.');
      return;
    }
    try {
      setLoading(true);
      if (!window.ethereum) {
        setError('MetaMask is required.');
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      const tx = await contract.registerComponent(form.id, form.name, form.supplier, form.batch, form.date);
      await tx.wait();
      setSuccess('Component registered successfully!');
      setForm({ id: '', name: '', supplier: '', batch: '', date: '', password: '' });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError('Registration failed. ' + (err?.reason || err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="supplydna-card" style={{ minWidth: 340, maxWidth: 400 }} onSubmit={handleSubmit}>
        <div className="supplydna-card-title"><FaDna /> Register Component</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="id" value={form.id} onChange={handleChange} placeholder="Component ID" className="lookup-input" />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="lookup-input" />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier" className="lookup-input" />
          <input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch" className="lookup-input" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="lookup-input" type="date" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="lookup-input" type="password" />
        </div>
        <button type="submit" className="lookup-btn" style={{ marginTop: 18 }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <div className="lookup-error" style={{ marginTop: 10 }}>{error}</div>}
        {success && <div className="status-badge success" style={{ marginTop: 10 }}>{success}</div>}
      </form>
    </div>
  );
}

export default function App() {
  // State for navigation
  const [activeView, setActiveView] = useState('Dashboard');
  // QR/lookup state
  const [id, setId] = useState('');
  const [component, setComponent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [fileMode, setFileMode] = useState(false);
  const videoRef = useRef();
  // Recent lookups
  const [recentComponents, setRecentComponents] = useState(() => {
    const stored = localStorage.getItem('recentComponents');
    return stored ? JSON.parse(stored) : recentComponentsDemo;
  });

  useEffect(() => {
    localStorage.setItem('recentComponents', JSON.stringify(recentComponents));
  }, [recentComponents]);

  useEffect(() => {
    let scanner;
    if (scanning && videoRef.current) {
      scanner = new QrScanner(
        videoRef.current,
        (result) => {
          if (result?.data) {
            handleScannedInput(result.data);
            scanner.stop();
          }
        },
        { returnDetailedScanResult: true }
      );
      scanner.start().catch(console.error);
    }
    return () => {
      scanner?.stop();
    };
  }, [scanning]);

  const handleScannedInput = (raw) => {
    try {
      const maybeJson = JSON.parse(raw.replace(/'/g, '"'));
      if (maybeJson?.id) {
        setId(maybeJson.id);
        lookup(maybeJson.id);
        return;
      }
    } catch (_) {}
    setId(raw.trim());
    lookup(raw.trim());
  };

  const lookup = async (uuid) => {
    if (!uuid) return;
    try {
      setLoading(true);
      setError('');
      setComponent(null);
      if (!window.ethereum) {
        setError('⚠️ Please install MetaMask to use this feature!');
        return;
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      const data = await contract.components(uuid);
      const parsed = {
        id: data[0],
        name: data[1],
        supplier: data[2],
        batch: data[3],
        date: data[4],
      };
      if (!parsed.id || parsed.id.trim() === '') {
        setError('Component not found for this UUID!');
      } else {
        setComponent(parsed);
        setRecentComponents((prev) => [
          { 
            id: parsed.id, 
            status: parsed.name, 
            statusClass: '', 
            updated: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Bangkok', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')
          },
          ...prev.slice(0, 3)
        ]);
      }
    } catch (err) {
      console.error(err);
      setError('Error during lookup, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        handleScannedInput(result.data);
      } catch (e) {
        setError('Could not scan QR from image.');
      }
    }
  };

  // Header search bar triggers lookup
  const handleHeaderSearch = (e) => {
    if (e.key === 'Enter') {
      handleScannedInput(id);
    }
  };

  // Helper: Determine current stage index from component (simple heuristic)
  function getCurrentStageIdx(component) {
    if (!component) return -1;
    // Example: use batch or supplier to guess stage (customize as needed)
    if (component.batch && component.batch.toLowerCase().includes('dist')) return 4;
    if (component.batch && component.batch.toLowerCase().includes('assembly')) return 3;
    if (component.batch && component.batch.toLowerCase().includes('mfg')) return 2;
    if (component.supplier) return 1;
    return 0;
  }
  const stages = ['Genesis', 'Supplier', 'Manufacturer', 'Assembly', 'Distribution', 'Customer'];
  const currentStageIdx = getCurrentStageIdx(component);

  // Dynamic lifecycle data: highlight current stage
  const lifecycleDataDynamic = stages.map((stage, idx) => ({
    stage,
    value: idx === currentStageIdx ? 1200 : 400 + idx * 200,
    highlight: idx === currentStageIdx,
  }));

  // Dynamic supplier metrics: highlight supplier
  const supplierBarDataDynamic = supplierBarData.map(sup => ({
    ...sup,
    highlight: component && component.supplier && sup.name.toLowerCase() === component.supplier.toLowerCase(),
  }));

  // Dynamic quality metrics (if available)
  const qualityMetricsDynamic = component && component.quality ? [
    {
      label: 'Temperature',
      value: component.quality.temperature + '°C',
      status: component.quality.temperature > 30 ? 'warn' : 'good',
      spark: [component.quality.temperature - 1, component.quality.temperature, component.quality.temperature + 1],
      color: '#27AE60',
    },
    {
      label: 'Humidity',
      value: component.quality.humidity + '% RH',
      status: component.quality.humidity > 70 ? 'warn' : 'good',
      spark: [component.quality.humidity - 2, component.quality.humidity, component.quality.humidity + 2],
      color: '#F39C12',
    },
    {
      label: 'Vibration',
      value: component.quality.vibration + ' G',
      status: component.quality.vibration > 1 ? 'bad' : 'good',
      spark: [component.quality.vibration - 0.1, component.quality.vibration, component.quality.vibration + 0.1],
      color: '#E74C3C',
    },
  ] : qualityMetrics;

  // Custom dot for LineChart
  const CustomLineDot = (props) => {
    if (props.payload && props.payload.highlight) {
      return <circle cx={props.cx} cy={props.cy} r={8} fill="#2ECC71" stroke="#3498DB" />;
    }
    return <circle cx={props.cx} cy={props.cy} r={5} fill="#3498DB" />;
  };

  // Custom bar shape for BarChart
  const makeCustomBarShape = (color, highlightColor) => (props) => (
    <rect
      {...props}
      fill={props.payload && props.payload.highlight ? highlightColor : color}
      rx={8}
      ry={8}
    />
  );

  // Main content switching
  let mainContent;
  if (activeView === 'Dashboard') {
    mainContent = (
      <>
        <QRLookupCard
          id={id}
          setId={setId}
          handleScannedInput={handleScannedInput}
          loading={loading}
          scanning={scanning}
          setScanning={setScanning}
          fileMode={fileMode}
          setFileMode={setFileMode}
          handleFile={handleFile}
          videoRef={videoRef}
          error={error}
          component={component}
        />
        {/* Dashboard Cards */}
        <div className="supplydna-dashboard">
          {/* Component Lifecycle Card */}
          <section className="supplydna-card" style={{ gridColumn: '1 / 2' }}>
            <div className="supplydna-card-title"><FaDna /> Component Lifecycle Overview</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lifecycleDataDynamic} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid stroke="#ecf0f1" strokeDasharray="3 3" />
                <XAxis dataKey="stage" tick={{ fill: '#7F8C8D', fontSize: 13 }} axisLine={{ stroke: '#BDC3C7' }} />
                <YAxis tick={{ fill: '#7F8C8D', fontSize: 13 }} axisLine={{ stroke: '#BDC3C7' }} domain={[0, 1400]} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3498DB" strokeWidth={3} dot={CustomLineDot} />
              </LineChart>
            </ResponsiveContainer>
            <div className="supplydna-chart-legend">
              <span><span className="dot" style={{ background: '#3498DB' }}></span> Components</span>
            </div>
          </section>
          {/* Supplier Performance Card */}
          <section className="supplydna-card" style={{ gridColumn: '2 / 3' }}>
            <div className="supplydna-card-title"><FaTruck /> Key Supplier Metrics</div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={supplierBarDataDynamic} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid stroke="#ecf0f1" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: '#7F8C8D', fontSize: 13 }} axisLine={{ stroke: '#BDC3C7' }} />
                <YAxis tick={{ fill: '#7F8C8D', fontSize: 13 }} axisLine={{ stroke: '#BDC3C7' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="delivery" fill="#2ECC71" shape={makeCustomBarShape('#B5EAD7', '#2ECC71')} name="On-time Delivery" barSize={24} />
                <Bar dataKey="quality" fill="#3498DB" shape={makeCustomBarShape('#A7C7E7', '#3498DB')} name="Quality Score" barSize={24} />
                <Bar dataKey="supplied" fill="#F39C12" shape={makeCustomBarShape('#FFD6A5', '#F39C12')} name="Components Supplied" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
            <div className="supplydna-chart-legend">
              <span><span className="dot" style={{ background: '#2ECC71' }}></span> On-time Delivery</span>
              <span><span className="dot" style={{ background: '#3498DB' }}></span> Quality Score</span>
              <span><span className="dot" style={{ background: '#F39C12' }}></span> Components Supplied</span>
            </div>
          </section>
          {/* Quality Control Card */}
          <section className="supplydna-card" style={{ gridColumn: '1 / 2' }}>
            <div className="supplydna-card-title"><FaMicroscope /> Live Quality Parameters</div>
            <div className="supplydna-quality-metrics">
              {qualityMetricsDynamic.map((m) => (
                <div className="supplydna-quality-metric-row" key={m.label}>
                  <span className="supplydna-quality-metric-label">{m.label}</span>
                  <span className={`supplydna-quality-metric-value ${m.status}`}>{m.value}</span>
                  <Sparkline data={m.spark} color={m.color} />
                </div>
              ))}
            </div>
          </section>
          {/* Recent Component Lookup Card */}
          <section className="supplydna-card" style={{ gridColumn: '2 / 3' }}>
            <div className="supplydna-card-title"><FaListCheck /> Recent Component Tracking</div>
            <table className="supplydna-recent-table">
              <thead>
                <tr>
                  <th>Component ID</th>
                  <th>Current Location/Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentComponents.map((row) => (
                  <tr key={row.id}>
                    <td className="comp-id">{row.id}</td>
                    <td className={`status${row.statusClass ? ' ' + row.statusClass : ''}`}>{row.status}</td>
                    <td className="timestamp">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </>
    );
  } else if (activeView === 'Traceability') {
    mainContent = <TraceabilityView />;
  } else if (activeView === 'Analytics') {
    mainContent = <AnalyticsView />;
  } else if (activeView === 'Reports') {
    mainContent = <ReportsView />;
  } else if (activeView === 'Settings') {
    mainContent = <SettingsView />;
  } else if (activeView === 'Register') {
    mainContent = <RegisterComponentView onRegisterSuccess={() => setActiveView('Dashboard')} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside className="supplydna-sidebar">
        <div className="supplydna-logo">Supply <span style={{ color: '#2ECC71' }}>DNA</span></div>
        <nav>
          <ul>
            {sidebarMenu.map((item) => (
              <li
                key={item.label}
                className={activeView === item.label ? 'active' : ''}
                onClick={() => setActiveView(item.label)}
                style={{ userSelect: 'none' }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <div className="supplydna-main">
        {/* Header */}
        <header className="supplydna-header">
          <div className="section-title">{activeView}</div>
          <div className="search-bar">
            <FaMagnifyingGlass className="search-icon" />
            <input
              type="text"
              placeholder="Search by Component ID..."
              value={id}
              onChange={e => setId(e.target.value)}
              onKeyDown={handleHeaderSearch}
            />
          </div>
          <div className="user-actions">
            <span className="icon-badge">
              <FaBell className="header-icon" />
              <span className="badge">3</span>
            </span>
            <FaUser className="header-icon" />
          </div>
        </header>
        {/* Main Content Area */}
        {mainContent}
      </div>
    </div>
  );
}
