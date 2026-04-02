import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import PageCover from '../components/PageCover/PageCover';
import ListingCard from '../components/ListingCard/ListingCard';
import api, { propertyService, paymentService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './MyAccount.css';
import pageCoverBg from '../assets/images/slider/1.jpg';

const MyAccount = () => {
    const { getLocalized } = useContext(LanguageContext);
    const [activeTab, setActiveTab] = useState('favorites');
    const [favorites, setFavorites] = useState([]);
    const [savedSearches, setSavedSearches] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));

    // Edit Profile State
    const [profileData, setProfileData] = useState({
        name: userInfo?.name || '',
        email: userInfo?.email || '',
        password: '',
        confirmPassword: ''
    });
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!userInfo) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [favRes, searchRes, bookingRes] = await Promise.all([
                    api.get('/favorites'),
                    api.get('/saved-searches'),
                    paymentService.getMyBookings()
                ]);

                setFavorites(favRes.data);
                setSavedSearches(searchRes.data);
                setBookings(bookingRes.data);
            } catch (error) {
                console.error("Error fetching account data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateMessage({ type: '', text: '' });

        if (!userInfo || !userInfo.token) {
            return setUpdateMessage({
                type: 'danger',
                text: 'Authentication session expired. Please log out and log in again.'
            });
        }

        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            return setUpdateMessage({ type: 'danger', text: 'Passwords do not match' });
        }

        setUpdating(true);
        try {
            console.log('Attempting profile update with token:', userInfo.token.substring(0, 10) + '...');

            const { data } = await api.put('/auth/profile', {
                name: profileData.name,
                email: profileData.email,
                password: profileData.password
            });

            // Update local storage and state
            const updatedUser = { ...userInfo, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUserInfo(updatedUser);
            setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear password fields
            setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            console.error('Profile update error:', error.response?.data);
            const errorMsg = error.response?.data?.message || 'Error updating profile';

            if (error.response?.status === 401) {
                setUpdateMessage({
                    type: 'danger',
                    text: 'Your session has expired or the token is invalid. Please log out and log in again.'
                });
            } else {
                setUpdateMessage({ type: 'danger', text: errorMsg });
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteSearch = async (id) => {
        if (!window.confirm("Are you sure you want to unfollow this search?")) return;
        try {
            await api.delete(`/saved-searches/${id}`);
            setSavedSearches(savedSearches.filter(s => s._id !== id));
        } catch (error) {
            console.error("Error deleting search:", error);
        }
    };

    if (!userInfo) {
        return (
            <div className="account-error-page">
                <div className="container text-center py-5">
                    <h3>Access Denied</h3>
                    <p>Please log in to view your account.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-account-page">
            <PageCover
                title="My Account"
                homeLink="/"
                currentCrumb="Profile"
                backgroundImage={pageCoverBg}
            />

            <section className="account-section py-5">
                <div className="container">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-md-3">
                            <div className="account-sidebar">
                                <div className="user-info-card text-center mb-4">
                                    <div className="user-avatar-large">
                                        {userInfo.name.charAt(0)}
                                    </div>
                                    <h4>{userInfo.name}</h4>
                                    <span>{userInfo.email}</span>
                                </div>
                                <div className="account-nav">
                                    <button
                                        className={activeTab === 'favorites' ? 'active' : ''}
                                        onClick={() => setActiveTab('favorites')}
                                    >
                                        <i className="fa-solid fa-heart"></i> My Favorites
                                    </button>
                                    <button
                                        className={activeTab === 'searches' ? 'active' : ''}
                                        onClick={() => setActiveTab('searches')}
                                    >
                                        <i className="fa-solid fa-bell"></i> Followed Searches
                                    </button>
                                    <button
                                        className={activeTab === 'bookings' ? 'active' : ''}
                                        onClick={() => setActiveTab('bookings')}
                                    >
                                        <i className="fa-solid fa-receipt"></i> My Bookings
                                    </button>
                                    <button
                                        className={activeTab === 'edit-profile' ? 'active' : ''}
                                        onClick={() => setActiveTab('edit-profile')}
                                    >
                                        <i className="fa-solid fa-user-pen"></i> Edit Profile
                                    </button>
                                    <button onClick={() => {
                                        localStorage.removeItem('userInfo');
                                        window.location.href = '/';
                                    }} className="logout-link">
                                        <i className="fa-solid fa-right-from-bracket"></i> Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-md-9">
                            <div className="account-content-area">
                                {loading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border text-primary"></div>
                                    </div>
                                ) : (
                                    <>
                                        {activeTab === 'edit-profile' && (
                                            <div className="tab-content fade-in">
                                                <h3 className="tab-title">Edit <span>Profile</span></h3>
                                                {updateMessage.text && (
                                                    <div className={`alert alert-${updateMessage.type} mb-4`}>
                                                        {updateMessage.text}
                                                    </div>
                                                )}
                                                <form onSubmit={handleUpdateProfile} className="profile-edit-form">
                                                    <div className="row">
                                                        <div className="col-md-6 mb-3">
                                                            <label>Full Name</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={profileData.name}
                                                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label>Email Address</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                value={profileData.email}
                                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-3">
                                                            <label>New Password (leave blank to keep current)</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="••••••••"
                                                                value={profileData.password}
                                                                onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <label>Confirm New Password</label>
                                                            <input
                                                                type="password"
                                                                className="form-control"
                                                                placeholder="••••••••"
                                                                value={profileData.confirmPassword}
                                                                onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary px-5" disabled={updating}>
                                                        {updating ? 'Updating...' : 'Save Changes'}
                                                    </button>
                                                </form>
                                            </div>
                                        )}

                                        {activeTab === 'favorites' && (
                                            <div className="tab-content fade-in">
                                                <h3 className="tab-title">My Favorite <span>Properties</span></h3>
                                                <div className="row">
                                                    {favorites.length > 0 ? (
                                                        favorites.map(fav => (
                                                            <div className="col-md-6 mb-4" key={fav._id}>
                                                                <ListingCard
                                                                    id={fav.property._id}
                                                                    image={getImageUrl(fav.property.imageURL)}
                                                                    type={fav.property.status === 'For Sale' ? 'sale' : 'rent'}
                                                                    price={`$${fav.property.price?.toLocaleString()}`}
                                                                    title={getLocalized(fav.property.title)}
                                                                    location={fav.property.location}
                                                                    sqft={fav.property.sqft}
                                                                    beds={fav.property.beds}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-12 text-center py-5 empty-msg">
                                                            <i className="fa-regular fa-heart"></i>
                                                            <p>You haven't favorited any properties yet.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'searches' && (
                                            <div className="tab-content fade-in">
                                                <h3 className="tab-title">Followed <span>Neighborhoods</span></h3>
                                                <div className="saved-searches-list">
                                                    {savedSearches.length > 0 ? (
                                                        savedSearches.map(search => (
                                                            <div className="search-item-card" key={search._id}>
                                                                <div className="search-info">
                                                                    <h5>{search.name}</h5>
                                                                    <p>
                                                                        {search.filters.type !== 'any' ? `${search.filters.type} • ` : ''}
                                                                        {search.filters.location !== 'any' ? `${search.filters.location} • ` : ''}
                                                                        {search.filters.beds !== 'any' ? `${search.filters.beds}+ Beds` : ''}
                                                                    </p>
                                                                    <span className="search-date">Followed on {new Date(search.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="search-actions">
                                                                    <button
                                                                        className="btn-unfollow"
                                                                        onClick={() => handleDeleteSearch(search._id)}
                                                                    >
                                                                        Unfollow
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="text-center py-5 empty-msg">
                                                            <i className="fa-solid fa-magnifying-glass-location"></i>
                                                            <p>You aren't following any neighborhoods yet.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'bookings' && (
                                            <div className="tab-content fade-in">
                                                <h3 className="tab-title">My <span>Bookings</span></h3>
                                                <div className="row">
                                                    {bookings.length > 0 ? (
                                                        bookings.map(booking => (
                                                            <div className="col-md-6 mb-4" key={booking._id}>
                                                                <div className="booking-receipt-wrapper">
                                                                    <ListingCard
                                                                        id={booking.property._id}
                                                                        image={getImageUrl(booking.property.media?.featuredImage || booking.property.imageURL)}
                                                                        type={booking.property.status === 'For Sale' ? 'sale' : 'rent'}
                                                                        price={`$${booking.property.price?.toLocaleString()}`}
                                                                        title={getLocalized(booking.property.title)}
                                                                        location={booking.property.location}
                                                                        sqft={booking.property.sqft}
                                                                        beds={booking.property.beds}
                                                                        isBooked={true}
                                                                    />
                                                                    <div className="booking-details-footer">
                                                                        <div className="receipt-row">
                                                                            <span>Order ID:</span>
                                                                            <span>{booking.orderId}</span>
                                                                        </div>
                                                                        <div className="receipt-row">
                                                                            <span>Paid:</span>
                                                                            <span className="paid-amount">${booking.amount.toLocaleString()}</span>
                                                                        </div>
                                                                        <div className="receipt-row">
                                                                            <span>Date:</span>
                                                                            <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="col-12 text-center py-5 empty-msg">
                                                            <i className="fa-solid fa-receipt"></i>
                                                            <p>You haven't booked any properties yet.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MyAccount;
