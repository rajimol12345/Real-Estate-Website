import React, { useState, useEffect, useRef } from 'react';
import { chatService, appointmentService } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import './ChatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [threadId] = useState(() => Math.random().toString(36).substring(7));
    const [showBooking, setShowBooking] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [bookingDetails, setBookingDetails] = useState({ date: '', timeSlot: '' });
    const [suggestedActions, setSuggestedActions] = useState(["Buy Property", "Rent Property", "Contact Agent"]);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                id: 'welcome',
                text: "Welcome to EstatePro. I am your AI concierge. How may I assist you with your property journey today?",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, suggestedActions]);

    const handleSendMessage = async (e, textOverride = null) => {
        if (e) e.preventDefault();
        const textToSend = textOverride || inputText;
        if (!textToSend.trim()) return;

        const userMsg = {
            id: Date.now(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setSuggestedActions([]); // Clear actions while loading
        setIsTyping(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
            const res = await chatService.sendMessage({
                message: textToSend,
                threadId,
                userEmail: userInfo?.email,
                userName: userInfo?.name
            });

            if (res.data.success) {
                const botMsg = {
                    id: Date.now() + 1,
                    text: res.data.reply,
                    sender: 'bot',
                    properties: res.data.suggestedProperties,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };

                setMessages(prev => [...prev, botMsg]);
                
                // Update suggested actions from backend
                if (res.data.suggestedActions && res.data.suggestedActions.length > 0) {
                    setSuggestedActions(res.data.suggestedActions);
                }

                if (res.data.action === 'book_appointment' || textToSend.toLowerCase().includes('book')) {
                    if (res.data.suggestedProperties?.length > 0) {
                        setSelectedProperty(res.data.suggestedProperties[0]);
                        setShowBooking(true);
                    } else if (selectedProperty) {
                        setShowBooking(true);
                    }
                }
            } else {
                throw new Error(res.data.message || "Failed to get AI response");
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I apologize, but I'm having trouble connecting to my knowledge base. Please try again or contact our support directly.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
            setSuggestedActions(["Contact Support", "Try Again"]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!bookingDetails.date || !bookingDetails.timeSlot || !selectedProperty) return;

        try {
            await appointmentService.book({
                propertyId: selectedProperty._id,
                date: bookingDetails.date,
                timeSlot: bookingDetails.timeSlot
            });

            setShowBooking(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: `Excellent! Your showing for ${selectedProperty.title.en} has been requested for ${bookingDetails.date} at ${bookingDetails.timeSlot}. We will confirm shortly.`,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        } catch (error) {
            alert(error.response?.data?.message || "Error booking appointment");
        }
    };

    return (
        <div className="chatbot-luxury-container">
            <button
                className="chatbot-luxury-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <span>✕</span> : <i className="fa-solid fa-comment-dots"></i>}
            </button>

            {isOpen && (
                <div className="chatbot-luxury-window fade-in">
                    <div className="chatbot-luxury-header">
                        <div className="header-brand">
                            <div className="brand-logo">EP</div>
                            <div className="brand-info">
                                <h3>EstatePro AI Concierge</h3>
                                <span className="online-status">AI Assistant Active</span>
                            </div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
                    </div>

                    <div className="chatbot-luxury-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`msg-row ${msg.sender}`}>
                                <div className="msg-content">
                                    <p>{msg.text}</p>
                                    {msg.properties && msg.properties.length > 0 && (
                                        <div className="property-results-container">
                                            {msg.properties.map((prop, idx) => (
                                                <div key={idx} className="property-card-bot">
                                                    <img 
                                                        src={getImageUrl(prop.media?.featuredImage || prop.imageURL)} 
                                                        alt={prop.title?.en || "Property"} 
                                                        onError={(e) => {e.target.src = '/assets/images/property-placeholder.jpg'}}
                                                    />
                                                    <div className="property-card-bot-content">
                                                        <h4>{prop.title?.en}</h4>
                                                        <p><i className="fa-solid fa-location-dot"></i> {prop.location}</p>
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                            <span className="property-card-bot-price">
                                                                ${prop.price?.toLocaleString()}
                                                            </span>
                                                            <button
                                                                className="btn-book-sm"
                                                                onClick={() => { setSelectedProperty(prop); setShowBooking(true); }}
                                                            >
                                                                Book
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <span className="msg-time">{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg-row bot">
                                <div className="typing-dot-animation">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Actions Chips */}
                    {!isTyping && suggestedActions.length > 0 && (
                        <div className="quick-actions-container">
                            {suggestedActions.map((action, index) => (
                                <button 
                                    key={index} 
                                    className="quick-action-chip"
                                    onClick={() => handleSendMessage(null, action)}
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}

                    {showBooking && (
                        <div className="booking-overlay">
                            <div className="booking-card shadow fade-in">
                                <h5>Request Showing</h5>
                                <p className="small text-muted">{selectedProperty?.title?.en}</p>
                                <form onSubmit={handleBooking}>
                                    <input
                                        type="date"
                                        className="form-control mb-2"
                                        required
                                        onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                                    />
                                    <select
                                        className="form-control mb-2"
                                        required
                                        onChange={(e) => setBookingDetails({ ...bookingDetails, timeSlot: e.target.value })}
                                    >
                                        <option value="">Select Time</option>
                                        <option>10:00 AM</option>
                                        <option>11:30 AM</option>
                                        <option>02:00 PM</option>
                                        <option>04:30 PM</option>
                                    </select>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary btn-sm flex-grow-1">Book</button>
                                        <button type="button" className="btn btn-light btn-sm" onClick={() => setShowBooking(false)}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <form className="chatbot-luxury-actions" onSubmit={handleSendMessage}>
                        <div className="input-field-luxury">
                            <input
                                type="text"
                                placeholder="Type your inquiry here..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isTyping}
                            />
                            <button type="submit" className="send-btn" disabled={isTyping || !inputText.trim()}>
                                <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
