import React, { useState } from 'react';
import { FaDna, FaShieldAlt, FaChartLine, FaQrcode, FaSearch, FaRocket, FaUsers, FaGlobe, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { MdSecurity, MdVerified, MdAnalytics } from 'react-icons/md';

export default function HomeView({ onNavigate }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaDna className="feature-icon" />,
      title: "Component Registration",
      description: "Register supply chain components with blockchain-verified NFTs for tamper-proof traceability.",
      color: "#3498DB"
    },
    {
      icon: <FaQrcode className="feature-icon" />,
      title: "QR Code Scanning",
      description: "Instantly scan QR codes to retrieve component details and verify authenticity.",
      color: "#2ECC71"
    },
    {
      icon: <FaSearch className="feature-icon" />,
      title: "Real-time Lookup",
      description: "Search components by UUID to access complete lifecycle and verification data.",
      color: "#F39C12"
    },
    {
      icon: <MdAnalytics className="feature-icon" />,
      title: "Analytics Dashboard",
      description: "Advanced analytics and insights for supply chain optimization and compliance.",
      color: "#9B59B6"
    }
  ];

  const stats = [
    { number: "10K+", label: "Components Tracked" },
    { number: "99.9%", label: "Uptime" },
    { number: "50+", label: "Suppliers" },
    { number: "24/7", label: "Monitoring" }
  ];

  const benefits = [
    {
      icon: <MdSecurity />,
      title: "Blockchain Security",
      description: "Immutable records on Polygon blockchain ensure data integrity and prevent tampering."
    },
    {
      icon: <MdVerified />,
      title: "NFT Verification",
      description: "Each component gets a unique, non-transferable NFT certificate for authenticity."
    },
    {
      icon: <FaGlobe />,
      title: "Global Traceability",
      description: "Track components across the entire supply chain with real-time visibility."
    },
    {
      icon: <FaUsers />,
      title: "Multi-stakeholder Access",
      description: "Secure access for suppliers, manufacturers, and customers with role-based permissions."
    }
  ];

  return (
    <div className="home-view">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Supply Chain</span>
              <span className="hero-title-accent">DNA Tracker</span>
            </h1>
            <p className="hero-subtitle">
              The most trusted platform for blockchain-verified supply chain traceability. 
              Register, track, and verify components with NFT-backed authenticity.
            </p>
            <div className="hero-actions">
              <button 
                className="cta-primary"
                onClick={() => onNavigate && onNavigate('Register')}
              >
                <FaRocket className="cta-icon" />
                Get Started
                <FaArrowRight className="cta-arrow" />
              </button>
              <button 
                className="cta-secondary"
                onClick={() => onNavigate && onNavigate('Dashboard')}
              >
                <FaSearch className="cta-icon" />
                Lookup Component
              </button>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <FaDna className="card-icon" />
                <span className="card-title">Component NFT</span>
              </div>
              <div className="card-content">
                <div className="nft-preview">
                  <div className="nft-image">
                    <FaDna className="nft-icon" />
                  </div>
                  <div className="nft-details">
                    <div className="nft-id">COMP-XYZ-789</div>
                    <div className="nft-status">Verified ✓</div>
                  </div>
                </div>
                <div className="card-attributes">
                  <div className="attribute">
                    <span className="attr-label">Supplier:</span>
                    <span className="attr-value">Acme Corp</span>
                  </div>
                  <div className="attribute">
                    <span className="attr-label">Batch:</span>
                    <span className="attr-value">B2024-001</span>
                  </div>
                  <div className="attribute">
                    <span className="attr-label">Status:</span>
                    <span className="attr-value verified">In Transit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose Supply DNA Tracker?</h2>
          <p className="section-subtitle">
            Built for modern supply chains that demand transparency, security, and efficiency.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
              style={{ '--feature-color': feature.color }}
            >
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-header">
          <h2 className="section-title">Trusted by Industry Leaders</h2>
          <p className="section-subtitle">
            Join thousands of companies using blockchain technology to secure their supply chains.
          </p>
        </div>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                {benefit.icon}
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Secure Your Supply Chain?</h2>
          <p className="cta-subtitle">
            Start tracking your components with blockchain-verified NFTs today.
          </p>
          <div className="cta-actions">
            <button 
              className="cta-primary large"
              onClick={() => onNavigate && onNavigate('Register')}
            >
              <FaRocket className="cta-icon" />
              Start Free Trial
              <FaArrowRight className="cta-arrow" />
            </button>
            <button 
              className="cta-secondary large"
              onClick={() => onNavigate && onNavigate('Dashboard')}
            >
              <FaSearch className="cta-icon" />
              Demo Lookup
            </button>
          </div>
        </div>
      </section>
    </div>
  );
} 