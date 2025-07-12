import React from 'react';
import { FaHome, FaTachometerAlt, FaDna, FaChartLine, FaFileAlt, FaCog } from 'react-icons/fa';

const sidebarMenu = [
  { label: 'Home', icon: <FaHome className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Dashboard', icon: <FaTachometerAlt className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Traceability', icon: <FaDna className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Analytics', icon: <FaChartLine className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Reports', icon: <FaFileAlt className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Settings', icon: <FaCog className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Register', icon: <FaDna className="sidebar-icon" aria-hidden="true" /> },
];

export default function Sidebar({ activeView, setActiveView, sidebarOpen, setSidebarOpen, sidebarRef }) {
  const isMobile = window.innerWidth <= 600;
  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-modal="true" aria-label="Sidebar overlay" tabIndex={-1} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:99,background:'rgba(44,62,80,0.25)'}} />}
      <aside ref={sidebarRef} className={`supplydna-sidebar${sidebarOpen ? ' open' : ''}`} style={isMobile && sidebarOpen ? {width: '100vw', zIndex: 100} : sidebarOpen ? {zIndex: 100} : {}} role="navigation" aria-label="Main navigation" tabIndex={sidebarOpen ? 0 : -1}>
        {/* Home Page Card (now just an offset/space) */}
        <div className="sidebar-home-card" style={{
          background: 'linear-gradient(135deg, #3498DB, #2ECC71)',
          borderRadius: '12px',
          padding: '32px', // increased padding for a more prominent offset
          margin: '16px',
          minHeight: '32px',
          color: 'white',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
          cursor: 'default',
          transition: 'all 0.3s ease',
          border: 'none',
          userSelect: 'none',
        }}
        tabIndex={-1}
        aria-hidden="true">
          {/* No content, just a colored offset */}
        </div>
        
        <nav role="menu">
          <ul style={{ padding: 0, margin: 0 }}>
            {sidebarMenu.map((item) => (
              <li
                key={item.label}
                className={activeView === item.label ? 'active' : ''}
                onClick={() => { setActiveView(item.label); setSidebarOpen(false); }}
                style={{ userSelect: 'none' }}
                role="menuitem"
                aria-current={activeView === item.label ? 'page' : undefined}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveView(item.label);
                    setSidebarOpen(false);
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
} 