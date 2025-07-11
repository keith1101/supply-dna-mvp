import React from 'react';
import { FaBell, FaUser, FaDna, FaBars } from 'react-icons/fa';

export default function Header({ onSidebarToggle }) {
  // Responsive: show hamburger on mobile
  const isMobile = window.innerWidth <= 600;
  return (
    <header className="supplydna-header" style={{ position: 'sticky', top: 0, zIndex: 200 }}>
      <div className="header-row" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 64 }}>
        {/* Left: Logo and Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isMobile && (
            <button
              className="header-icon-btn sidebar-toggle-btn"
              aria-label="Open sidebar menu"
              tabIndex={0}
              style={{ background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8, cursor: 'pointer' }}
              onClick={onSidebarToggle}
            >
              <FaBars style={{ fontSize: '1.5em', color: '#3498DB' }} />
            </button>
          )}
          <a href="/" className="section-title logo-pro" aria-label="Go to dashboard" style={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', textDecoration: 'none' }}>
            <span style={{ color: '#2ECC71', fontWeight: 900, fontSize: '2.1rem', letterSpacing: '0.5px' }}>Supply</span>
            <FaDna style={{ color: 'linear-gradient(90deg,#3498DB,#2ECC71)', fontSize: '1.7rem', filter: 'drop-shadow(0 1px 4px #3498db33)' }} />
            <span style={{ color: '#3498DB', fontWeight: 900, fontSize: '2.1rem', letterSpacing: '0.5px' }}>DNA</span>
          </a>
        </div>
        {/* Center: Placeholder for search/navigation */}
        {!isMobile && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* TODO: Add search bar or navigation here */}
          </div>
        )}
        {/* Right: Notification and Account icons */}
        {!isMobile && (
          <div className="user-actions" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <button
              className="icon-badge ripple header-icon-btn"
              aria-label="Notifications"
              tabIndex={0}
              style={{ background: 'rgba(255,255,255,0.85)', border: 'none', position: 'relative', cursor: 'pointer', outline: 'none', padding: 0, marginRight: 8, borderRadius: '50%', width: 44, height: 44, boxShadow: '0 2px 8px #3498db22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {/* TODO: open notifications dropdown */}}
            >
              <FaBell className="header-icon vfx-bell" style={{ fontSize: '1.6em', color: '#3498DB' }} />
              <span className="badge vfx-badge-pulse" style={{ position: 'absolute', top: 2, right: 2, background: '#E74C3C', color: '#fff', fontWeight: 700, fontSize: '0.85em', boxShadow: '0 2px 8px #e74c3c44', borderRadius: '50%', minWidth: 20, minHeight: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px', border: '2px solid #fff' }}>3</span>
            </button>
            <button
              className="ripple header-icon-btn"
              aria-label="Account"
              tabIndex={0}
              style={{ background: 'rgba(255,255,255,0.85)', border: 'none', position: 'relative', cursor: 'pointer', outline: 'none', padding: 0, borderRadius: '50%', width: 44, height: 44, boxShadow: '0 2px 8px #2ecc7122', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => {/* TODO: open account dropdown */}}
            >
              <FaUser className="header-icon vfx-account" style={{ fontSize: '1.6em', color: '#2ECC71' }} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
} 