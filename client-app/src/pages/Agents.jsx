import React, { useState, useEffect } from 'react';
import PageCover from '../components/PageCover/PageCover';
import AgentCard from '../components/AgentCard/AgentCard';
import Pagination from '../components/Pagination/Pagination';
import { agentService } from '../services/api';
import './Agents.css';
import pageCoverBg from '../assets/images/slider/8.jpg';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            try {
                const response = await agentService.getAll({
                    page: currentPage,
                    limit: itemsPerPage
                });
                setAgents(response.data.agents);
                setTotalPages(response.data.pages);
            } catch (error) {
                console.error("Error fetching agents:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="agents-page">
            <PageCover title="Our Agents" homeLink="/" currentCrumb="our agents" backgroundImage={pageCoverBg} />
            <section className="agents-grid-section">
                <div className="container">
                    {loading && agents.length === 0 ? (
                        <div className="loading-state">Loading agents...</div>
                    ) : (
                        <>
                            <div className="row">
                                {agents.length > 0 ? (
                                    agents.map((agent) => (
                                        <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={agent._id}>
                                            <AgentCard id={agent._id} name={agent.name} image={agent.photo} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-12 text-center no-data">No agents found.</div>
                                )}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Agents;
