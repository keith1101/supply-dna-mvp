import React, { useState, useEffect } from 'react';
import { FaDna, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function QRLookupCard({ id, setId, handleScannedInput, loading, scanning, setScanning, fileMode, setFileMode, handleFile, videoRef, error, component }) {
  const stages = ['Genesis', 'Supplier', 'Manufacturer', 'Assembly', 'Distribution', 'Customer'];
  let currentStageIdx = -1;
  if (component && component.batch) {
    currentStageIdx = stages.length - 1;
  }
  return (
    <section className="supplydna-card enhanced-lookup-card">
      <div className="supplydna-card-title" style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <FaDna style={{color: '#3498DB', fontSize: 24}} />
        Component Lookup
        {loading && <span className="spinner" />}
        {component && !error && <span className="status-badge success"><FaCheckCircle style={{color:'#27AE60'}} /> Found</span>}
{error && <span className="status-badge error"><FaExclamationTriangle style={{color:'#E74C3C'}} /> Error</span>}
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
      {error && <div className="lookup-error"><FaExclamationTriangle style={{color:'#E74C3C'}} /> {error}</div>}
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