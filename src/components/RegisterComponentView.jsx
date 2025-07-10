import React from 'react';
import { FaDna, FaTriangleExclamation, FaCircleCheck } from 'react-icons/fa6';
import { BrowserProvider, Contract } from 'ethers';

const abi = [
  'function components(string) view returns (string id, string name, string supplier, string batch, string date)',
  'function registerComponent(string id, string name, string supplier, string batch, string date)'
];
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function RegisterComponentView({ onRegisterSuccess }) {
  const [form, setForm] = React.useState({ id: '', name: '', supplier: '', batch: '', date: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.password !== 'password') {
      setError('Incorrect password.');
      return;
    }
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
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      const tx = await contract.registerComponent(form.id, form.name, form.supplier, form.batch, form.date);
      await tx.wait();
      setSuccess('Component registered successfully!');
      setForm({ id: '', name: '', supplier: '', batch: '', date: '', password: '' });
      if (onRegisterSuccess) onRegisterSuccess();
    } catch (err) {
      setError('Registration failed. ' + (err?.reason || err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form className="supplydna-card" style={{ minWidth: 340, maxWidth: 400 }} onSubmit={handleSubmit}>
        <div className="supplydna-card-title"><FaDna /> Register Component</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input name="id" value={form.id} onChange={handleChange} placeholder="Component ID" className="lookup-input" />
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="lookup-input" />
          <input name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier" className="lookup-input" />
          <input name="batch" value={form.batch} onChange={handleChange} placeholder="Batch" className="lookup-input" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="lookup-input" type="date" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" className="lookup-input" type="password" />
        </div>
        <button type="submit" className="lookup-btn" style={{ marginTop: 18 }} disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        {error && <div className="lookup-error" style={{ marginTop: 10 }}><FaTriangleExclamation style={{color:'#E74C3C'}} /> {error}</div>}
        {success && <div className="status-badge success" style={{ marginTop: 10 }}><FaCircleCheck style={{color:'#27AE60'}} /> {success}</div>}
      </form>
    </div>
  );
} 