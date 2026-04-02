import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import PageCover from '../components/PageCover/PageCover';
import { agentService, propertyService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './AgentDetails.css';

import pageCoverBg from '../assets/images/slider/8.jpg';

const AgentDetails = () => {
    const { id } = useParams();
    const { getLocalized } = useContext(LanguageContext);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentListings, setRecentListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const agentRes = await agentService.getAgentById(id);
                setAgent(agentRes.data);

                // Fetch random/similar listings for sidebar
                const propsRes = await propertyService.getAll({ limit: 3 });
                setRecentListings(propsRes.data.properties);
            } catch (error) {
                console.error("Error fetching agent details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="loading-state">Loading agent profile...</div>;
    if (!agent) return <div className="error-state">Agent not found.</div>;

    const agentBio = getLocalized(agent.description);

    const socialIcons = [
        { icon: 'fa-google-plus-g', link: '#' },
        { icon: 'fa-twitter', link: '#' },
        { icon: 'fa-linkedin-in', link: '#' },
        { icon: 'fa-facebook-f', link: '#' },
        { icon: 'fa-envelope', link: '#' },
        { icon: 'fa-whatsapp', link: '#' }
    ];

    return (
        <div className="agent-details-page-fidelity">
            <PageCover
                title={agent.name}
                badgedTitle={agent.name}
                homeLink="/"
                currentCrumb={agent.name}
                backgroundImage={pageCoverBg}
            />

            <section className="agent-profile-section">
                <div className="container">
                    <div className="row">
                        {/* Main Profile Area */}
                        <div className="col-lg-8">
                            <div className="agent-profile-card-fid">
                                <div className="agent-photo-container">
                                    <img src={getImageUrl(agent.photo, 'agents')} alt={agent.name} className="img-fluid" />
                                    <div className="agent-social-bar-vertical">
                                        {socialIcons.map((s, i) => (
                                            <a href={s.link} key={i}><i className={`fa-brands ${s.icon}`}></i></a>
                                        ))}
                                    </div>
                                </div>

                                <div className="agent-bio-content">
                                    <h2 className="profile-name-fid">{agent.name}</h2>
                                    <div className="bio-paragraph">
                                        {agentBio || "This agent is a dedicated professional with years of experience in the luxury real estate market."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">
                            <div className="sidebar-fidelity">
                                <div className="widget-fid similar-listings">
                                    <h4 className="widget-title-fid">Similar Listings</h4>
                                    <div className="listing-list-sidebar">
                                        {recentListings.map(listing => (
                                            <div className="sidebar-listing-item" key={listing._id}>
                                                <div className="side-list-img">
                                                    <img src={getImageUrl(listing.imageURL)} alt={getLocalized(listing.title)} />
                                                </div>
                                                <div className="side-list-info">
                                                    <a href={`/listing/${listing._id}`}>{getLocalized(listing.title)}</a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="widget-fid tag-cloud-fid">
                                    <h4 className="widget-title-fid">Tags</h4>
                                    <div className="tags-wrap-fid">
                                        {['photography', 'logo', 'house', 'wp', 'travelling', 'sports', 'business', 'racing'].map(tag => (
                                            <span className="tag-fid" key={tag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="widget-fid text-widget-fid">
                                    <h4 className="widget-title-fid">Text Widget</h4>
                                    <p>
                                        Our agents provide world-class service tailored to your luxury living needs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AgentDetails;
