import React, { useState, useEffect } from 'react';
import { FaGear } from 'react-icons/fa6';
import { FaMoon, FaSun, FaLanguage, FaExclamationTriangle, FaUserCircle } from 'react-icons/fa';
import { FaSave, FaEdit } from 'react-icons/fa';
import { FaBell, FaEnvelope } from 'react-icons/fa';

const greetings = {
  en: 'Hello',
  es: 'Hola',
  fr: 'Bonjour',
  de: 'Hallo',
};

export default function SettingsView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Load theme from localStorage or default to light
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState('en');
  // Notification preferences
  const [emailNotif, setEmailNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);
  // Profile editing
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({ name: 'Jane Doe', email: 'jane@example.com' });
  const [profileDraft, setProfileDraft] = useState(profile);

  // Apply theme to document body and persist in localStorage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Example: change greeting based on language
  const greeting = greetings[language] || greetings.en;

  const handleThemeToggle = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const handleLanguageChange = (e) => setLanguage(e.target.value);

  // Profile editing handlers
  const handleProfileEdit = () => {
    setProfileDraft(profile);
    setEditProfile(true);
  };
  const handleProfileSave = () => {
    setProfile(profileDraft);
    setEditProfile(false);
  };
  const handleProfileChange = (e) => {
    setProfileDraft({ ...profileDraft, [e.target.name]: e.target.value });
  };

  return (
    <div className="supplydna-dashboard" style={{ minHeight: 400 }} aria-label="Settings Dashboard">
      <div className="supplydna-card nft-tech code-font" style={{ minWidth: 320, marginBottom: 24 }}>
        <div className="supplydna-card-title code-font" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaGear /> Settings
        </div>
        <p style={{ color: '#7F8C8D', marginBottom: 0 }}>Manage your account, preferences, and system settings here.</p>
      </div>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <div className="spinner" aria-label="Loading settings" />
        </div>
      ) : error ? (
        <div style={{ color: '#E74C3C', display: 'flex', alignItems: 'center', gap: 8, minHeight: 120 }}>
          <FaExclamationTriangle style={{ fontSize: '1.5em' }} />
          <span>{error}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 420 }}>
          {/* Profile Section */}
          <section style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, transition: 'background 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <FaUserCircle style={{ fontSize: 38, color: '#3498DB' }} />
              <div style={{ flex: 1 }}>
                {editProfile ? (
                  <>
                    <input
                      name="name"
                      value={profileDraft.name}
                      onChange={handleProfileChange}
                      style={{ fontWeight: 700, fontSize: 18, marginBottom: 4, borderRadius: 6, border: '1px solid #ccc', padding: '4px 8px', width: '100%' }}
                      aria-label="Edit name"
                    />
                    <input
                      name="email"
                      value={profileDraft.email}
                      onChange={handleProfileChange}
                      style={{ color: '#7F8C8D', fontSize: 14, borderRadius: 6, border: '1px solid #ccc', padding: '4px 8px', width: '100%' }}
                      aria-label="Edit email"
                    />
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{profile.name}</div>
                    <div style={{ color: '#7F8C8D', fontSize: 14 }}>{profile.email}</div>
                  </>
                )}
                <div style={{ color: '#2c3e50', fontSize: 15, marginTop: 4 }}>{greeting}, {profile.name}!</div>
              </div>
              {editProfile ? (
                <button
                  className="lookup-btn"
                  style={{ padding: '6px 14px', borderRadius: 6, fontSize: 15, marginLeft: 8, background: '#2ECC71', color: '#fff', border: 'none', transition: 'background 0.2s' }}
                  onClick={handleProfileSave}
                  aria-label="Save profile"
                >
                  <FaSave style={{ marginRight: 4 }} /> Save
                </button>
              ) : (
                <button
                  className="lookup-btn"
                  style={{ padding: '6px 14px', borderRadius: 6, fontSize: 15, marginLeft: 8, background: '#3498DB', color: '#fff', border: 'none', transition: 'background 0.2s' }}
                  onClick={handleProfileEdit}
                  aria-label="Edit profile"
                >
                  <FaEdit style={{ marginRight: 4 }} /> Edit
                </button>
              )}
            </div>
          </section>
          {/* Preferences Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18, transition: 'background 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 500, color: '#2c3e50' }}>Theme</span>
              <button
                className="lookup-btn"
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme === 'dark' ? '#2c3e50' : '#fff', color: theme === 'dark' ? '#fff' : '#2c3e50', border: '1px solid #3498DB', borderRadius: 6, padding: '6px 18px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s, color 0.2s' }}
                onClick={handleThemeToggle}
                aria-label="Toggle dark/light theme"
              >
                {theme === 'dark' ? <FaMoon /> : <FaSun />} {theme === 'dark' ? 'Dark' : 'Light'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontWeight: 500, color: '#2c3e50' }}>Language</span>
              <FaLanguage style={{ fontSize: 18, color: '#3498DB' }} />
              <select
                value={language}
                onChange={handleLanguageChange}
                style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #ccc', fontSize: 15 }}
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </section>
          {/* Notification Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 18, background: '#f8f9fa', borderRadius: 8, padding: 16, transition: 'background 0.3s' }}>
            <div style={{ fontWeight: 600, color: '#2c3e50', marginBottom: 6, fontSize: 16 }}>Notifications</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <FaEnvelope style={{ color: '#3498DB', fontSize: 18 }} />
              <span style={{ flex: 1 }}>Email Notifications</span>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={() => setEmailNotif(v => !v)}
                  style={{ accentColor: '#3498DB', width: 18, height: 18 }}
                  aria-label="Toggle email notifications"
                />
                <span style={{ fontSize: 15 }}>{emailNotif ? 'On' : 'Off'}</span>
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <FaBell style={{ color: '#3498DB', fontSize: 18 }} />
              <span style={{ flex: 1 }}>In-App Notifications</span>
              <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: 6 }}>
                <input
                  type="checkbox"
                  checked={inAppNotif}
                  onChange={() => setInAppNotif(v => !v)}
                  style={{ accentColor: '#3498DB', width: 18, height: 18 }}
                  aria-label="Toggle in-app notifications"
                />
                <span style={{ fontSize: 15 }}>{inAppNotif ? 'On' : 'Off'}</span>
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  );
} 