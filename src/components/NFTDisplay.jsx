import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaCopy, FaCheck, FaDna, FaTruck, FaMicroscope, FaChartLine, FaUser } from 'react-icons/fa';
import { FaRedo } from 'react-icons/fa';
import { getFromIPFS } from '../services/ipfs';

// Helper: pick a random icon based on component id
const iconList = [FaDna, FaTruck, FaMicroscope, FaChartLine, FaUser];
const iconColors = ['#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#E67E22'];
function getRandomIcon(id) {
  if (!id) return { Icon: FaDna, color: '#3498DB' };
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const idx = Math.abs(hash) % iconList.length;
  return { Icon: iconList[idx], color: iconColors[idx] };
}

export default function NFTDisplay({ component, tokenId, network = process.env.REACT_APP_NETWORK || 'polygon' }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(''); // '' | 'token' | 'contract'
  const [showTooltip, setShowTooltip] = useState(''); // '' | 'token' | 'contract'

  useEffect(() => {
    if (component && component.metadataURI) {
      fetchMetadata();
    }
    // eslint-disable-next-line
  }, [component]);

  const fetchMetadata = async () => {
    if (!component?.metadataURI) return;
    setLoading(true);
    setError('');
    setMetadata(null);
    try {
      const data = await getFromIPFS(component.metadataURI);
      setMetadata(data);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
      setError('Failed to load NFT metadata');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const getExplorerUrl = () => {
    const baseUrls = {
      ethereum: 'https://etherscan.io',
      polygon: 'https://polygonscan.com',
      polygon_mumbai: 'https://mumbai.polygonscan.com',
      polygon_amoy: 'https://amoy.polygonscan.com',
      bsc: 'https://bscscan.com',
      sepolia: 'https://sepolia.etherscan.io'
    };
    const baseUrl = baseUrls[network] || baseUrls.polygon;
    return `${baseUrl}/token/${process.env.REACT_APP_CONTRACT_ADDRESS}?a=${tokenId}`;
  };

  if (!component) {
    return (
      <div className="supplydna-card">
        <div className="supplydna-card-title">NFT Certificate</div>
        <p style={{ color: '#7F8C8D', textAlign: 'center' }}>No component selected</p>
      </div>
    );
  }

  const PLACEHOLDER_URL = 'https://via.placeholder.com/400x400/3498db/ffffff?text=SupplyDNA+Component';

  return (
    <div className="supplydna-card nft-tech" aria-label="NFT Certificate">
      <div className="supplydna-card-title">NFT Certificate</div>
      {/* Skeleton Loader */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }} aria-busy="true" aria-live="polite">
          <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto' }}></div>
          <div style={{ margin: '20px auto 0 auto', maxWidth: 320 }}>
            <div style={{ height: 24, background: '#f0f0f0', borderRadius: 6, marginBottom: 12, width: '60%' }} />
            <div style={{ height: 16, background: '#f0f0f0', borderRadius: 6, marginBottom: 8, width: '80%' }} />
            <div style={{ height: 16, background: '#f0f0f0', borderRadius: 6, marginBottom: 8, width: '70%' }} />
            <div style={{ height: 32, background: '#f0f0f0', borderRadius: 6, marginBottom: 8, width: '100%' }} />
          </div>
          <p style={{ marginTop: '10px', color: '#7F8C8D' }}>Loading NFT metadata...</p>
        </div>
      )}
      {/* Error State with Retry */}
      {error && !loading && (
        <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderRadius: '8px', margin: '10px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <p style={{ color: '#e74c3c', margin: 0, flex: 1 }}>⚠️ {error}</p>
          <button
            onClick={fetchMetadata}
            aria-label="Retry loading NFT metadata"
            style={{ background: '#fff', border: '1px solid #e74c3c', borderRadius: 6, padding: '4px 12px', color: '#e74c3c', cursor: 'pointer', fontWeight: 500 }}
          >
            <FaRedo style={{ marginRight: 4 }} /> Retry
          </button>
        </div>
      )}
      {/* NFT Details */}
      {metadata && !loading && !error && (
        <div className="nft-display">
          {/* NFT Image */}
          <div className="nft-image-container">
            {metadata.image && metadata.image !== PLACEHOLDER_URL ? (
              <img 
                src={metadata.image} 
                alt={metadata.name}
                className="nft-image"
                onError={(e) => { e.target.onerror = null; e.target.src = ''; }}
              />
            ) : (
              // Random icon avatar as placeholder
              (() => {
                const { Icon, color } = getRandomIcon(component?.id || tokenId || '');
                return (
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: color + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto', boxShadow: '0 2px 12px rgba(44,62,80,0.10)'
                  }}>
                    <Icon style={{ fontSize: 64, color }} />
                  </div>
                );
              })()
            )}
          </div>
          {/* NFT Details */}
          <div className="nft-details">
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{metadata.name}</h3>
            <p style={{ color: '#7F8C8D', margin: '0 0 15px 0' }}>{metadata.description}</p>
            {/* Token ID */}
            <div className="nft-info-row">
              <span className="nft-label code-font">Token ID:</span>
              <div className="nft-value-container">
                <span className="nft-value code-font" tabIndex={0} aria-label={`Token ID: ${tokenId}`}>{tokenId}</span>
                <button 
                  onClick={() => copyToClipboard(tokenId.toString(), 'token')}
                  className="copy-btn"
                  title="Copy Token ID"
                  aria-label="Copy Token ID"
                  tabIndex={0}
                  onFocus={() => setShowTooltip('token')}
                  onBlur={() => setShowTooltip('')}
                  onMouseEnter={() => setShowTooltip('token')}
                  onMouseLeave={() => setShowTooltip('')}
                  style={{ outline: copied === 'token' ? '2px solid #2ECC71' : undefined }}
                >
                  {copied === 'token' ? <FaCheck /> : <FaCopy />}
                </button>
                {showTooltip === 'token' && (
                  <span style={{ position: 'absolute', background: '#fff', color: '#2c3e50', border: '1px solid #ccc', borderRadius: 4, padding: '2px 8px', fontSize: 12, marginLeft: 8, zIndex: 10 }}>
                    {copied === 'token' ? 'Copied!' : 'Copy Token ID'}
                  </span>
                )}
              </div>
            </div>
            {/* Contract Address */}
            <div className="nft-info-row">
              <span className="nft-label code-font">Contract:</span>
              <div className="nft-value-container">
                <span className="nft-value code-font" style={{ fontSize: '0.8em' }} tabIndex={0} aria-label={`Contract address: ${process.env.REACT_APP_CONTRACT_ADDRESS}`}>
                  {process.env.REACT_APP_CONTRACT_ADDRESS?.slice(0, 6)}...{process.env.REACT_APP_CONTRACT_ADDRESS?.slice(-4)}
                </span>
                <button 
                  onClick={() => copyToClipboard(process.env.REACT_APP_CONTRACT_ADDRESS, 'contract')}
                  className="copy-btn"
                  title="Copy Contract Address"
                  aria-label="Copy Contract Address"
                  tabIndex={0}
                  onFocus={() => setShowTooltip('contract')}
                  onBlur={() => setShowTooltip('')}
                  onMouseEnter={() => setShowTooltip('contract')}
                  onMouseLeave={() => setShowTooltip('')}
                  style={{ outline: copied === 'contract' ? '2px solid #2ECC71' : undefined }}
                >
                  {copied === 'contract' ? <FaCheck /> : <FaCopy />}
                </button>
                {showTooltip === 'contract' && (
                  <span style={{ position: 'absolute', background: '#fff', color: '#2c3e50', border: '1px solid #ccc', borderRadius: 4, padding: '2px 8px', fontSize: 12, marginLeft: 8, zIndex: 10 }}>
                    {copied === 'contract' ? 'Copied!' : 'Copy Contract Address'}
                  </span>
                )}
              </div>
            </div>
            {/* Attributes */}
            {metadata.attributes && (
              <div className="nft-attributes">
                <h4 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>Attributes</h4>
                <div className="attributes-grid">
                  {metadata.attributes.map((attr, index) => (
                    <div key={index} className="attribute-item" tabIndex={0} aria-label={`${attr.trait_type}: ${attr.value}`}
                      title={attr.trait_type}>
                      <span className="attribute-type code-font">{attr.trait_type}</span>
                      <span className="attribute-value code-font">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Blockchain Explorer Link */}
            <div style={{ marginTop: '20px' }}>
              <a 
                href={getExplorerUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="explorer-link code-font"
                aria-label="View on Blockchain Explorer"
              >
                <FaExternalLinkAlt /> View on Blockchain Explorer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 