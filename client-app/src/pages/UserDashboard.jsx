import React from 'react';
import PageCover from '../components/PageCover/PageCover';
import './UserDashboard.css';
import pageCoverBg from '../assets/images/slider/1.jpg';
import agent1 from '../assets/images/agents/1.jpg';

const UserDashboard = () => {
    return (
        <div className="user-dashboard-page">
            <PageCover title="User Dashboard" homeLink="/" currentCrumb="Dashboard" backgroundImage={pageCoverBg} />

            <section className="dashboard-section">
                <div className="container">
                    <div className="row">
                        {/* Dashboard Sidebar */}
                        <div className="col-md-3">
                            <div className="dashboard-sidebar">
                                <div className="user-info-brief">
                                    <div className="user-avatar">
                                        <img src={agent1} alt="User" />
                                    </div>
                                    <h4>David Walter</h4>
                                    <p>Joined Jan 2024</p>
                                </div>
                                <ul className="dashboard-nav">
                                    <li className="active"><a href="#"><i className="fa-solid fa-user"></i> Profile</a></li>
                                    <li><a href="#"><i className="fa-solid fa-house"></i> My Properties</a></li>
                                    <li><a href="#"><i className="fa-solid fa-lock"></i> Change Password</a></li>
                                    <li><a href="#"><i className="fa-solid fa-right-from-bracket"></i> Logout</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="col-md-9">
                            <div className="dashboard-main-content">
                                <div className="dashboard-header mb-4">
                                    <h3 className="section-subtitle">My <span>Profile</span></h3>
                                </div>

                                <div className="profile-edit-box">
                                    <form className="dashboard-form">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label>First Name</label>
                                                <input type="text" className="form-control" defaultValue="David" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Last Name</label>
                                                <input type="text" className="form-control" defaultValue="Walter" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label>Email Address</label>
                                                <input type="email" className="form-control" defaultValue="david.walter@example.com" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label>Phone Number</label>
                                                <input type="text" className="form-control" defaultValue="+1 234 567 8900" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>About Me</label>
                                            <textarea className="form-control" rows="5" defaultValue="Professional real estate agent with 10 years of experience in the New York market."></textarea>
                                        </div>

                                        <div className="social-links-section mt-4">
                                            <h4 className="inner-title">Social Links</h4>
                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Facebook</label>
                                                    <input type="text" className="form-control" placeholder="URL" />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Twitter</label>
                                                    <input type="text" className="form-control" placeholder="URL" />
                                                </div>
                                            </div>
                                        </div>

                                        <button type="submit" className="btn-save-profile">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;
