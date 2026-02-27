import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { Edit, Trash2, X, Search, Plus } from 'lucide-react';
import './ManageUsers.css';

import Pagination from '../components/common/Pagination';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'User'
    });

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const fetchUsers = async () => {
        try {
            const res = await userService.getAll({
                page: currentPage,
                limit: itemsPerPage
            });
            setUsers(res.data.users);
            setTotalCount(res.data.total);
            setTotalPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await userService.update(editingUser._id, formData);
            } else {
                await userService.create(formData);
            }
            setShowModal(false);
            setEditingUser(null);
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't show password on edit
            role: user.role
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(id);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'User'
        });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="manage-users">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Manage Users</h2>
                    <p>Total {totalCount} registered users</p>
                </div>
                <div className="header-actions d-flex gap-3">
                    <div className="search-box-fid">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { resetForm(); setEditingUser(null); setShowModal(true); }}>
                        <Plus size={18} /> Add New User
                    </button>
                </div>
            </div>

            <div className="content-card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-name-fid">{user.name}</div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge-fid ${user.role === 'Admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <button className="btn btn-icon text-primary" onClick={() => handleEdit(user)}>
                                                <Edit size={16} />
                                            </button>
                                            <button className="btn btn-icon text-danger" onClick={() => handleDelete(user._id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid">
                        <div className="modal-header-fid">
                            <h4>{editingUser ? 'Edit User' : 'Add New User'}</h4>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body-fid">
                                <div className="form-group-fid mb-3">
                                    <label>Full Name</label>
                                    <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group-fid mb-3">
                                    <label>Email Address</label>
                                    <input type="email" name="email" className="form-control" value={formData.email} onChange={handleInputChange} required />
                                </div>
                                {!editingUser && (
                                    <div className="form-group-fid mb-3">
                                        <label>Password</label>
                                        <input type="password" name="password" className="form-control" value={formData.password} onChange={handleInputChange} placeholder="Default: estatepro123" />
                                    </div>
                                )}
                                <div className="form-group-fid mb-3">
                                    <label>Role</label>
                                    <select name="role" className="form-select" value={formData.role} onChange={handleInputChange}>
                                        <option value="User">User</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingUser ? 'Update User' : 'Create User'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
