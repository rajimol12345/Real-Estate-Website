import React from 'react';

const LiveInquiries = () => {
  const data = [
    { id: 1, name: "Alexander Wright", intent: "Buying", budget: "$4.5M", status: "AI Handling" },
    { id: 2, name: "Sophia Loren", intent: "Renting", budget: "$12k/mo", status: "AI Handling" },
    { id: 3, name: "Marcus Aurelius", intent: "Investing", budget: "$15M+", status: "Needs Agent" },
    { id: 4, name: "Isabella Swan", intent: "Buying", budget: "$2.1M", status: "Handled" },
  ];

  return (
    <div className="table-wrap">
      <table className="luxury-table">
        <thead>
          <tr>
            <th>CLIENT NAME</th>
            <th>INTENT</th>
            <th>BUDGET</th>
            <th>CURRENT STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td style={{ fontWeight: 600 }}>{item.name}</td>
              <td>
                <span className={`pill ${item.intent === 'Buying' ? 'pill-buy' : 'pill-rent'}`}>
                  {item.intent}
                </span>
              </td>
              <td>{item.budget}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, background: item.status === 'Needs Agent' ? '#ef4444' : '#10b981', borderRadius: '50%' }}></span>
                  {item.status}
                </div>
              </td>
              <td>
                <button style={{ background: 'none', border: 'none', color: '#c5a059', fontWeight: 700, cursor: 'pointer', fontSize: '12px' }}>
                  MONITOR CHAT
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveInquiries;
