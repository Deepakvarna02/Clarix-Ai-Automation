import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    // Initialize analytics, tracking, etc.
    initializeAnalytics();
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
  };

  const initializeAnalytics = () => {
    // Add Google Analytics or other tracking scripts here
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      width: '380px',
      borderRadius: '50%',
      backgroundColor: '#1d1d1f',
      border: '1.5px solid rgba(0, 200, 255, 0.3)',
      padding: '2rem',
      zIndex: 8000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 200, 255, 0.1)',
      textAlign: 'center',
      animation: 'floatUp 5s ease-in-out infinite'
    }}>
      <div>
        <p style={{
          color: '#f5f5f7',
          fontSize: '0.85rem',
          margin: 0,
          lineHeight: 1.5,
          fontWeight: 500
        }}>
          We use cookies to enhance your experience. 
          <a href="/privacy" style={{ color: '#00c8ff', textDecoration: 'none', display: 'block', marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Learn more
          </a>
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center' }}>
        <button
          onClick={handleReject}
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: '#f5f5f7',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.45rem 0.9rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.3s',
            minWidth: '70px'
          }}
          onMouseOver={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.12)';
            e.target.style.borderColor = 'rgba(255,255,255,0.25)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.08)';
            e.target.style.borderColor = 'rgba(255,255,255,0.15)';
          }}
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          style={{
            background: 'linear-gradient(135deg, #00c8ff, #0080ff)',
            color: '#0a0a0a',
            border: 'none',
            padding: '0.45rem 0.9rem',
            borderRadius: '50px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.3s',
            minWidth: '70px',
            boxShadow: '0 4px 15px rgba(0, 200, 255, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 200, 255, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 200, 255, 0.3)';
          }}
        >
          Accept All
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
