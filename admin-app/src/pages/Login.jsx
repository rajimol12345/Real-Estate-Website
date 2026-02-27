import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminInfo', JSON.stringify(response.data));
            navigate('/');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid credentials or server error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h2>estate<span>PRO</span></h2>
                    <p>Admin Dashboard Login</p>
                </div>
                {error && <div className="alert alert-danger" style={{ fontSize: '13px', padding: '10px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="login-footer text-center">
                        <p style={{ fontSize: '14px', color: '#777', margin: 0 }}>
                            Don't have an account? <Link to="/register" style={{ color: '#00aeef', fontWeight: '700', textDecoration: 'none' }}>Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
