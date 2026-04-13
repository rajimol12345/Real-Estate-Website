import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/helpers';
import './AgentCard.css';

const AgentCard = ({ image, name, id }) => {
    return (
        <div className="agent-card-fidelity">
            <div className="agent-image-row">
                <Link to={`/agent/${id}`}>
                    <img
                        src={getImageUrl(image, 'agents')}
                        alt={name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150' }}
                    />
                </Link>
                <div className="agent-social-sidebar">
                    <a href="#!" className="social-icon toggle"><i className="fa-solid fa-plus"></i></a>
                    <a href="#!" className="social-icon"><i className="fa-brands fa-twitter"></i></a>
                    <a href="#!" className="social-icon"><i className="fa-brands fa-linkedin-in"></i></a>
                    <a href="#!" className="social-icon"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#!" className="social-icon"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </div>
            <div className="agent-info-footer">
                <div className="agent-name-box">
                    <Link to={`/agent/${id}`}>{name}</Link>
                </div>
                <div className="agent-phone-box">
                    <a href="#!"><i className="fa-solid fa-phone"></i></a>
                </div>
            </div>
        </div>
    );
};

export default AgentCard;
