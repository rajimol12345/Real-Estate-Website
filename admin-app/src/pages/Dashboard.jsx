import React, { useState, useEffect } from 'react';
import { Home, Users, UserRound, MessageSquare, Target, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { propertyService, userService, agentService, messageService, leadService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        properties: 0,
        users: 0,
        agents: 0,
        messages: 0,
        leads: 0
    });
    const [recentProperties, setRecentProperties] = useState([]);
    const [recentMessages, setRecentMessages] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [propRes, userRes, agentRes, msgRes, leadRes] = await Promise.all([
                    propertyService.getAll(),
                    userService.getAll(),
                    agentService.getAll(),
                    messageService.getAll(),
                    leadService.getAll()
                ]);

                setStats({
                    properties: propRes.data.total || 0,
                    users: userRes.data.total || 0,
                    agents: agentRes.data.total || 0,
                    messages: msgRes.data.total || 0,
                    leads: leadRes.data.total || 0
                });

                setRecentProperties(propRes.data.properties?.slice(0, 5) || []);
                const messages = msgRes.data.messages || [];
                setRecentMessages(messages.slice(0, 5));
                const leads = leadRes.data.leads || [];
                setRecentLeads(leads.slice(0, 5));

            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { title: 'Total Properties', value: stats.properties, icon: <Home />, color: '#00aeef' },
        { title: 'Registered Users', value: stats.users, icon: <Users />, color: '#2ecc71' },
        { title: 'New Leads', value: stats.leads, icon: <Target />, color: '#f39c12' },
        { title: 'New Messages', value: stats.messages, icon: <MessageSquare />, color: '#e74c3c' },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header mb-4">
                <h2>Overview</h2>
                <p>Welcome back, Admin!</p>
            </div>

            <div className="row">
                {statCards.map((stat, index) => (
                    <div className="col-lg-3 col-md-6 mb-4" key={index}>
                        <div className="stat-card">
                            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-4">
                <div className="col-lg-8">
                    <div className="content-card mb-4">
                        <div className="card-header-fid">
                            <h4>Recent Properties</h4>
                        </div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Property</th>
                                        <th>Location</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentProperties.map(prop => (
                                        <tr key={prop._id}>
                                            <td>{typeof prop.title === 'string' ? prop.title : prop.title?.en}</td>
                                            <td>{prop.location}</td>
                                            <td>${prop.price?.toLocaleString()}</td>
                                            <td><span className={`badge-fid ${prop.status === 'For Sale' ? 'bg-success' : 'bg-info'}`}>{prop.status}</span></td>
                                            <td className="text-end">
                                                <Link to="/gallery" className="btn btn-sm btn-link text-info p-0" title="Manage Gallery">
                                                    <Image size={16} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="content-card">
                        <div className="card-header-fid">
                            <h4>Recent CRM Leads</h4>
                        </div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Interest</th>
                                        <th>Budget</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentLeads.map(lead => (
                                        <tr key={lead._id}>
                                            <td>{lead.name}</td>
                                            <td>{lead.interest}</td>
                                            <td>{lead.budget}</td>
                                            <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="content-card h-100">
                        <div className="card-header-fid">
                            <h4>Recent Messages</h4>
                        </div>
                        <div className="card-body p-0">
                            <ul className="msg-list">
                                {recentMessages.map(msg => (
                                    <li key={msg._id} className="msg-item">
                                        <strong>{msg.name}</strong>
                                        <p>{msg.message?.substring(0, 80)}...</p>
                                        <span>{new Date(msg.createdAt || msg.dateReceived).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
