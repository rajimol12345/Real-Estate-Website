import React, { useState, useEffect } from 'react';
import { chatService, leadService } from '../services/api';
import { MessageSquare, User, Calendar, Trash2, ChevronRight, Search, Loader, Sparkles } from 'lucide-react';
import './ManageAIChats.css';

const ManageAIChats = () => {
    const [leads, setLeads] = useState([]);
    const [selectedLead, setSelectedLead] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await leadService.getAll({ source: 'Chatbot' });
            setLeads(res.data.leads || res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching chatbot leads:", error);
            setLoading(false);
        }
    };

    const fetchChatHistory = async (email) => {
        setLoadingChat(true);
        try {
            // Using email as threadId for now or we could store threadId in Lead
            const res = await chatService.getHistory(email);
            setChatHistory(res.data);
            setLoadingChat(false);
        } catch (error) {
            console.error("Error fetching chat history:", error);
            setLoadingChat(false);
        }
    };

    const handleSelectLead = (lead) => {
        setSelectedLead(lead);
        fetchChatHistory(lead.email);
    };

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-5 text-center"><Loader className="spin" /></div>;

    return (
        <div className="ai-chats-page">
            <div className="sidebar-list glass-panel">
                <div className="sidebar-header">
                    <h3>AI Interactions</h3>
                    <div className="search-box">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="leads-list">
                    {filteredLeads.map(lead => (
                        <div
                            key={lead._id}
                            className={`lead-item ${selectedLead?._id === lead._id ? 'active' : ''}`}
                            onClick={() => handleSelectLead(lead)}
                        >
                            <div className="lead-avatar">{lead.name[0]}</div>
                            <div className="lead-info">
                                <h4>{lead.name}</h4>
                                <p>{lead.intent || 'Browsing'}</p>
                            </div>
                            <ChevronRight size={16} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="chat-viewer glass-panel">
                {selectedLead ? (
                    <>
                        <div className="viewer-header">
                            <div className="d-flex align-items-center gap-3">
                                <div className="lead-avatar large">{selectedLead.name[0]}</div>
                                <div>
                                    <h3>{selectedLead.name}</h3>
                                    <p className="small text-muted mb-0">{selectedLead.email} • {selectedLead.phone || 'No phone'}</p>
                                </div>
                            </div>
                            <div className="intent-tag">{selectedLead.intent}</div>
                        </div>

                        <div className="chat-messages-container">
                            {loadingChat ? (
                                <div className="p-5 text-center"><Loader className="spin" /></div>
                            ) : chatHistory.length > 0 ? (
                                chatHistory.map((msg, idx) => (
                                    <div key={msg._id || idx} className={`admin-msg-row ${msg.sender}`}>
                                        <div className="admin-msg-bubble">
                                            {msg.sender === 'bot' && <Sparkles size={14} className="bot-icon" />}
                                            <p>{msg.content}</p>
                                            <span className="msg-ts">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-chat text-center p-5">
                                    <MessageSquare size={48} className="text-muted mb-3" />
                                    <p className="text-muted">No messages found for this thread.</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="no-selection text-center p-5">
                        <MessageSquare size={64} className="text-muted mb-3" />
                        <h3>Select a conversation</h3>
                        <p className="text-muted">Choose a lead from the left to view their conversation with the AI.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageAIChats;
