import React from 'react';
import { FaGear } from 'react-icons/fa6';

export default function SettingsView() {
  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }}>
      <div className="supplydna-card" style={{ minWidth: 320 }}>
        <div className="supplydna-card-title"><FaGear /> Settings</div>
        <p style={{ color: '#7F8C8D' }}>Manage your account, preferences, and system settings here.</p>
      </div>
    </div>
  );
} 