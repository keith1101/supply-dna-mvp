import React, { useState, useEffect } from 'react';
import { FaDna, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { BrowserProvider, Contract } from 'ethers';
import { uploadToIPFS, createNFTMetadata } from '../services/ipfs';
import { getSupplyDNANFTContract } from '../services/contract';

export default function RegisterComponentView({ onRegisterSuccess }) {
  const [form, setForm] = React.useState({ id: '', name: '', supplier: '', batch: '', date: '' });
  const [touched, setTouched] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [nftInfo, setNftInfo] = React.useState(null);
  const [showTooltip, setShowTooltip] = React.useState('');

  // Inline validation
  const validate = (field, value) => {
    if (!value) return 'Required';
    if (field === 'id' && value.length < 3) return 'Min 3 chars';
    return '';
  };
  const errors = Object.keys(form).reduce((acc, key) => {
    acc[key] = touched[key] ? validate(key, form[key]) : '';
    return acc;
  }, {});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setNftInfo(null);
  };
  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setNftInfo(null);
    setTouched({ id: true, name: true, supplier: true, batch: true, date: true });
    // Validate all fields
    for (const key of Object.keys(form)) {
      if (validate(key, form[key])) {
        setError('All fields are required and must be valid.');
        toast.error('All fields are required and must be valid.');
        return;
      }
    }
    try {
      setLoading(true);
      if (!window.ethereum) {
        setError('MetaMask is required.');
        toast.error('MetaMask is required.');
        return;
      }
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const contract = await getSupplyDNANFTContract();
      // Create NFT metadata
      const metadata = createNFTMetadata({
        id: form.id,
        name: form.name,
        supplier: form.supplier,
        batch: form.batch,
        date: form.date
      });
      // Upload metadata to IPFS
      const metadataURI = await uploadToIPFS(metadata);
      // Register component with NFT
      const tx = await contract.registerComponent(
        form.id, 
        form.name, 
        form.supplier, 
        form.batch, 
        form.date, 
        metadataURI
      );
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      // Get the token ID
      const tokenId = await contract.getTokenId(form.id);
      // Set success state with NFT info
      setSuccess('Component registered successfully with NFT certificate!');
      setNftInfo({
        tokenId: tokenId.toString(),
        metadataURI,
        transactionHash: receipt.hash
      });
      setForm({ id: '', name: '', supplier: '', batch: '', date: '' });
      setTouched({});
      if (onRegisterSuccess) onRegisterSuccess();
      toast.success('Component registered successfully with NFT certificate!');
    } catch (err) {
      setError('Registration failed. ' + (err?.reason || err?.message || err.toString()));
      toast.error('Registration failed. ' + (err?.reason || err?.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="supplydna-card nft-tech code-font" style={{ minWidth: 340, maxWidth: 400 }} onSubmit={handleSubmit} aria-label="Register Component with NFT">
        <div className="supplydna-card-title code-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaDna /> Register Component with NFT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* ID Field */}
          <label htmlFor="id" style={{ fontWeight: 500, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
            Component ID
            <span
              style={{ display: 'inline-flex', alignItems: 'center', position: 'relative' }}
              onMouseEnter={() => setShowTooltip('id')}
              onMouseLeave={() => setShowTooltip('')}
              onFocus={() => setShowTooltip('id')}
              onBlur={() => setShowTooltip('')}
              tabIndex={0}
            >
              <FaInfoCircle style={{ color: '#7F8C8D', cursor: 'pointer' }} aria-label="Component ID info" />
              {showTooltip === 'id' && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: '120%',
                  background: '#fff',
                  color: '#2c3e50',
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  padding: '6px 12px',
                  fontSize: 13,
                  zIndex: 10,
                  whiteSpace: 'normal',
                  boxShadow: '0 2px 8px #0002',
                  maxWidth: 220,
                  overflowWrap: 'break-word'
                }}>
                  Unique identifier for the component (min 3 chars)
                </span>
              )}
            </span>
          </label>
          <input name="id" id="id" value={form.id} onChange={handleChange} onBlur={handleBlur} placeholder="Component ID" className="lookup-input code-font" aria-required="true" aria-invalid={!!errors.id} style={{ outline: errors.id ? '2px solid #E74C3C' : undefined }} />
          {errors.id && <span style={{ color: '#E74C3C', fontSize: 12 }}>{errors.id}</span>}
          {/* Name Field */}
          <label htmlFor="name" style={{ fontWeight: 500, color: '#2c3e50' }}>Name</label>
          <input name="name" id="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="Name" className="lookup-input code-font" aria-required="true" aria-invalid={!!errors.name} style={{ outline: errors.name ? '2px solid #E74C3C' : undefined }} />
          {errors.name && <span style={{ color: '#E74C3C', fontSize: 12 }}>{errors.name}</span>}
          {/* Supplier Field */}
          <label htmlFor="supplier" style={{ fontWeight: 500, color: '#2c3e50' }}>Supplier</label>
          <input name="supplier" id="supplier" value={form.supplier} onChange={handleChange} onBlur={handleBlur} placeholder="Supplier" className="lookup-input code-font" aria-required="true" aria-invalid={!!errors.supplier} style={{ outline: errors.supplier ? '2px solid #E74C3C' : undefined }} />
          {errors.supplier && <span style={{ color: '#E74C3C', fontSize: 12 }}>{errors.supplier}</span>}
          {/* Batch Field */}
          <label htmlFor="batch" style={{ fontWeight: 500, color: '#2c3e50' }}>Batch</label>
          <input name="batch" id="batch" value={form.batch} onChange={handleChange} onBlur={handleBlur} placeholder="Batch" className="lookup-input code-font" aria-required="true" aria-invalid={!!errors.batch} style={{ outline: errors.batch ? '2px solid #E74C3C' : undefined }} />
          {errors.batch && <span style={{ color: '#E74C3C', fontSize: 12 }}>{errors.batch}</span>}
          {/* Date Field */}
          <label htmlFor="date" style={{ fontWeight: 500, color: '#2c3e50' }}>Date</label>
          <input name="date" id="date" value={form.date} onChange={handleChange} onBlur={handleBlur} placeholder="Date" className="lookup-input code-font" type="date" aria-required="true" aria-invalid={!!errors.date} style={{ outline: errors.date ? '2px solid #E74C3C' : undefined }} />
          {errors.date && <span style={{ color: '#E74C3C', fontSize: 12 }}>{errors.date}</span>}
        </div>
        <button type="submit" className="lookup-btn code-font" style={{ marginTop: 18, position: 'relative', minHeight: 38 }} disabled={loading} aria-busy={loading} aria-label="Register with NFT">
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="spinner" style={{ width: 18, height: 18, borderWidth: 3 }} />
              Registering with NFT...
            </span>
          ) : 'Register with NFT'}
        </button>
        {error && (
          <div className="lookup-error" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaExclamationTriangle style={{color:'#E74C3C'}} /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="status-badge success" style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FaCheckCircle style={{color:'#27AE60'}} /> <span>{success}</span>
          </div>
        )}
        {nftInfo && (
          <div style={{ marginTop: 15, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>NFT Created Successfully!</h4>
            <div style={{ fontSize: '0.9em', color: '#495057' }}>
              <p><strong>Token ID:</strong> {nftInfo.tokenId}</p>
              <p><strong>Metadata URI:</strong> {nftInfo.metadataURI}</p>
              <p><strong>Transaction:</strong> {nftInfo.transactionHash.slice(0, 10)}...{nftInfo.transactionHash.slice(-8)}</p>
            </div>
            <div style={{ marginTop: 10, color: '#2c3e50', fontSize: 13 }}>
              You can now view this NFT in the dashboard or traceability view.
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 