import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import './AuthModal.css';

const API_URL = `${API_BASE_URL}/api/auth`;

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) setServerError('');
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Please fill in this field';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Please fill in this field';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (mode === 'register') {
            if (!formData.fullName) {
                newErrors.fullName = 'Please fill in this field';
            }
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Please fill in this field';
            } else if (formData.confirmPassword !== formData.password) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setErrors({});
        setServerError('');
        setFormData({
            email: '',
            password: '',
            fullName: '',
            confirmPassword: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            if (mode === 'login') {
                const response = await axios.post(`${API_URL}/login`, {
                    email: formData.email,
                    password: formData.password
                });
                
                // Save user info to local storage
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                onClose();
                window.location.reload(); // Refresh to update UI
            } else {
                const response = await axios.post(`${API_URL}/register`, {
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password
                });
                
                // Save user info to local storage
                localStorage.setItem('userInfo', JSON.stringify(response.data));
                onClose();
                window.location.reload(); // Refresh to update UI
            }
        } catch (err) {
            console.error(`${mode} error full response:`, err.response?.data);
            const message = err.response?.data?.message || err.message || `An error occurred during ${mode}`;
            setServerError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-close" onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <div className="auth-header">
                    <div className="auth-logo">
                        <h2>estate<span>PRO</span></h2>
                    </div>
                    <div className="auth-tabs">
                        <button
                            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => { setMode('login'); setErrors({}); setServerError(''); }}
                        >
                            Log In
                        </button>
                        <button
                            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
                            onClick={() => { setMode('register'); setErrors({}); setServerError(''); }}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <div className="auth-body">
                    {serverError && <div className="server-error-message">{serverError}</div>}
                    {mode === 'login' ? (
                        <form onSubmit={handleSubmit} className="auth-form fade-in" noValidate>
                            <div className="form-group-fid">
                                <label>EMAIL ADDRESS</label>
                                <div className={`fidelity-auth-input-wrap ${errors.email ? 'error' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group-fid">
                                <label>PASSWORD</label>
                                <div className={`fidelity-auth-input-wrap ${errors.password ? 'error' : ''}`}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-options">
                                <label className="checkbox-container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Remember Me
                                </label>
                                <a href="#" className="forgot-link">Forgot Password?</a>
                            </div>

                            <button type="submit" className="btn-auth-submit" disabled={loading}>
                                {loading ? 'PROCESSING...' : 'LOG IN'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form fade-in" noValidate>
                            <div className="form-group-fid">
                                <label>FULL NAME</label>
                                <div className={`fidelity-auth-input-wrap ${errors.fullName ? 'error' : ''}`}>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                            </div>

                            <div className="form-group-fid">
                                <label>EMAIL ADDRESS</label>
                                <div className={`fidelity-auth-input-wrap ${errors.email ? 'error' : ''}`}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                                {errors.email && <span className="error-message">{errors.email}</span>}
                            </div>

                            <div className="form-group-fid">
                                <label>PASSWORD</label>
                                <div className={`fidelity-auth-input-wrap ${errors.password ? 'error' : ''}`}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password}</span>}
                            </div>

                            <div className="form-group-fid">
                                <label>CONFIRM PASSWORD</label>
                                <div className={`fidelity-auth-input-wrap ${errors.confirmPassword ? 'error' : ''}`}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                                    </button>
                                </div>
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                            </div>

                            <button type="submit" className="btn-auth-submit" disabled={loading}>
                                {loading ? 'PROCESSING...' : 'REGISTER'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="auth-footer">
                    {mode === 'login' ? (
                        <p>Don't have an account? <button onClick={toggleMode}>Register Now</button></p>
                    ) : (
                        <p>Already have an account? <button onClick={toggleMode}>Log In</button></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
