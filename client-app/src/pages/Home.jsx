import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import RecentListings from '../components/RecentListings/RecentListings';
import Agents from '../components/Agents';
import Partners from '../components/PartnersLogos/PartnersLogos';
import LatestNews from '../components/LatestNews';
import Testimonials from '../components/Testimonials';

const Home = () => {
  const [filters, setFilters] = React.useState({});

  const handleFilter = (filterData) => {
    console.log("Filter applied:", filterData);
    setFilters(filterData);
  };

  return (
    <div className="home-page">
      <Hero onFilter={handleFilter} />
      <Services />
      <RecentListings filters={filters} />
      <Agents />
      <Partners />
      <LatestNews />
      <Testimonials />
    </div>
  );
};

export default Home;
