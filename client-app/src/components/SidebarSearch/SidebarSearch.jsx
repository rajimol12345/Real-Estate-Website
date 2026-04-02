import React, { useState } from 'react';
import './SidebarSearch.css';

const SidebarSearch = ({ onSearch }) => {
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
        // Real-time update
        if (onSearch) onSearch(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(formData);
    };

    return (
        <div className="sidebar-search-widget">
            <h3 className="widget-title">Search <span>Properties</span></h3>
            <form className="sidebar-search-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Keyword</label>
                    <input
                        type="text"
                        name="keyword"
                        className="form-control"
                        placeholder="Search title, desc..."
                        value={formData.keyword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Property type</label>
                    <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                        <option value="any">any</option>
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Commercial">Commercial</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Location</label>
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
                <div className="form-group">
                    <label>Beds</label>
                    <select name="beds" className="form-control" value={formData.beds} onChange={handleChange}>
                        <option value="any">any</option>
                        {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Baths</label>
                    <select name="baths" className="form-control" value={formData.baths} onChange={handleChange}>
                        <option value="any">any</option>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Sq ft</label>
                    <select name="sqft" className="form-control" value={formData.sqft} onChange={handleChange}>
                        <option value="any">any</option>
                        {[500, 1000, 2000, 3000, 4000, 5000].map(val => (
                            <option key={val} value={val}>{val}+</option>
                        ))}
                    </select>
                </div>
                <div className="form-row price-inputs">
                    <div className="form-group">
                        <label>Min Price</label>
                        <select name="minPrice" className="form-control" value={formData.minPrice} onChange={handleChange}>
                            <option value="any">any</option>
                            {[1000, 5000, 10000, 50000, 100000].map(val => (
                                <option key={val} value={val}>${val.toLocaleString()}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Max Price</label>
                        <select name="maxPrice" className="form-control" value={formData.maxPrice} onChange={handleChange}>
                            <option value="any">any</option>
                            {[50000, 100000, 500000, 1000000, 5000000].map(val => (
                                <option key={val} value={val}>${val.toLocaleString()}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button type="submit" className="btn-search-sidebar">Search</button>
            </form>
        </div>
    );
};

export default SidebarSearch;
