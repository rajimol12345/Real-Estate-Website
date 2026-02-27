import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Admin'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const { fullName, email, password, role } = formData;
            const res = await authService.register({
                name: fullName,
                email,
                password,
                role
            });

            if (res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                // Optionally store user info
                localStorage.setItem('adminUser', JSON.stringify(res.data));
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-header">
                    <h2>estate<span>PRO</span></h2>
                    <p>Create Admin Account</p>
                </div>
                {error && <div className="alert alert-danger py-2" style={{ fontSize: '13px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Full Admin Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@estatepro.com"
                            required
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 form-group mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="col-md-6 form-group mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group mb-4">
                        <label>Account Role</label>
                        <select
                            name="role"
                            className="form-select"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Administrator</option>
                            <option value="Manager">Property Manager</option>
                            <option value="Editor">Content Editor</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Create Account</button>
                    <div className="register-footer text-center">
                        <p>Already have an account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
