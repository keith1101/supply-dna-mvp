import React from 'react';
import { FaDna, FaTriangleExclamation, FaCircleCheck } from 'react-icons/fa6';
import { BrowserProvider, Contract } from 'ethers';
import { uploadToIPFS, createNFTMetadata } from '../services/ipfs';
import { getSupplyDNANFTContract } from '../services/contract';

export default function RegisterComponentView({ onRegisterSuccess }) {
  const [form, setForm] = React.useState({ id: '', name: '', supplier: '', batch: '', date: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [nftInfo, setNftInfo] = React.useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
    setNftInfo(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setNftInfo(null);
    
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
      console.log('Uploading metadata to IPFS...');
      const metadataURI = await uploadToIPFS(metadata);
      console.log('Metadata uploaded:', metadataURI);

      // Register component with NFT
      console.log('Registering component with NFT...');
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
      console.log('Transaction confirmed:', receipt);

      // Get the token ID
      const tokenId = await contract.getTokenId(form.id);
      console.log('NFT Token ID:', tokenId.toString());

      // Set success state with NFT info
      setSuccess('Component registered successfully with NFT certificate!');
      setNftInfo({
        tokenId: tokenId.toString(),
        metadataURI,
        transactionHash: receipt.hash
      });

      // Reset form
      setForm({ id: '', name: '', supplier: '', batch: '', date: '' });
      
      if (onRegisterSuccess) onRegisterSuccess();
      
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed. ' + (err?.reason || err?.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="supplydna-card" style={{ minWidth: 340, maxWidth: 400 }} onSubmit={handleSubmit}>
        <div className="supplydna-card-title"><FaDna /> Register Component with NFT</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="id" value={form.id} onChange={handleChange} placeholder="Component ID" className="lookup-input" />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="lookup-input" />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier" className="lookup-input" />
          <input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch" className="lookup-input" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="lookup-input" type="date" />
        </div>
        <button type="submit" className="lookup-btn" style={{ marginTop: 18 }} disabled={loading}>
          {loading ? 'Registering with NFT...' : 'Register with NFT'}
        </button>
        
        {error && (
          <div className="lookup-error" style={{ marginTop: 10 }}>
            <FaTriangleExclamation style={{color:'#E74C3C'}} /> {error}
          </div>
        )}
        
        {success && (
          <div className="status-badge success" style={{ marginTop: 10 }}>
            <FaCircleCheck style={{color:'#27AE60'}} /> {success}
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
          </div>
        )}
      </form>
    </div>
  );
} 