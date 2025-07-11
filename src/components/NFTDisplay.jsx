import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaCopy, FaCheck } from 'react-icons/fa6';
import { getFromIPFS } from '../services/ipfs';

export default function NFTDisplay({ component, tokenId, network = process.env.REACT_APP_NETWORK || 'polygon' }) {
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (component && component.metadataURI) {
      fetchMetadata();
    }
  }, [component]);

  const fetchMetadata = async () => {
    if (!component?.metadataURI) return;
    
    setLoading(true);
    setError('');
    
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="supplydna-card">
      <div className="supplydna-card-title">NFT Certificate</div>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          <p style={{ marginTop: '10px', color: '#7F8C8D' }}>Loading NFT metadata...</p>
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#fdf2f2', borderRadius: '8px', margin: '10px 0' }}>
          <p style={{ color: '#e74c3c', margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {metadata && (
        <div className="nft-display">
          {/* NFT Image */}
          <div className="nft-image-container">
            <img 
              src={metadata.image} 
              alt={metadata.name}
              className="nft-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/400x400/3498db/ffffff?text=SupplyDNA+Component";
              }}
            />
          </div>

          {/* NFT Details */}
          <div className="nft-details">
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{metadata.name}</h3>
            <p style={{ color: '#7F8C8D', margin: '0 0 15px 0' }}>{metadata.description}</p>

            {/* Token ID */}
            <div className="nft-info-row">
              <span className="nft-label">Token ID:</span>
              <div className="nft-value-container">
                <span className="nft-value">{tokenId}</span>
                <button 
                  onClick={() => copyToClipboard(tokenId.toString())}
                  className="copy-btn"
                  title="Copy Token ID"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>

            {/* Contract Address */}
            <div className="nft-info-row">
              <span className="nft-label">Contract:</span>
              <div className="nft-value-container">
                <span className="nft-value" style={{ fontSize: '0.8em' }}>
                  {process.env.REACT_APP_CONTRACT_ADDRESS?.slice(0, 6)}...{process.env.REACT_APP_CONTRACT_ADDRESS?.slice(-4)}
                </span>
                <button 
                  onClick={() => copyToClipboard(process.env.REACT_APP_CONTRACT_ADDRESS)}
                  className="copy-btn"
                  title="Copy Contract Address"
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            </div>

            {/* Attributes */}
            {metadata.attributes && (
              <div className="nft-attributes">
                <h4 style={{ margin: '15px 0 10px 0', color: '#2c3e50' }}>Attributes</h4>
                <div className="attributes-grid">
                  {metadata.attributes.map((attr, index) => (
                    <div key={index} className="attribute-item">
                      <span className="attribute-type">{attr.trait_type}</span>
                      <span className="attribute-value">{attr.value}</span>
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
                className="explorer-link"
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