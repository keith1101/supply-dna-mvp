import React from 'react';
import { FaHome, FaProjectDiagram, FaChartBar, FaFileAlt, FaCog, FaPlus } from 'react-icons/fa';

const sidebarMenu = [
  { label: 'Dashboard', icon: <FaHome className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Traceability', icon: <FaProjectDiagram className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Analytics', icon: <FaChartBar className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Reports', icon: <FaFileAlt className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Settings', icon: <FaCog className="sidebar-icon" aria-hidden="true" /> },
  { label: 'Register', icon: <FaPlus className="sidebar-icon" aria-hidden="true" /> },
];

export default function Sidebar({ activeView, setActiveView, sidebarOpen, setSidebarOpen, sidebarRef }) {
  const isMobile = window.innerWidth <= 600;
  return (
    <>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-modal="true" aria-label="Sidebar overlay" tabIndex={-1} style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:99,background:'rgba(44,62,80,0.25)'}} />}
      <aside ref={sidebarRef} className={`supplydna-sidebar${sidebarOpen ? ' open' : ''}`} style={isMobile && sidebarOpen ? {width: '100vw', zIndex: 100} : sidebarOpen ? {zIndex: 100} : {}} role="navigation" aria-label="Main navigation" tabIndex={sidebarOpen ? 0 : -1}>
        <div className="supplydna-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Optionally add a small SVG or icon here for branding */}
          Supply <span style={{ color: '#2ECC71' }}>DNA</span>
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