import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './OurAgents.css';

import agent1 from '../../assets/images/agents/1.jpg';
import agent2 from '../../assets/images/agents/2.jpg';
import agent3 from '../../assets/images/agents/3.jpg';
import agent4 from '../../assets/images/agents/4.jpg';

const OurAgents = () => {
    const { t } = useTranslation();
    const [activeAgent, setActiveAgent] = useState(null);

    const togglePhoneNumber = (index) => {
        setActiveAgent(activeAgent === index ? null : index);
    };

    const agents = [
        { name: 'David Walter', image: agent1, phone: '900 123 456 789 00' },
        { name: 'John Smith', image: agent2, phone: '900 123 456 789 00' },
        { name: 'George Hammer', image: agent3, phone: '900 123 456 789 00' },
        { name: 'Paul Dark', image: agent4, phone: '900 123 456 789 00' },
    ];

    return (
        <section className="agents-section pt70" style={{ background: '#f9f9f9' }}>
            <div className="container">
                <h2 className="section_title">{t('agents.our_agents')}</h2>
                <div className="agents-slider">
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop={true}
                        showArrows={true}
                        emulateTouch={true}
                        centerMode={true}
                        centerSlidePercentage={25}
                        renderArrowPrev={(onClickHandler, hasPrev, label) =>
                            hasPrev && (
                                <button type="button" onClick={onClickHandler} title={label} className="control-arrow control-prev">
                                    <i className="fa fa-angle-left"></i>
                                </button>
                            )
                        }
                        renderArrowNext={(onClickHandler, hasNext, label) =>
                            hasNext && (
                                <button type="button" onClick={onClickHandler} title={label} className="control-arrow control-next">
                                    <i className="fa fa-angle-right"></i>
                                </button>
                            )
                        }
                    >
                        {agents.map((agent, index) => (
                            <div className="agent-card" key={index}>
                                <div className="row m0">
                                    <div className="row m0 imageRow">
                                        <img src={agent.image} alt={agent.name} className="img-responsive" />
                                        <ul className="nav">
                                            <li><a href="#"><i className="fa fa-google-plus"></i></a></li>
                                            <li><a href="#"><i className="fa fa-twitter"></i></a></li>
                                            <li><a href="#"><i className="fa fa-linkedin"></i></a></li>
                                            <li><a href="#"><i className="fa fa-facebook"></i></a></li>
                                            <li><a href="#"><i className="fa fa-envelope"></i></a></li>
                                        </ul>
                                    </div>
                                    <div className="row m0 agent_details">
                                        <div className={`row m0 phoneNumber ${activeAgent === index ? 'active' : ''}`}>
                                            <i className="fa fa-phone-square"></i>{agent.phone}
                                        </div>
                                        <div className="row m0 inner">
                                            <a href="#">{agent.name}</a>
                                            <span className={`phone_trigger ${activeAgent === index ? 'active' : ''}`} onClick={() => togglePhoneNumber(index)}>
                                                <i className="fa fa-phone-square"></i>
                                                <i className="fa fa-long-arrow-down"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default OurAgents;