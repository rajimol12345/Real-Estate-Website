import React, { useState, useEffect } from 'react';
import { locationService } from '../services/api';
import { Plus, Edit, Trash2, X, Search, MapPin, Building } from 'lucide-react';
import '../Admin.css'; // Re-using general admin styles
import './ManageProperties.css'; // Re-using modal styles

const ManageLocations = () => {
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [activeTab, setActiveTab] = useState('cities');
    const [showCityModal, setShowCityModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [editingArea, setEditingArea] = useState(null);

    const [cityFormData, setCityFormData] = useState({ name: '', status: 'active' });
    const [areaFormData, setAreaFormData] = useState({ cityId: '', name: '', status: 'active' });

    useEffect(() => {
        fetchCities();
        fetchAreas();
    }, []);

    const fetchCities = async () => {
        try {
            const res = await locationService.getCities();
            setCities(res.data);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    const fetchAreas = async () => {
        try {
            const res = await locationService.getAreas();
            setAreas(res.data);
        } catch (error) {
            console.error('Error fetching areas', error);
        }
    };

    const handleCitySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCity) {
                await locationService.updateCity(editingCity._id, cityFormData);
            } else {
                await locationService.createCity(cityFormData);
            }
            setShowCityModal(false);
            setEditingCity(null);
            setCityFormData({ name: '', status: 'active' });
            fetchCities();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving city');
        }
    };

    const handleAreaSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingArea) {
                await locationService.updateArea(editingArea._id, areaFormData);
            } else {
                await locationService.createArea(areaFormData);
            }
            setShowAreaModal(false);
            setEditingArea(null);
            setAreaFormData({ cityId: '', name: '', status: 'active' });
            fetchAreas();
            fetchCities();
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving area');
        }
    };

    const handleDeleteCity = async (id) => {
        if (window.confirm('Are you sure? This will fail if city has areas.')) {
            try {
                await locationService.deleteCity(id);
                fetchCities();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting city');
            }
        }
    };

    const handleDeleteArea = async (id) => {
        if (window.confirm('Are you sure you want to delete this area?')) {
            try {
                await locationService.deleteArea(id);
                fetchAreas();
            } catch (error) {
                alert(error.response?.data?.message || 'Error deleting area');
            }
        }
    };

    return (
        <div className="manage-properties">
            <div className="page-header d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Location Management</h2>
                    <p>Manage Cities and Areas for property listings</p>
                </div>
                <div>
                    {activeTab === 'cities' ? (
                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setEditingCity(null); setCityFormData({ name: '', status: 'active' }); setShowCityModal(true); }}>
                            <Plus size={18} /> Add New City
                        </button>
                    ) : (
                        <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => { setEditingArea(null); setAreaFormData({ cityId: '', name: '', status: 'active' }); setShowAreaModal(true); }}>
                            <Plus size={18} /> Add New Area
                        </button>
                    )}
                </div>
            </div>

            <div className="content-card">
                <div className="card-header-fid p-3 border-bottom">
                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'cities' ? 'active' : ''}`} onClick={() => setActiveTab('cities')}>Cities</button>
                        </li>
                        <li className="nav-item">
                            <button className={`nav-link ${activeTab === 'areas' ? 'active' : ''}`} onClick={() => setActiveTab('areas')}>Areas</button>
                        </li>
                    </ul>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        {activeTab === 'cities' ? (
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>City Name</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cities.map(city => (
                                        <tr key={city._id}>
                                            <td><div className="fw-bold">{city.name}</div></td>
                                            <td><span className={`badge-fid bg-${city.status === 'active' ? 'success' : 'danger'}`}>{city.status}</span></td>
                                            <td className="text-end">
                                                <button className="btn btn-icon text-primary" onClick={() => { setEditingCity(city); setCityFormData({ name: city.name, status: city.status }); setShowCityModal(true); }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn btn-icon text-danger" onClick={() => handleDeleteCity(city._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <table className="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Area Name</th>
                                        <th>City</th>
                                        <th>Status</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {areas.map(area => (
                                        <tr key={area._id}>
                                            <td><div className="fw-bold">{area.name}</div></td>
                                            <td>{area.cityId?.name}</td>
                                            <td><span className={`badge-fid bg-${area.status === 'active' ? 'success' : 'danger'}`}>{area.status}</span></td>
                                            <td className="text-end">
                                                <button className="btn btn-icon text-primary" onClick={() => { setEditingArea(area); setAreaFormData({ cityId: area.cityId?._id || '', name: area.name, status: area.status }); setShowAreaModal(true); }}>
                                                    <Edit size={16} />
                                                </button>
                                                <button className="btn btn-icon text-danger" onClick={() => handleDeleteArea(area._id)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* City Modal */}
            {showCityModal && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid">
                        <div className="modal-header-fid">
                            <h4>{editingCity ? 'Edit City' : 'Add New City'}</h4>
                            <button className="close-btn" onClick={() => setShowCityModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCitySubmit}>
                            <div className="modal-body-fid">
                                <div className="mb-3">
                                    <label className="form-label">City Name</label>
                                    <input type="text" className="form-control" value={cityFormData.name} onChange={e => setCityFormData({ ...cityFormData, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={cityFormData.status} onChange={e => setCityFormData({ ...cityFormData, status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowCityModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingCity ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Area Modal */}
            {showAreaModal && (
                <div className="modal-backdrop-fid">
                    <div className="modal-content-fid">
                        <div className="modal-header-fid">
                            <h4>{editingArea ? 'Edit Area' : 'Add New Area'}</h4>
                            <button className="close-btn" onClick={() => setShowAreaModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAreaSubmit}>
                            <div className="modal-body-fid">
                                <div className="mb-3">
                                    <label className="form-label">Parent City</label>
                                    <select className="form-select" value={areaFormData.cityId} onChange={e => setAreaFormData({ ...areaFormData, cityId: e.target.value })} required>
                                        <option value="">Select City</option>
                                        {cities.map(city => <option key={city._id} value={city._id}>{city.name}</option>)}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Area Name</label>
                                    <input type="text" className="form-control" value={areaFormData.name} onChange={e => setAreaFormData({ ...areaFormData, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select className="form-select" value={areaFormData.status} onChange={e => setAreaFormData({ ...areaFormData, status: e.target.value })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer-fid">
                                <button type="button" className="btn btn-link" onClick={() => setShowAreaModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingArea ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageLocations;
