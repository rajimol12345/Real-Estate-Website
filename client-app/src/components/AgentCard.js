import React from 'react';
import './Agents.css';

const AgentCard = ({ agent }) => {
    return (
        <div className="agent-card-fidelity">
            <div className="agent-image-container">
                <img src={agent.image} alt={agent.name} />
                <div className="agent-social-bar">
                    <a href="#!"><i className="fa-solid fa-plus"></i></a>
                    <a href="#!"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#!"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#!"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#!"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </div>
            <div className="agent-footer">
                <div className="agent-name-box">
                    <h3>{agent.name}</h3>
                </div>
                <div className="agent-phone-btn">
                    <i className="fa-solid fa-phone"></i>
                </div>
            </div>
        </div>
    );
};

export default AgentCard;
