import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import './ChatWindow.css';

const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Welcome to the EstatePro AI Concierge. How may I assist your property search today?' }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock API call to LLM backend
    setTimeout(() => {
      let responseText = "I've analyzed our premium inventory and found this match for you.";
      let property = null;

      if (input.toLowerCase().includes('house') || input.toLowerCase().includes('villa')) {
        property = {
          title: 'Majestic Lakefront Villa',
          price: 6750000,
          image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        };
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        type: 'ai', 
        text: responseText,
        property: property
      }]);
    }, 1200);
  };

  const handleQuickAction = (action) => {
    setInput(action);
    // Auto-triggering send for better UX
    setTimeout(() => document.querySelector('.send-trigger').click(), 100);
  };

  return (
    <div className="concierge-float">
      {!isOpen && (
        <div className="concierge-toggle" onClick={() => setIsOpen(true)}>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        </div>
      )}

      {isOpen && (
        <div className="concierge-modal">
          <header className="concierge-header">
            <div className="agent-identity">
              <div className="agent-avatar">EP</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>Concierge AI</div>
                <div style={{ fontSize: '11px', opacity: 0.8, display: 'flex', alignItems: 'center' }}>
                  <span className="online-dot"></span> Online
                </div>
              </div>
            </div>
            <i 
              className="fa-solid fa-chevron-down" 
              style={{ cursor: 'pointer', opacity: 0.7 }}
              onClick={() => setIsOpen(false)}
            ></i>
          </header>

          <div className="concierge-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`bubble ${msg.type === 'ai' ? 'ai-bubble' : 'user-bubble'}`}>
                {msg.text}
                {msg.property && <PropertyCard property={msg.property} />}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <footer className="concierge-footer">
            <div className="action-row">
              {["Book Viewing", "Check Credit", "Talk to Agent"].map((action, i) => (
                <button key={i} className="chip" onClick={() => handleQuickAction(action)}>{action}</button>
              ))}
            </div>
            <form className="input-row" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Type your message..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" className="send-trigger">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
