import React, { useState, useEffect, useRef } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import QrScanner from 'qr-scanner';
import { FaGauge, FaGear, FaListCheck, FaXmark } from 'react-icons/fa6';
import { FaDna, FaChartLine, FaFileAlt, FaTruck, FaMicroscope, FaBell, FaUser, FaBars, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import TraceabilityView from './components/TraceabilityView';
import AnalyticsView from './components/AnalyticsView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import RegisterComponentView from './components/RegisterComponentView';
import QRLookupCard from './components/QRLookupCard';
import Sparkline from './components/Sparkline';
import Sidebar from './components/Sidebar';
import NFTDisplay from './components/NFTDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sidebarMenu = [
  { label: 'Dashboard', icon: <FaGauge /> },
  { label: 'Traceability', icon: <FaDna /> },
  { label: 'Analytics', icon: <FaChartLine /> },
  { label: 'Reports', icon: <FaFileAlt /> },
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
  'function components(string) view returns (string id, string name, string supplier, string batch, string date, string metadataURI)',
  'function registerComponent(string id, string name, string supplier, string batch, string date, string metadataURI)',
  'function getComponent(string id) view returns (string id, string name, string supplier, string batch, string date, string metadataURI)',
  'function getTokenId(string id) view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)'
];
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  // Remove showMobileSearch state

  // Auto-close sidebar on desktop resize
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 601px)');
    const handler = (e) => { if (e.matches) setSidebarOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => document.body.classList.remove('sidebar-open');
  }, [sidebarOpen]);

  // Trap focus in sidebar when open
  useEffect(() => {
    if (!sidebarOpen) return;
    const focusable = sidebarRef.current?.querySelectorAll('a,button,[tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    function handleEsc(e) {
      if (e.key === 'Escape') setSidebarOpen(false);
    }
    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEsc);
    first.focus();
    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [sidebarOpen]);

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
      
      // Get component data
      const data = await contract.components(uuid);
      const parsed = {
        id: data[0],
        name: data[1],
        supplier: data[2],
        batch: data[3],
        date: data[4],
        metadataURI: data[5],
      };
      
      if (!parsed.id || parsed.id.trim() === '') {
        setError('Component not found for this UUID!');
      } else {
        // Get token ID for the component
        try {
          const tokenId = await contract.getTokenId(uuid);
          parsed.tokenId = tokenId.toString();
        } catch (tokenError) {
          console.warn('Could not fetch token ID:', tokenError);
          parsed.tokenId = '0'; // Default if token ID not available
        }
        
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

  // Compute supplier metrics from recentComponents (demo; upgrade to all components when available)
  const supplierMetrics = React.useMemo(() => {
    const supplierMap = {};
    recentComponents.forEach((comp) => {
      const supplier = comp.supplier || (comp.status && comp.status.split('-')[0].trim()) || 'Unknown';
      if (!supplierMap[supplier]) supplierMap[supplier] = new Set();
      supplierMap[supplier].add(comp.id);
    });
    return Object.entries(supplierMap).map(([name, ids]) => ({
      name,
      supplied: ids.size,
    }));
  }, [recentComponents]);

  // Dynamic supplier metrics: highlight supplier
  const supplierBarDataDynamic = supplierMetrics.map(sup => ({
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
        {component && !error && (
          <NFTDisplay 
            component={component} 
            tokenId={component.tokenId}
            network="polygon"
          />
        )}
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
                <Bar dataKey="supplied" fill="#F39C12" name="Components Supplied" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
            <div className="supplydna-chart-legend">
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
                {recentComponents
                  .slice()
                  .sort((a, b) => {
                    // Parse date and time in 'DD/MM/YYYY HH:mm' format
                    const parse = (row) => {
                      const [date, time] = row.updated.split(' ');
                      const [day, month, year] = date.split('/').map(Number);
                      const [hour, minute] = time.split(':').map(Number);
                      return new Date(year, month - 1, day, hour, minute).getTime();
                    };
                    return parse(b) - parse(a);
                  })
                  .map((row) => (
                    <tr key={row.id + row.updated}>
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

  const isMobile = window.innerWidth <= 600;

  return (
    <ErrorBoundary>
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flex: 1, display: 'flex' }}>
      {loading && (
        <div className="global-loading-overlay">
          <span className="spinner" style={{width:48,height:48,borderWidth:6}} />
        </div>
      )}
      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-modal="true" aria-label="Sidebar overlay" tabIndex={-1} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:99,background:'rgba(44,62,80,0.25)'}} />}
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarMenu={sidebarMenu}
        isMobile={isMobile}
        ref={sidebarRef}
      />
      {/* Main Content */}
      <div className="supplydna-main">
        {isMobile && (
          <div className="mobile-header-bar mobile-only">
            <button className="sidebar-toggle-btn enhanced-burger" onClick={() => setSidebarOpen(v => !v)} aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}>
              {sidebarOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        )}
        {/* Main Content Area */}
        {mainContent}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
    </ErrorBoundary>
  );
}
