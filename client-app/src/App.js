import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ListingGrid from './pages/ListingGrid';
import ListingList from './pages/ListingList';
import ListingDetails from './pages/ListingDetails';
import Agents from './pages/Agents';
import AgentDetails from './pages/AgentDetails';
import Blog2Col from './pages/Blog2Col';
import Blog3Col from './pages/Blog3Col';
import SinglePost from './pages/SinglePost';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import HomeMap from './pages/HomeMap';
import OwnerInfo from './pages/OwnerInfo';
import MyAccount from './pages/MyAccount';
import Favorites from './pages/Favorites';


import PropertyAdmin from './pages/PropertyAdmin';
import Register from './pages/Register';

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Base Routes */}
        <Route path="/" element={<Home />} />

        {/* Localized Routes */}
        <Route path="/:lng">
          <Route index element={<Home />} />
          <Route path="home-map" element={<HomeMap />} />
          <Route path="properties" element={<ListingGrid />} />
          <Route path="listing-grid" element={<ListingGrid />} />
          <Route path="listing-list" element={<ListingList />} />
          <Route path="listing-details/:id" element={<ListingDetails />} />
          <Route path="agents" element={<Agents />} />
          <Route path="agent/:id" element={<AgentDetails />} />
          <Route path="blog" element={<Blog2Col />} />
          <Route path="contact" element={<Contact />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="favorites" element={<Favorites />} />
          {/* Add more as needed */}
        </Route>

        {/* Standard Routes (Fallback) */}
        <Route path="/home-map" element={<HomeMap />} />
        <Route path="/properties" element={<ListingGrid />} />
        <Route path="/listing-grid" element={<ListingGrid />} />
        <Route path="/listing-list" element={<ListingList />} />
        <Route path="/listing-details/:id" element={<ListingDetails />} />
        <Route path="/property-admin" element={<PropertyAdmin />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agent/:id" element={<AgentDetails />} />
        <Route path="/blog2col" element={<Blog2Col />} />
        <Route path="/blog" element={<Blog2Col />} />
        <Route path="/blog3col" element={<Blog3Col />} />
        <Route path="/single-post/:id" element={<SinglePost />} />
        <Route path="/single-post" element={<SinglePost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/owner-info" element={<OwnerInfo />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
