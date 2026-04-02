import React, { useState, useEffect } from 'react';
import AgentCard from './AgentCard';
import { agentService } from '../services/api';
import { getImageUrl as resolveImg } from '../utils/helpers';
import './Agents.css';

const Agents = () => {
    const [allAgents, setAllAgents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const visibleCount = 4;

    useEffect(() => {
        const fetchAgents = async () => {
            console.log('fetchAgents started, resolveImg is:', typeof resolveImg);
            try {
                const response = await agentService.getAll();
                const agents = response.data.agents || response.data;
                const agentsArray = Array.isArray(agents) ? agents : [];
                const mappedAgents = agentsArray.map(agent => ({
                    id: agent._id,
                    name: agent.name,
                    image: resolveImg(agent.photo, 'agents'),
                    isRealtor: agent.isRealtor
                }));
                setAllAgents(mappedAgents);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching agents:", error);
                setLoading(false);
            }
        };

        fetchAgents();
    }, []);

    const nextSlide = () => {
        if (allAgents.length <= visibleCount) return;
        if (currentIndex < allAgents.length - visibleCount) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // Loop back
        }
    };

    const prevSlide = () => {
        if (allAgents.length <= visibleCount) return;
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(Math.max(0, allAgents.length - visibleCount)); // Loop to end
        }
    };

    if (loading) return null;
    if (allAgents.length === 0) return null;

    return (
        <section className="agents-fidelity-section">
            <div className="container-fluid px-5">
                <div className="section-title text-center">
                    <h2>Our Agents</h2>
                    <div className="yellow-separator"></div>
                </div>

                <div className="carousel-controls text-center">
                    <button onClick={prevSlide} className="carousel-btn"><i className="fa-solid fa-angle-left"></i></button>
                    <button onClick={nextSlide} className="carousel-btn"><i className="fa-solid fa-angle-right"></i></button>
                </div>

                <div className="agents-carousel-wrapper">
                    <div
                        className="agents-carousel-inner"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
                            width: `${(allAgents.length / visibleCount) * 100}%`
                        }}
                    >
                        {allAgents.map(agent => (
                            <div
                                className="carousel-item-box"
                                key={agent.id}
                                style={{ width: `${100 / allAgents.length}%` }}
                            >
                                <AgentCard agent={agent} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Agents;
