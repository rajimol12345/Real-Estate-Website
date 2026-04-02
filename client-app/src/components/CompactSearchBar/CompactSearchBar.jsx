import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import './CompactSearchBar.css';

const CompactSearchBar = ({ onSearch, boundary }) => {
    const { t } = useTranslation();
    const [isFollowing, setIsFollowing] = useState(false);
    const [formData, setFormData] = useState({
        type: 'any',
        location: 'any',
        beds: 'any',
        baths: 'any',
        sqft: 'any',
        minPrice: 'any',
        maxPrice: 'any',
        keyword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        if (onSearch) onSearch(newFormData);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(formData);
    };

    const handleFollowSearch = async () => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) {
            alert("Please log in to follow this search.");
            return;
        }

        const searchName = prompt("Enter a name for this search (e.g., '3 Bed Villas in Miami'):");
        if (!searchName) return;

        try {
            await api.post('/saved-searches', {
                name: searchName,
                filters: formData,
                boundary: boundary ? { type: 'Polygon', coordinates: [JSON.parse(boundary)] } : null
            });
            setIsFollowing(true);
            alert("Search followed! You will receive notifications for new listings matching these criteria.");
        } catch (error) {
            console.error("Error following search:", error);
            alert(error.response?.data?.message || "Failed to follow search.");
        }
    };

    return (
        <section className="homepage_search_fidelity">
            <div className="container fidelity-search-container">
                <div className="search-title-sidebar">
                    <div className="title-inner-compact">
                        <span className="find-text">find your</span>
                        <h2>House</h2>
                    </div>
                </div>
                <div className="search-elements-area">
                    <div className="search-elements-row">
                        <div className="search_element">
                            <label>{t('search.property_type')}</label>
                            <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                                <option value="any">{t('search.any')}</option>
                                <option value="House">House</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Commercial">Commercial</option>
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.location')}</label>
                            <select name="location" className="form-control" value={formData.location} onChange={handleChange}>
                                <option value="any">any</option>
                                <option value="Portland">Portland</option>
                                <option value="Chicago">Chicago</option>
                                <option value="Boston">Boston</option>
                                <option value="Denver">Denver</option>
                                <option value="Los Angeles">Los Angeles</option>
                                <option value="Naples">Naples</option>
                                <option value="Manhattan">Manhattan</option>
                                <option value="Austin">Austin</option>
                                <option value="Miami Beach">Miami Beach</option>
                                <option value="San Francisco">San Francisco</option>
                                <option value="Seattle">Seattle</option>
                                <option value="Beverly Hills">Beverly Hills</option>
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.beds')}</label>
                            <select name="beds" className="form-control" value={formData.beds} onChange={handleChange}>
                                <option value="any">any</option>
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.baths')}</label>
                            <select name="baths" className="form-control" value={formData.baths} onChange={handleChange}>
                                <option value="any">any</option>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.sqft')}</label>
                            <select name="sqft" className="form-control" value={formData.sqft} onChange={handleChange}>
                                <option value="any">any</option>
                                {[500, 1000, 2000, 3000, 4000, 5000].map(val => (
                                    <option key={val} value={val}>{val}+</option>
                                ))}
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.min_price')}</label>
                            <select name="minPrice" className="form-control" value={formData.minPrice} onChange={handleChange}>
                                <option value="any">any</option>
                                {[1000, 5000, 10000, 50000, 100000].map(val => (
                                    <option key={val} value={val}>${val.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search_element">
                            <label>{t('search.max_price')}</label>
                            <select name="maxPrice" className="form-control" value={formData.maxPrice} onChange={handleChange}>
                                <option value="any">any</option>
                                {[50000, 100000, 500000, 1000000, 5000000].map(val => (
                                    <option key={val} value={val}>${val.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>
                        <div className="search_element btn_element_fidelity">
                            <button type="button" onClick={handleSearch} className="btn-fidelity-search">{t('search.search_btn')}</button>
                            <button 
                                type="button" 
                                onClick={handleFollowSearch} 
                                className={`btn-follow-search ${isFollowing ? 'following' : ''}`}
                                title="Follow this search to get notifications for new listings"
                            >
                                <i className={`fa-${isFollowing ? 'solid' : 'regular'} fa-bell`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CompactSearchBar;
