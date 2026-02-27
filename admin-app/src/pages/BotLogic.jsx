import React, { useState, useEffect } from 'react';
import { botService } from '../services/api';
import { Save, Plus, Trash2, MessageSquare, Palette, HelpCircle, Loader } from 'lucide-react';
import './BotLogic.css';

const BotLogic = () => {
    const [settings, setSettings] = useState({
        welcomeMessage: '',
        luxuryThemeColor: '#1a365d',
        faqs: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await botService.getSettings();
            setSettings(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bot settings', error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await botService.updateSettings(settings);
            alert('Bot settings updated successfully!');
            setSaving(false);
        } catch (error) {
            console.error('Error saving settings', error);
            setSaving(false);
        }
    };

    const addFAQ = () => {
        setSettings({
            ...settings,
            faqs: [...settings.faqs, { question: '', answer: '' }]
        });
    };

    const removeFAQ = (index) => {
        const newFaqs = settings.faqs.filter((_, i) => i !== index);
        setSettings({ ...settings, faqs: newFaqs });
    };

    const updateFAQ = (index, field, value) => {
        const newFaqs = [...settings.faqs];
        newFaqs[index][field] = value;
        setSettings({ ...settings, faqs: newFaqs });
    };

    if (loading) return (
        <div className="d-flex justify-content-center py-5">
            <Loader className="spin" size={32} />
        </div>
    );

    return (
        <div className="bot-logic-page">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Luxury Bot Configuration</h2>
                    <p className="text-muted">Customize your AI concierge's personality and knowledge base.</p>
                </div>
                <button className="btn-save shadow-sm" onClick={handleSave} disabled={saving}>
                    {saving ? <Loader className="spin" size={18} /> : <Save size={18} />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="row">
                <div className="col-lg-5">
                    <div className="config-card glass-panel shadow-sm mb-4">
                        <div className="card-title">
                            <Palette size={20} /> <span>Visual & Tone</span>
                        </div>
                        <div className="form-group mb-4">
                            <label>Welcome Message</label>
                            <textarea
                                className="form-control"
                                rows="3"
                                value={settings.welcomeMessage}
                                onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                            ></textarea>
                            <small className="help-text">The first greeting the user sees when opening the chat.</small>
                        </div>
                        <div className="form-group">
                            <label>Primary Brand Color</label>
                            <div className="color-picker-group">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={settings.luxuryThemeColor}
                                    onChange={(e) => setSettings({ ...settings, luxuryThemeColor: e.target.value })}
                                />
                                <span>{settings.luxuryThemeColor}</span>
                            </div>
                        </div>
                    </div>

                    <div className="config-card glass-panel shadow-sm tip-box">
                        <div className="card-title">
                            <HelpCircle size={20} /> <span>Concierge Tips</span>
                        </div>
                        <p>A professional concierge uses formal language and focuses on high-value lead capture. Ensure your FAQ answers reflect a luxury brand identity.</p>
                    </div>
                </div>

                <div className="col-lg-7">
                    <div className="config-card glass-panel shadow-sm">
                        <div className="card-title d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2">
                                <MessageSquare size={20} /> <span>Knowledge Base (FAQs)</span>
                            </div>
                            <button className="btn-add" onClick={addFAQ}>
                                <Plus size={16} /> Add FAQ
                            </button>
                        </div>

                        <div className="faq-list mt-3">
                            {settings.faqs.map((faq, index) => (
                                <div key={index} className="faq-item border-bottom pb-3 mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <label className="faq-label">Question #{index + 1}</label>
                                        <button className="btn-remove" onClick={() => removeFAQ(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="e.g., Do you offer property management?"
                                        value={faq.question}
                                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                    />
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        placeholder="Enter the automated response..."
                                        value={faq.answer}
                                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                    ></textarea>
                                </div>
                            ))}
                            {settings.faqs.length === 0 && (
                                <div className="text-center py-4 text-muted">
                                    No FAQs defined yet. Use the 'Add FAQ' button to start.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BotLogic;
