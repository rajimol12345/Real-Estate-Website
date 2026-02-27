import React from 'react';

const KnowledgeBase = () => {
  return (
    <div className="kb-container">
      <div className="upload-zone">
        <i className="fa-solid fa-arrow-up-from-bracket" style={{ fontSize: '48px', color: '#c5a059', marginBottom: '24px' }}></i>
        <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Training Data Hub</h2>
        <p style={{ color: '#64748b', fontSize: '15px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Upload property inventories, localized market reports, or agent FAQs to refine the Concierge AI's context.
        </p>
        <button className="admin-nav-link active" style={{ margin: '0 auto', padding: '12px 32px' }}>
          UPLOAD DOCUMENTATION
        </button>
      </div>

      <div style={{ marginTop: '48px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Active Context Sources</h3>
        <div className="table-wrap">
          <table className="luxury-table">
            <thead>
              <tr>
                <th>FILE NAME</th>
                <th>TYPE</th>
                <th>LAST SYNCED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Q1_Luxury_Market_Report.pdf', type: 'Market Data', date: '2 hours ago' },
                { name: 'Beverly_Hills_Inventory.csv', type: 'Inventory', date: '5 mins ago' },
                { name: 'Agent_Script_v4.docx', type: 'Logic/FAQ', date: 'Yesterday' }
              ].map((file, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{file.name}</td>
                  <td>{file.type}</td>
                  <td>{file.date}</td>
                  <td><span style={{ color: '#10b981', fontWeight: 700 }}>● SYNCED</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
