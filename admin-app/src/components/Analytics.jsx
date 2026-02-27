import React from 'react';

const Analytics = () => {
  return (
    <div className="stat-grid">
      <div className="card">
        <div className="stat-header">Total Leads</div>
        <div className="stat-number">2,482</div>
        <div style={{ color: '#10b981', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>+18.4% vs last month</div>
      </div>
      <div className="card">
        <div className="stat-header">AI Resolution Rate</div>
        <div className="stat-number">92.6%</div>
        <div style={{ color: '#10b981', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>+4.2% since V3 update</div>
      </div>
      <div className="card">
        <div className="stat-header">Active Sessions</div>
        <div className="stat-number">14</div>
        <div style={{ color: '#64748b', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>Real-time Concierge activity</div>
      </div>
    </div>
  );
};

export default Analytics;
