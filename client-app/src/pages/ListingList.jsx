import React, { useState, useEffect } from 'react';
import PageCover from '../components/PageCover/PageCover';
import ListingListItem from '../components/ListingListItem/ListingListItem';
import Pagination from '../components/Pagination/Pagination';
import { propertyService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './ListingList.css';

import PropertiesFilter from '../components/PropertiesFilter/PropertiesFilter';

import pageCoverBg from '../assets/images/slider/8.jpg';

const ListingList = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({});
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const response = await propertyService.getAll({
                    page: currentPage,
                    limit: itemsPerPage,
                    ...filters
                });
                setListings(response.data.properties);
                setTotalPages(response.data.pages);
            } catch (error) {
                console.error("Error fetching listings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [currentPage, filters]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (filterData) => {
        setFilters(filterData);
        setCurrentPage(1);
    };

    return (
        <div className="listing-list-page">
            <PageCover
                title="Listing"
                homeLink="/"
                currentCrumb="listing"
                backgroundImage={pageCoverBg}
            />

            <section className="listing-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <PropertiesFilter onSearch={handleSearch} />
                        </div>
                    </div>

                    <div className="listing-grid-container">
                        {loading ? (
                            <div className="loading-state">Loading properties...</div>
                        ) : (
                            <>
                                <div className="row">
                                    {listings.length > 0 ? (
                                        listings.map((listing, index) => (
                                            <div className="col-md-6" key={listing._id || index}>
                                                <ListingListItem
                                                    id={listing._id}
                                                    image={getImageUrl(listing.media?.featuredImage || listing.imageURL)}
                                                    type={listing.type}
                                                    price={listing.price}
                                                    location={listing.location}
                                                    description={listing.description ? (typeof listing.description === 'string' ? listing.description : listing.description.en) : "Property description not available."}
                                                    sqft={listing.sqft}
                                                    beds={listing.beds}
                                                    isBooked={listing.isBooked}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-results">No properties found matching your criteria.</div>
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
                </div>
            </section>
        </div>
    );
};

export default ListingList;
