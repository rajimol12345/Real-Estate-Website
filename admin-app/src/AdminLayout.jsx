import React, { useState } from 'react';
import Analytics from './components/Analytics';
import LiveInquiries from './components/LiveInquiries';
import KnowledgeBase from './components/KnowledgeBase';
import './Admin.css';

const AdminLayout = () => {
  const [view, setView] = useState('DASHBOARD');

  const renderContent = () => {
    switch(view) {
      case 'DASHBOARD': return (
        <>
          <Analytics />
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '48px 0 24px', letterSpacing: '-0.5px' }}>LIVE CHAT ACTIVITY</h3>
          <LiveInquiries />
        </>
      );
      case 'INQUIRIES': return <LiveInquiries />;
      case 'KNOWLEDGE': return <KnowledgeBase />;
      default: return <Analytics />;
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-aside">
        <div className="brand-area">
          <div className="brand-dot"></div>
          <div className="brand-name">estatePRO</div>
        </div>

        <nav className="admin-nav">
          <div 
            className={`admin-nav-link ${view === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => setView('DASHBOARD')}
          >
            <i className="fa-solid fa-grid-2"></i> DASHBOARD
          </div>
          <div 
            className={`admin-nav-link ${view === 'INQUIRIES' ? 'active' : ''}`}
            onClick={() => setView('INQUIRIES')}
          >
            <i className="fa-solid fa-comments"></i> LIVE CHATS
          </div>
          <div 
            className={`admin-nav-link ${view === 'LEADS' ? 'active' : ''}`}
            onClick={() => setView('LEADS')}
          >
            <i className="fa-solid fa-users"></i> CAPTURED LEADS
          </div>
          <div 
            className={`admin-nav-link ${view === 'KNOWLEDGE' ? 'active' : ''}`}
            onClick={() => setView('KNOWLEDGE')}
          >
            <i className="fa-solid fa-brain"></i> KNOWLEDGE BASE
          </div>
          <div 
            className={`admin-nav-link ${view === 'ANALYTICS' ? 'active' : ''}`}
            onClick={() => setView('ANALYTICS')}
          >
            <i className="fa-solid fa-chart-line"></i> ANALYTICS
          </div>
        </nav>

        <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>ADMIN PROFILE</div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Senior Agent #402</div>
        </div>
      </aside>

      <main className="admin-viewport">
        <header className="viewport-header">
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#c5a059', marginBottom: '8px' }}>ESTATEPRO CONCIERGE MANAGEMENT</div>
            <h1>{view}</h1>
          </div>
          <div style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
