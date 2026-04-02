import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { LanguageContext } from '../context/LanguageContext';
import PageCover from '../components/PageCover/PageCover';
import ListingCard from '../components/ListingCard/ListingCard';
import Pagination from '../components/Pagination/Pagination';
import { propertyService } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import './ListingGrid.css';

import pageCoverBg from '../assets/images/slider/8.jpg';

import CompactSearchBar from '../components/CompactSearchBar/CompactSearchBar';
import PartnersLogos from '../components/PartnersLogos/PartnersLogos';

const ListingGrid = () => {
  const { getLocalized } = useContext(LanguageContext);
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const itemsPerPage = 6; // Reduced to match screenshot grid (3 columns)

  // Initialize filters from URL on mount or when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const initialFilters = {};
    for (const [key, value] of params.entries()) {
      initialFilters[key] = value;
    }
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await propertyService.getAll({
          page: currentPage,
          limit: itemsPerPage,
          ...filters
        });
        setProperties(response.data.properties);
        setTotalPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [currentPage, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleSearch = (filterData) => {
    setFilters(filterData);
    setCurrentPage(1);
  };

  return (
    <div className="listing-grid-page">
      <PageCover
        title="Listing"
        badgedTitle="Listing"
        homeLink="/"
        currentCrumb="Listing"
        backgroundImage={pageCoverBg}
      />

      <CompactSearchBar onSearch={handleSearch} />

      <section className="listing-section">
        <div className="container">
          {loading ? (
            <div className="loading-state">Loading properties...</div>
          ) : (
            <>
              <div className="row property-grid">
                {properties.length > 0 ? (
                  properties.map((property, index) => (
                    <div className="col-md-4 col-sm-6" key={property._id || index}>
                      <ListingCard
                        id={property._id}
                        image={getImageUrl(property.media?.featuredImage || property.imageURL)}
                        type={property.type}
                        price={property.price}
                        title={getLocalized(property.title)}
                        location={property.location}
                        sqft={property.sqft}
                        beds={property.beds}
                        isBooked={property.isBooked}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-12 no-results text-center">
                    No properties found matching your criteria.
                  </div>
                )}
              </div>
              <div className="row pagination-row">
                <div className="col-12 text-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <PartnersLogos />
    </div>
  );
};

export default ListingGrid;
